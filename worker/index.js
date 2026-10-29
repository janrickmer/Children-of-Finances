// Children of Finances – Cloudflare Worker (API unter /api/*, alles andere sind statische Dateien).
//
// Der Server sieht nie ein Passwort und nie Klartext-Daten. Er prüft nur den aus dem Passwort
// abgeleiteten authKey gegen einen geheimen Prüfwert in D1 und speichert verschlüsselte Blöcke.

const SESSION_MS = 12 * 60 * 60 * 1000;
const MAX_FAILS = 5; // Anmeldeversuche pro IP-Adresse (IPv6: pro /64-Netz) …
const LOCK_MS = 15 * 60 * 1000; // … innerhalb von 15 Minuten
const GLOBAL_MAX = 100; // Fehlversuche aller Adressen zusammen …
const GLOBAL_WINDOW_MS = 60 * 60 * 1000; // … innerhalb einer Stunde
const MAX_ENTRY_CHARS = 200_000;
const MAX_IMAGE_CHARS = 1_950_000; // D1 erlaubt max. 2 MB pro Zeile
const MAX_ARCHIVE_IDS = 5000;
const ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const LOCKED = ['complete', 'approved'];
// Ungefähre Euro-Werte der Geldeingänge: täglicher Mittelkurs EUR→KES eines freien Kursdienstes
// (fawazahmed0/currency-api, Daten ab 2.3.2024). Zwei Adressen desselben Dienstes; {day} = JJJJ-MM-TT.
const FX_SOURCES = [
  'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@{day}/v1/currencies/eur.min.json',
  'https://{day}.currency-api.pages.dev/v1/currencies/eur.min.json',
];
const FX_FIRST_DAY = '2024-03-02';
const FX_MAX_DAYS = 40; // Tage pro Anfrage
const FX_MAX_FETCHES = 24; // Abrufe beim Kursdienst pro Anfrage …
const FX_DEADLINE_MS = 12_000; // … und höchstens so lange (der Browser wartet 30 s)
const FX_FETCH_MS = 4000; // pro Abruf

const enc = new TextEncoder();
let authCache = null;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    const cors = corsHeaders(request, env);
    if (request.method === 'OPTIONS') return new Response(null, { status: cors ? 204 : 403, headers: cors || {} });
    let response;
    try {
      response = await handleApi(request, env, url);
    } catch (err) {
      if (err instanceof HttpError) response = json({ error: err.code, ...err.extra }, err.status);
      else {
        console.error(err);
        response = json({ error: 'server' }, 500);
      }
    }
    if (cors) for (const [k, v] of Object.entries(cors)) response.headers.set(k, v);
    return response;
  },
};

// Die Oberfläche liegt auf GitHub Pages (eigene Domain) und ruft die API von dort aus auf.
// Nur die in ALLOWED_ORIGINS (wrangler.toml) eingetragenen Adressen dürfen das.
function corsHeaders(request, env) {
  const origin = request.headers.get('Origin');
  const allowed = String(env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!origin || !allowed.includes(origin)) return null;
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

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
  if (parts[0] === 'entries' && parts.length === 2 && method === 'GET') return getEntry(env, parts[1]);
  if (parts[0] === 'entries' && parts.length === 2 && method === 'PUT') return putEntry(request, env, session, parts[1]);
  if (parts[0] === 'entries' && parts.length === 2 && method === 'DELETE') return deleteEntry(env, session, parts[1]);
  if (parts[0] === 'entries' && parts.length === 3 && parts[2] === 'approve' && method === 'POST') {
    return approveEntry(request, env, session, parts[1]);
  }
  if (parts[0] === 'entries' && parts.length === 3 && parts[2] === 'verify' && method === 'POST') {
    return verifyIncome(request, env, session, parts[1]);
  }
  if (parts[0] === 'entries' && parts.length === 3 && parts[2] === 'remove' && method === 'POST') {
    return removeIncome(request, env, session, parts[1]);
  }
  if (route === 'GET rates') return getRates(env, session, url);
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

// Zählt einen Anmeldeversuch atomar (auch bei vielen parallelen Anfragen) und liefert den neuen Stand.
const COUNT_ATTEMPT = 'INSERT INTO login_attempts (ip, fails, window_start, locked_until) VALUES (?1, 1, ?2, 0) '
  + 'ON CONFLICT(ip) DO UPDATE SET '
  + 'fails = CASE WHEN window_start <= ?2 - ?3 THEN 1 ELSE fails + 1 END, '
  + 'window_start = CASE WHEN window_start <= ?2 - ?3 THEN ?2 ELSE window_start END '
  + 'RETURNING fails, window_start';
const UNCOUNT_ATTEMPT = 'UPDATE login_attempts SET fails = MAX(fails - 1, 0) WHERE ip = ?';

// IPv6-Anschlüsse bekommen meist ein ganzes /64-Netz – darum wird dort pro Netz gezählt.
function ipKey(ip) {
  if (!ip.includes(':')) return ip;
  const [head, tail] = ip.toLowerCase().split('::');
  const h = head ? head.split(':') : [];
  const t = tail ? tail.split(':') : [];
  const full = tail === undefined ? h : [...h, ...Array(Math.max(0, 8 - h.length - t.length)).fill('0'), ...t];
  return `${full.slice(0, 4).map((x) => x.replace(/^0+(?=.)/, '')).join(':')}::/64`;
}

async function login(request, env) {
  const { cfg, hmacKey } = await loadAuthConfig(env);
  const key = ipKey(request.headers.get('CF-Connecting-IP') || 'unknown');
  const now = Date.now();

  const body = await readJson(request, 1000);
  if (typeof body.authKey !== 'string' || body.authKey.length !== 44) throw new HttpError(400, 'bad_request');
  let authKey;
  try {
    authKey = b64ToBytes(body.authKey);
  } catch {
    throw new HttpError(400, 'bad_request');
  }

  // Erst zählen, dann prüfen: so bringen parallele Anfragen keine zusätzlichen Versuche.
  const [mineRes, allRes] = await env.DB.batch([
    env.DB.prepare(COUNT_ATTEMPT).bind(key, now, LOCK_MS),
    env.DB.prepare(COUNT_ATTEMPT).bind('*', now, GLOBAL_WINDOW_MS),
  ]);
  const mine = mineRes.results[0];
  const all = allRes.results[0];
  const lockedFor = (row, windowMs) => Math.max(1, Math.ceil((row.window_start + windowMs - now) / 1000));
  if (mine.fails > MAX_FAILS) throw new HttpError(429, 'locked', { retryAfter: lockedFor(mine, LOCK_MS) });
  if (all.fails > GLOBAL_MAX) throw new HttpError(429, 'locked', { retryAfter: lockedFor(all, GLOBAL_WINDOW_MS) });

  const verifier = await sha256Hex(authKey);
  let role = null;
  if (safeEqual(verifier, cfg.verifier_admin)) role = 'admin';
  else if (safeEqual(verifier, cfg.verifier_user)) role = 'user';

  if (!role) {
    if (Math.random() < 0.05) {
      await env.DB.prepare("DELETE FROM login_attempts WHERE window_start < ? AND ip <> '*'").bind(now - 86_400_000).run();
    }
    const remaining = MAX_FAILS - mine.fails;
    if (remaining <= 0) throw new HttpError(429, 'locked', { retryAfter: lockedFor(mine, LOCK_MS) });
    throw new HttpError(401, 'wrong_password', { remaining });
  }

  // Ein erfolgreicher Versuch zählt nicht als Fehlversuch, setzt den Zähler aber auch nicht zurück
  // (sonst könnte man mit dem Team-Passwort beliebig oft das Schatzmeister-Passwort raten).
  await env.DB.batch([env.DB.prepare(UNCOUNT_ATTEMPT).bind(key), env.DB.prepare(UNCOUNT_ATTEMPT).bind('*')]);

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

async function getEntry(env, id) {
  checkId(id);
  const row = await env.DB.prepare('SELECT id, kind, status, created_at, updated_at, data FROM entries WHERE id = ?').bind(id).first();
  if (!row) throw new HttpError(404, 'not_found');
  return json(row);
}

async function putEntry(request, env, session, id) {
  requireRole(session, 'user');
  checkId(id);
  const body = await readJson(request, MAX_ENTRY_CHARS + 1000);
  const { kind, status, data } = body;
  // Stand, auf dem die Änderung beruht. Weicht der Server ab, hat jemand anderes inzwischen gespeichert.
  const base = Number.isFinite(body.base) && body.base > 0 ? body.base : null;
  if (!['expense', 'income'].includes(kind)) throw new HttpError(400, 'bad_request');
  if (!['draft', 'incomplete', 'complete'].includes(status)) throw new HttpError(400, 'bad_request');
  if (typeof data !== 'string' || !data || data.length > MAX_ENTRY_CHARS) throw new HttpError(400, 'bad_request');

  const now = Date.now();
  const existing = await env.DB.prepare('SELECT kind, status, updated_at FROM entries WHERE id = ?').bind(id).first();
  if (existing) {
    if (LOCKED.includes(existing.status)) throw new HttpError(409, 'locked', { status: existing.status });
    if (existing.kind !== kind) throw new HttpError(400, 'bad_request');
    if (existing.status === 'incomplete' && status === 'draft') throw new HttpError(400, 'bad_request');
    if (base !== null && existing.updated_at !== base) throw new HttpError(409, 'stale');
    const [res] = await env.DB.batch([
      env.DB.prepare("UPDATE entries SET status = ?1, data = ?2, updated_at = ?3 WHERE id = ?4 AND status NOT IN ('complete', 'approved') AND (?5 IS NULL OR updated_at = ?5)")
        .bind(status, data, Math.max(now, existing.updated_at + 1), id, base),
      env.DB.prepare(BUMP_SEQ),
    ]);
    if (!res.meta.changes) {
      const row = await env.DB.prepare('SELECT status FROM entries WHERE id = ?').bind(id).first();
      throw new HttpError(409, row && LOCKED.includes(row.status) ? 'locked' : 'stale');
    }
  } else {
    // Bereits gesicherte und gelöschte Einträge dürfen nicht von einem veralteten Gerät neu angelegt werden.
    const archived = await env.DB.prepare('SELECT 1 FROM tombstones WHERE id = ?').bind(id).first();
    if (archived) throw new HttpError(409, 'archived');
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

async function approveEntry(request, env, session, id) {
  requireRole(session, 'admin');
  checkId(id);
  // Genehmigt wird genau die Fassung, die der Schatzmeister gesehen hat.
  const body = await readJson(request, 1000);
  if (!Number.isFinite(body.updatedAt)) throw new HttpError(400, 'bad_request');
  const [res] = await env.DB.batch([
    env.DB.prepare("UPDATE entries SET status = 'approved', updated_at = ?1 WHERE id = ?2 AND kind = 'expense' AND status IN ('draft', 'incomplete') AND updated_at = ?3")
      .bind(Date.now(), id, body.updatedAt),
    env.DB.prepare(BUMP_SEQ),
  ]);
  if (!res.meta.changes) throw new HttpError(409, 'not_approvable');
  return json({ ok: true });
}

// Der Schatzmeister bestätigt einen Geldeingang. Bei Geldeingängen heißt „approved“: bestätigt.
// Bestätigt wird genau die Fassung, die er gesehen hat.
async function verifyIncome(request, env, session, id) {
  requireRole(session, 'admin');
  checkId(id);
  const body = await readJson(request, 1000);
  if (!Number.isFinite(body.updatedAt)) throw new HttpError(400, 'bad_request');
  const [res] = await env.DB.batch([
    env.DB.prepare("UPDATE entries SET status = 'approved', updated_at = MAX(?1, updated_at + 1) WHERE id = ?2 AND kind = 'income' AND status = 'complete' AND updated_at = ?3")
      .bind(Date.now(), id, body.updatedAt),
    env.DB.prepare(BUMP_SEQ),
  ]);
  if (!res.meta.changes) throw new HttpError(409, 'not_verifiable');
  return json({ ok: true });
}

// Der Schatzmeister löscht einen gespeicherten Geldeingang (z. B. versehentlich doppelt eingetragen).
// Der Grabstein verhindert, dass ein veraltetes Gerät ihn wieder anlegt. Waren dem Geldeingang schon
// gesicherte Ausgaben zugeordnet, schickt der Browser das angepasste, verschlüsselte Ledger mit; es wird
// nur übernommen, wenn der Geldeingang wirklich gelöscht wird. ledgerBase (Prüfsumme des Ledgers, auf dem
// der Browser gerechnet hat) ist immer nötig: Hat sich das Ledger inzwischen geändert (z. B. durch eine
// Sicherung in einem anderen Fenster), muss neu gerechnet werden.
async function removeIncome(request, env, session, id) {
  requireRole(session, 'admin');
  checkId(id);
  const body = await readJson(request, 210_000);
  const { ledger, ledgerBase } = body;
  if (typeof ledgerBase !== 'string' || (ledger !== undefined && (typeof ledger !== 'string' || ledger.length > 200_000))) {
    throw new HttpError(400, 'bad_request');
  }
  await checkLedgerBase(env, ledgerBase);
  const INCOME = "id = ? AND kind = 'income' AND status IN ('complete', 'approved')";
  const statements = [
    env.DB.prepare(`INSERT OR IGNORE INTO tombstones (id, at) SELECT id, ? FROM entries WHERE ${INCOME}`).bind(Date.now(), id),
  ];
  if (ledger !== undefined) {
    statements.push(env.DB.prepare(
      `INSERT INTO config (k, v) SELECT 'ledger', ? WHERE EXISTS (SELECT 1 FROM entries WHERE ${INCOME}) ON CONFLICT(k) DO UPDATE SET v = excluded.v`,
    ).bind(ledger, id));
  }
  statements.push(
    env.DB.prepare(`DELETE FROM images WHERE entry_id IN (SELECT id FROM entries WHERE ${INCOME})`).bind(id),
    env.DB.prepare(`DELETE FROM entries WHERE ${INCOME}`).bind(id),
    env.DB.prepare(BUMP_SEQ),
  );
  const results = await env.DB.batch(statements);
  if (!results[statements.length - 2].meta.changes) {
    const row = await env.DB.prepare('SELECT kind, status FROM entries WHERE id = ?').bind(id).first();
    if (row) throw new HttpError(409, 'not_removable', { kind: row.kind, status: row.status });
    return json({ removed: false }); // gab es nicht (mehr), z. B. inzwischen gesichert oder schon gelöscht
  }
  return json({ removed: true });
}

async function checkLedgerBase(env, ledgerBase) {
  const row = await env.DB.prepare("SELECT v FROM config WHERE k = 'ledger'").first();
  if ((await sha256Hex(enc.encode(row?.v || ''))) !== ledgerBase) throw new HttpError(409, 'stale');
}

// ---------------------------------------------------------------- Wechselkurse (Schatzmeister)

// Liefert für jeden angefragten Tag den Mittelkurs (KSh je Euro). Fehlt für einen Tag ein Kurs,
// gilt der letzte davor (höchstens 6 Tage zurück). Kurse werden in D1 zwischengespeichert;
// fällt der Kursdienst aus, fehlt der Wert einfach (nie ein Serverfehler).
async function getRates(env, session, url) {
  requireRole(session, 'admin');
  const days = [...new Set((url.searchParams.get('days') || '').split(',').filter(Boolean))];
  if (!days.length || days.length > FX_MAX_DAYS || !days.every(isIsoDay)) throw new HttpError(400, 'bad_request');
  const rates = {};
  const { results } = await env.DB.prepare(`SELECT day, kes_per_eur, rate_day FROM fx_rates WHERE day IN (${days.map(() => '?').join(',')})`)
    .bind(...days).all();
  for (const r of results) rates[r.day] = { kesPerEur: r.kes_per_eur, rateDay: r.rate_day };

  const today = isoDay(Date.now());
  const sources = (env.FX_SOURCES || FX_SOURCES.join(',')).split(',').map((x) => x.trim()).filter(Boolean);
  const failed = new Set(); // Quellen, die in dieser Anfrage gestört waren (nicht nur „Tag fehlt“)
  const deadline = Date.now() + FX_DEADLINE_MS;
  const unchecked = [];
  let budget = FX_MAX_FETCHES;
  for (const day of days) {
    if (rates[day] || day < FX_FIRST_DAY || day > shiftDay(today, 1)) continue;
    let found = null;
    let complete = true; // false: Kursdienst gestört oder Zeit/Abrufe aufgebraucht – später erneut versuchen
    for (let back = 0; back < 7 && !found && complete; back++) {
      const d = shiftDay(day, -back);
      if (d < FX_FIRST_DAY) break;
      // Einen Tag zurück nur, wenn alle Quellen sagen, dass es diesen Tag nicht gibt.
      let allMissing = true;
      for (const source of sources) {
        if (failed.has(source)) {
          allMissing = false;
          continue;
        }
        if (budget <= 0 || Date.now() > deadline) {
          allMissing = false;
          break;
        }
        budget--;
        const res = await fetchKesPerEur(source.replace('{day}', d));
        if (res.rate) {
          found = { kesPerEur: res.rate, rateDay: d };
          break;
        }
        if (!res.missing) {
          failed.add(source);
          allMissing = false;
        }
      }
      if (!found && !allMissing) complete = false;
    }
    if (!found) {
      if (!complete) unchecked.push(day);
      continue;
    }
    rates[day] = found;
    // Endgültig ist ein Kurs, wenn er vom Tag selbst stammt oder der Tag eine Woche zurückliegt.
    if (found.rateDay === day || day <= shiftDay(today, -7)) {
      await env.DB.prepare('INSERT INTO fx_rates (day, kes_per_eur, rate_day, fetched_at) VALUES (?, ?, ?, ?) ON CONFLICT(day) DO NOTHING')
        .bind(day, found.kesPerEur, found.rateDay, Date.now()).run();
    }
  }
  return json({ rates, unchecked });
}

async function fetchKesPerEur(address) {
  try {
    const res = await fetch(address, { signal: AbortSignal.timeout(FX_FETCH_MS), headers: { accept: 'application/json' } });
    if (res.status === 404) return { missing: true };
    if (!res.ok) return {};
    const rate = Number((await res.json())?.eur?.kes);
    // Plausibel ist ein Kurs zwischen 20 und 2000 KSh je Euro.
    return Number.isFinite(rate) && rate > 20 && rate < 2000 ? { rate } : {};
  } catch {
    return {};
  }
}

function isIsoDay(day) {
  return /^\d{4}-\d{2}-\d{2}$/.test(day) && isoDay(Date.parse(`${day}T00:00:00Z`)) === day;
}

function isoDay(ms) {
  return Number.isFinite(ms) ? new Date(ms).toISOString().slice(0, 10) : '';
}

function shiftDay(day, n) {
  return isoDay(Date.parse(`${day}T00:00:00Z`) + n * 86_400_000);
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
  const { ids, ledger, ledgerBase } = body;
  if (!Array.isArray(ids) || !ids.length || ids.length > MAX_ARCHIVE_IDS) throw new HttpError(400, 'bad_request');
  ids.forEach(checkId);
  if (typeof ledger !== 'string' || ledger.length > 200_000) throw new HttpError(400, 'bad_request');
  // Hat sich das Ledger seit dem Rechnen geändert (z. B. Geldeingang in einem anderen Fenster gelöscht), neu rechnen.
  if (ledgerBase !== undefined) await checkLedgerBase(env, String(ledgerBase));

  const now = Date.now();
  const chunks = [];
  for (let i = 0; i < ids.length; i += 90) chunks.push(ids.slice(i, i + 90)); // D1: max. 100 Parameter
  const marks = (chunk) => chunk.map(() => '?').join(',');
  const SAVED_ONLY = "status IN ('complete', 'approved')";

  const counts = await env.DB.batch(chunks.map((c) =>
    env.DB.prepare(`SELECT COUNT(*) AS n FROM entries WHERE id IN (${marks(c)}) AND ${SAVED_ONLY}`).bind(...c)));
  const deleted = counts.reduce((sum, r) => sum + (r.results[0]?.n || 0), 0);

  // Alles in einem Batch: entweder wird vollständig gelöscht und das Ledger aktualisiert – oder gar nichts.
  const statements = [];
  for (const c of chunks) {
    statements.push(env.DB.prepare(
      `INSERT OR IGNORE INTO tombstones (id, at) SELECT id, ? FROM entries WHERE id IN (${marks(c)}) AND ${SAVED_ONLY}`,
    ).bind(now, ...c));
    statements.push(env.DB.prepare(
      `DELETE FROM images WHERE entry_id IN (SELECT id FROM entries WHERE id IN (${marks(c)}) AND ${SAVED_ONLY})`,
    ).bind(...c));
    statements.push(env.DB.prepare(`DELETE FROM entries WHERE id IN (${marks(c)}) AND ${SAVED_ONLY}`).bind(...c));
  }
  statements.push(
    // Bilder ohne Eintrag (z. B. abgebrochene Entwürfe), die älter als 30 Tage sind
    env.DB.prepare('DELETE FROM images WHERE created_at < ? AND entry_id NOT IN (SELECT id FROM entries)')
      .bind(now - 30 * 86_400_000),
    env.DB.prepare("INSERT INTO config (k, v) VALUES ('ledger', ?1) ON CONFLICT(k) DO UPDATE SET v = ?1").bind(ledger),
    // Die Kurse gesicherter Geldeingänge stehen ab jetzt verschlüsselt im Ledger; die Tabelle verrät sonst ihre Daten.
    env.DB.prepare('DELETE FROM fx_rates'),
    env.DB.prepare("INSERT INTO config (k, v) VALUES ('last_archive', ?1) ON CONFLICT(k) DO UPDATE SET v = ?1")
      .bind(JSON.stringify({ at: now, count: deleted })),
    env.DB.prepare(BUMP_SEQ),
  );
  await env.DB.batch(statements);
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
