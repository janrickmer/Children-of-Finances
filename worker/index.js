// Children of Finances – Cloudflare Worker (API unter /api/*, alles andere sind statische Dateien).
//
// Der Server sieht nie ein Passwort und nie Klartext-Daten. Er prüft nur den aus dem Passwort
// abgeleiteten authKey gegen einen geheimen Prüfwert in D1 und speichert verschlüsselte Blöcke.

const SESSION_MS = 24 * 60 * 60 * 1000;
const MAX_FAILS = 5;
const LOCK_MS = 15 * 60 * 1000;
const MAX_ENTRY_CHARS = 200_000;
const MAX_IMAGE_CHARS = 1_950_000; // D1 erlaubt max. 2 MB pro Zeile
const MAX_ARCHIVE_IDS = 5000;
const ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const LOCKED = ['complete', 'approved'];

const enc = new TextEncoder();
let authCache = null;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    try {
      return await handleApi(request, env, url);
    } catch (err) {
      if (err instanceof HttpError) return json({ error: err.code, ...err.extra }, err.status);
      console.error(err);
      return json({ error: 'server' }, 500);
    }
  },
};

class HttpError extends Error {
  constructor(status, code, extra = {}) {
    super(code);
    this.status = status;
    this.code = code;
    this.extra = extra;
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

async function handleApi(request, env, url) {
  const parts = url.pathname.split('/').filter(Boolean).slice(1); // ohne "api"
  const method = request.method;
  const route = `${method} ${parts[0] || ''}`;

  if (route === 'GET params') return getParams(env);
  if (route === 'POST login') return login(request, env);

  const session = await authenticate(request, env);

  if (route === 'GET state') return getState(env, url);
  if (parts[0] === 'entries' && parts.length === 2 && method === 'PUT') return putEntry(request, env, session, parts[1]);
  if (parts[0] === 'entries' && parts.length === 2 && method === 'DELETE') return deleteEntry(env, session, parts[1]);
  if (parts[0] === 'entries' && parts.length === 3 && parts[2] === 'approve' && method === 'POST') {
    return approveEntry(env, session, parts[1]);
  }
  if (parts[0] === 'images' && parts.length === 2 && method === 'PUT') return putImage(request, env, session, parts[1], url);
  if (parts[0] === 'images' && parts.length === 2 && method === 'GET') return getImage(env, parts[1]);
  if (parts[0] === 'images' && parts.length === 2 && method === 'DELETE') return deleteImage(env, session, parts[1]);
  if (route === 'POST archive') return archive(request, env, session);

  throw new HttpError(404, 'not_found');
}

// ---------------------------------------------------------------- Konfiguration & Sitzung

async function loadAuthConfig(env) {
  if (authCache && Date.now() - authCache.at < 30_000) return authCache;
  const { results } = await env.DB.prepare(
    "SELECT k, v FROM config WHERE k IN ('salt','iterations','verifier_user','verifier_admin','wrapped_user','wrapped_admin','session_key','pw_version')",
  ).all();
  const cfg = Object.fromEntries(results.map((r) => [r.k, r.v]));
  if (!cfg.salt || !cfg.session_key || !cfg.verifier_user || !cfg.verifier_admin) {
    throw new HttpError(503, 'not_initialized');
  }
  const hmacKey = await crypto.subtle.importKey(
    'raw', b64ToBytes(cfg.session_key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
  authCache = { at: Date.now(), cfg, hmacKey };
  return authCache;
}

async function getParams(env) {
  const { cfg } = await loadAuthConfig(env);
  return json({ salt: cfg.salt, iterations: Number(cfg.iterations) });
}

async function login(request, env) {
  const { cfg, hmacKey } = await loadAuthConfig(env);
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const now = Date.now();

  const attempt = await env.DB.prepare('SELECT fails, window_start, locked_until FROM login_attempts WHERE ip = ?')
    .bind(ip).first();
  if (attempt && attempt.locked_until > now) {
    throw new HttpError(429, 'locked', { retryAfter: Math.ceil((attempt.locked_until - now) / 1000) });
  }

  const body = await readJson(request, 1000);
  if (typeof body.authKey !== 'string' || body.authKey.length !== 44) throw new HttpError(400, 'bad_request');
  let authKey;
  try {
    authKey = b64ToBytes(body.authKey);
  } catch {
    throw new HttpError(400, 'bad_request');
  }
  const verifier = await sha256Hex(authKey);

  let role = null;
  if (safeEqual(verifier, cfg.verifier_admin)) role = 'admin';
  else if (safeEqual(verifier, cfg.verifier_user)) role = 'user';

  if (!role) {
    const fresh = !attempt || now - attempt.window_start > LOCK_MS;
    const fails = fresh ? 1 : attempt.fails + 1;
    const lockedUntil = fails >= MAX_FAILS ? now + LOCK_MS : 0;
    await env.DB.prepare(
      'INSERT INTO login_attempts (ip, fails, window_start, locked_until) VALUES (?1, ?2, ?3, ?4) ' +
      'ON CONFLICT(ip) DO UPDATE SET fails = ?2, window_start = ?3, locked_until = ?4',
    ).bind(ip, lockedUntil ? 0 : fails, fresh || lockedUntil ? now : attempt.window_start, lockedUntil).run();
    if (Math.random() < 0.05) {
      await env.DB.prepare('DELETE FROM login_attempts WHERE window_start < ? AND locked_until < ?')
        .bind(now - 86_400_000, now).run();
    }
    if (lockedUntil) throw new HttpError(429, 'locked', { retryAfter: LOCK_MS / 1000 });
    throw new HttpError(401, 'wrong_password', { remaining: MAX_FAILS - fails });
  }

  if (attempt) await env.DB.prepare('DELETE FROM login_attempts WHERE ip = ?').bind(ip).run();

  const expires = now + SESSION_MS;
  const payload = b64url(enc.encode(JSON.stringify({ r: role, e: expires, v: cfg.pw_version || '1' })));
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', hmacKey, enc.encode(payload)));
  return json({
    token: `${payload}.${b64url(sig)}`,
    role,
    expires,
    wrappedKey: role === 'admin' ? cfg.wrapped_admin : cfg.wrapped_user,
  });
}

async function authenticate(request, env) {
  const header = request.headers.get('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const [payload, sig] = token.split('.');
  if (!payload || !sig) throw new HttpError(401, 'unauthorized');
  const { cfg, hmacKey } = await loadAuthConfig(env);
  let ok = false;
  try {
    ok = await crypto.subtle.verify('HMAC', hmacKey, b64urlToBytes(sig), enc.encode(payload));
  } catch {
    ok = false;
  }
  if (!ok) throw new HttpError(401, 'unauthorized');
  const data = JSON.parse(new TextDecoder().decode(b64urlToBytes(payload)));
  if (data.e < Date.now() || data.v !== (cfg.pw_version || '1')) throw new HttpError(401, 'unauthorized');
  return { role: data.r };
}

function requireRole(session, role) {
  if (session.role !== role) throw new HttpError(403, 'forbidden');
}

// ---------------------------------------------------------------- Daten lesen

async function getState(env, url) {
  const knownSeq = url.searchParams.get('seq');
  const since = Number(url.searchParams.get('since') || 0);
  const seqRes = await env.DB.prepare("SELECT v FROM config WHERE k = 'seq'").all();
  const seq = seqRes.results[0]?.v || '0';
  const dbSize = seqRes.meta?.size_after ?? null;
  if (knownSeq !== null && knownSeq === seq) return json({ unchanged: true, seq, dbSize });

  const [entries, extra] = await env.DB.batch([
    env.DB.prepare(
      'SELECT id, kind, status, created_at, updated_at, CASE WHEN updated_at >= ?1 THEN data END AS data FROM entries',
    ).bind(since),
    env.DB.prepare("SELECT k, v FROM config WHERE k IN ('ledger', 'last_archive')"),
  ]);
  const cfg = Object.fromEntries(extra.results.map((r) => [r.k, r.v]));
  return json({
    seq,
    dbSize,
    entries: entries.results,
    ledger: cfg.ledger || null,
    lastArchive: cfg.last_archive ? JSON.parse(cfg.last_archive) : null,
  });
}

// ---------------------------------------------------------------- Einträge schreiben

const BUMP_SEQ = "INSERT INTO config (k, v) VALUES ('seq', '1') ON CONFLICT(k) DO UPDATE SET v = CAST(CAST(v AS INTEGER) + 1 AS TEXT)";

async function putEntry(request, env, session, id) {
  requireRole(session, 'user');
  checkId(id);
  const body = await readJson(request, MAX_ENTRY_CHARS + 1000);
  const { kind, status, data } = body;
  if (!['expense', 'income'].includes(kind)) throw new HttpError(400, 'bad_request');
  if (!['draft', 'incomplete', 'complete'].includes(status)) throw new HttpError(400, 'bad_request');
  if (typeof data !== 'string' || !data || data.length > MAX_ENTRY_CHARS) throw new HttpError(400, 'bad_request');

  const now = Date.now();
  const existing = await env.DB.prepare('SELECT kind, status FROM entries WHERE id = ?').bind(id).first();
  if (existing) {
    if (LOCKED.includes(existing.status)) throw new HttpError(409, 'locked', { status: existing.status });
    if (existing.kind !== kind) throw new HttpError(400, 'bad_request');
    if (existing.status === 'incomplete' && status === 'draft') throw new HttpError(400, 'bad_request');
    const [res] = await env.DB.batch([
      env.DB.prepare("UPDATE entries SET status = ?1, data = ?2, updated_at = ?3 WHERE id = ?4 AND status NOT IN ('complete', 'approved')")
        .bind(status, data, now, id),
      env.DB.prepare(BUMP_SEQ),
    ]);
    if (!res.meta.changes) throw new HttpError(409, 'locked');
  } else {
    await env.DB.batch([
      env.DB.prepare('INSERT INTO entries (id, kind, status, created_at, updated_at, data) VALUES (?1, ?2, ?3, ?4, ?4, ?5)')
        .bind(id, kind, status, now, data),
      env.DB.prepare(BUMP_SEQ),
    ]);
  }
  const row = await env.DB.prepare('SELECT status, created_at, updated_at FROM entries WHERE id = ?').bind(id).first();
  return json(row);
}

async function deleteEntry(env, session, id) {
  requireRole(session, 'user');
  checkId(id);
  const [res] = await env.DB.batch([
    env.DB.prepare("DELETE FROM entries WHERE id = ? AND status = 'draft'").bind(id),
    env.DB.prepare("DELETE FROM images WHERE entry_id = ?1 AND NOT EXISTS (SELECT 1 FROM entries WHERE id = ?1)").bind(id),
    env.DB.prepare(BUMP_SEQ),
  ]);
  if (!res.meta.changes) {
    const row = await env.DB.prepare('SELECT status FROM entries WHERE id = ?').bind(id).first();
    if (row) throw new HttpError(409, 'locked', { status: row.status });
  }
  return json({ ok: true });
}

async function approveEntry(env, session, id) {
  requireRole(session, 'admin');
  checkId(id);
  const [res] = await env.DB.batch([
    env.DB.prepare("UPDATE entries SET status = 'approved', updated_at = ? WHERE id = ? AND kind = 'expense' AND status IN ('draft', 'incomplete')")
      .bind(Date.now(), id),
    env.DB.prepare(BUMP_SEQ),
  ]);
  if (!res.meta.changes) throw new HttpError(409, 'not_approvable');
  return json({ ok: true });
}

// ---------------------------------------------------------------- Bilder

async function putImage(request, env, session, id, url) {
  requireRole(session, 'user');
  checkId(id);
  const entryId = url.searchParams.get('entry') || '';
  checkId(entryId);
  const len = Number(request.headers.get('content-length') || 0);
  if (len > MAX_IMAGE_CHARS) throw new HttpError(413, 'too_large');
  const data = await request.text();
  if (!data || data.length > MAX_IMAGE_CHARS) throw new HttpError(413, 'too_large');
  // Nur Hinzufügen, nie Überschreiben: so können ausstehende Uploads auch nach dem
  // Abschließen eines Eintrags noch nachgereicht werden, ohne dass sich etwas ändern lässt.
  await env.DB.prepare('INSERT OR IGNORE INTO images (id, entry_id, created_at, data) VALUES (?, ?, ?, ?)')
    .bind(id, entryId, Date.now(), data).run();
  return json({ ok: true });
}

async function getImage(env, id) {
  checkId(id);
  const row = await env.DB.prepare('SELECT data FROM images WHERE id = ?').bind(id).first();
  if (!row) throw new HttpError(404, 'not_found');
  return new Response(row.data, {
    headers: { 'content-type': 'text/plain; charset=us-ascii', 'cache-control': 'private, max-age=86400' },
  });
}

async function deleteImage(env, session, id) {
  requireRole(session, 'user');
  checkId(id);
  const row = await env.DB.prepare(
    'SELECT e.status AS status FROM images i LEFT JOIN entries e ON e.id = i.entry_id WHERE i.id = ?',
  ).bind(id).first();
  if (!row) return json({ ok: true });
  if (LOCKED.includes(row.status)) throw new HttpError(409, 'locked');
  await env.DB.prepare('DELETE FROM images WHERE id = ?').bind(id).run();
  return json({ ok: true });
}

// ---------------------------------------------------------------- Sicherung & Löschen (Schatzmeister)

async function archive(request, env, session) {
  requireRole(session, 'admin');
  const body = await readJson(request, 400_000);
  const { ids, ledger } = body;
  if (!Array.isArray(ids) || !ids.length || ids.length > MAX_ARCHIVE_IDS) throw new HttpError(400, 'bad_request');
  ids.forEach(checkId);
  if (typeof ledger !== 'string' || ledger.length > 200_000) throw new HttpError(400, 'bad_request');

  const now = Date.now();
  const statements = [];
  for (let i = 0; i < ids.length; i += 90) {
    const chunk = ids.slice(i, i + 90);
    const marks = chunk.map(() => '?').join(',');
    statements.push(env.DB.prepare(
      `DELETE FROM images WHERE entry_id IN (SELECT id FROM entries WHERE id IN (${marks}) AND status IN ('complete', 'approved'))`,
    ).bind(...chunk));
    statements.push(env.DB.prepare(
      `DELETE FROM entries WHERE id IN (${marks}) AND status IN ('complete', 'approved')`,
    ).bind(...chunk));
  }
  const results = await env.DB.batch(statements);
  const deleted = results.filter((_, i) => i % 2 === 1).reduce((sum, r) => sum + (r.meta.changes || 0), 0);

  await env.DB.batch([
    // Bilder ohne zugehörigen Eintrag (z. B. abgebrochene Entwürfe), die älter als ein Tag sind
    env.DB.prepare('DELETE FROM images WHERE created_at < ? AND entry_id NOT IN (SELECT id FROM entries)')
      .bind(now - 86_400_000),
    env.DB.prepare("INSERT INTO config (k, v) VALUES ('ledger', ?1) ON CONFLICT(k) DO UPDATE SET v = ?1").bind(ledger),
    env.DB.prepare("INSERT INTO config (k, v) VALUES ('last_archive', ?1) ON CONFLICT(k) DO UPDATE SET v = ?1")
      .bind(JSON.stringify({ at: now, count: deleted })),
    env.DB.prepare(BUMP_SEQ),
  ]);
  return json({ deleted });
}

// ---------------------------------------------------------------- Hilfsfunktionen

function checkId(id) {
  if (!ID_RE.test(id)) throw new HttpError(400, 'bad_id');
}

async function readJson(request, maxChars) {
  const text = await request.text();
  if (text.length > maxChars) throw new HttpError(413, 'too_large');
  try {
    return JSON.parse(text);
  } catch {
    throw new HttpError(400, 'bad_request');
  }
}

async function sha256Hex(bytes) {
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
  return Array.from(digest, (b) => b.toString(16).padStart(2, '0')).join('');
}

function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function b64ToBytes(b64) {
  const s = atob(b64);
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}

function b64url(bytes) {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlToBytes(str) {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  return b64ToBytes(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
}
