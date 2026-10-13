#!/usr/bin/env node
// Richtet die Datenbank ein und hinterlegt die Passwort-Prüfwerte – ohne dass ein Passwort
// irgendwo im Klartext gespeichert wird.
//
//   Remote (GitHub Action):  node scripts/setup.mjs
//     benötigt CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, PASSWORD_USER, PASSWORD_ADMIN
//   Lokal (Entwicklung):     PASSWORD_USER=… PASSWORD_ADMIN=… node scripts/setup.mjs --local
//
// Ablauf:
//  1. D1-Datenbank suchen bzw. anlegen und ihre ID in wrangler.toml eintragen
//  2. Tabellen anlegen (schema.sql, idempotent)
//  3. Beim ersten Mal: zufälligen Datenschlüssel erzeugen und für beide Passwörter verpacken.
//     Später: Wurde EIN Passwort geändert, wird der Datenschlüssel mit dem anderen (unveränderten)
//     Passwort entpackt und für das neue Passwort neu verpackt. Alte Anmeldungen werden ungültig.

import { readFile, writeFile, appendFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { deriveKeys, sha256Hex, wrapDek, unwrapDek, bytesToB64, b64ToBytes } from '../public/js/kdf.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DB_NAME = 'children-of-finances';
const WORKER_NAME = 'children-of-finances'; // muss zu "name" in wrangler.toml passen
const ITERATIONS = 600_000;
const LOCAL = process.argv.includes('--local');

function fail(message) {
  console.error(`\nFEHLER: ${message}\n`);
  process.exit(1);
}

const env = process.env;
const pwUser = env.PASSWORD_USER;
const pwAdmin = env.PASSWORD_ADMIN;
if (!pwUser || !pwAdmin) fail('PASSWORD_USER und PASSWORD_ADMIN müssen gesetzt sein (GitHub → Settings → Secrets).');
if (pwUser.trim() === pwAdmin.trim()) fail('PASSWORD_USER und PASSWORD_ADMIN dürfen nicht gleich sein.');
// Schwache Passwörter werden nicht verhindert, aber deutlich angemahnt.
for (const [label, pw] of [['PASSWORD_USER', pwUser], ['PASSWORD_ADMIN', pwAdmin]]) {
  const guessable = /kenia|kenya|mathare|rickmer|children|finance|passwort|password/i.test(pw);
  if (pw.trim().length < 14 || guessable) {
    const msg = `${label} ist kurz oder leicht zu erraten. Empfohlen: mindestens 14 Zeichen, z. B. 4–5 zufällige Wörter.`;
    console.log(process.env.GITHUB_ACTIONS ? `::warning title=Schwaches Passwort::${msg}` : `WARNUNG: ${msg}`);
  }
}
if (!LOCAL && (!env.CLOUDFLARE_API_TOKEN || !env.CLOUDFLARE_ACCOUNT_ID)) {
  fail('CLOUDFLARE_API_TOKEN und CLOUDFLARE_ACCOUNT_ID müssen gesetzt sein (GitHub → Settings → Secrets).');
}
// Häufigster Fehler beim Einrichten: beim Kopieren ist eine zweite Zeile oder ein Leerzeichen mitgerutscht.
if (!LOCAL) {
  if (/\s/.test(env.CLOUDFLARE_API_TOKEN)) {
    const lines = env.CLOUDFLARE_API_TOKEN.trim().split(/\r?\n/).length;
    fail(`Das Secret CLOUDFLARE_API_TOKEN enthält ${lines > 1 ? `${lines} Zeilen` : 'Leerzeichen oder einen Zeilenumbruch'}. ` +
      'Bitte das Secret in GitHub neu speichern und dabei NUR den Token einfügen: eine einzige Zeile, ' +
      'ohne „Bearer“, ohne Leerzeichen und ohne den curl-Befehl, den Cloudflare darunter anzeigt.');
  }
  if (!/^[0-9a-f]{32}$/i.test(env.CLOUDFLARE_ACCOUNT_ID)) {
    fail('Das Secret CLOUDFLARE_ACCOUNT_ID sieht nicht wie eine Cloudflare-Account-ID aus. Erwartet werden genau ' +
      '32 Zeichen aus 0–9 und a–f, eine Zeile, ohne Leerzeichen (zu finden rechts auf der Seite „Workers & Pages“).');
  }
}

// ------------------------------------------------------------------ Datenbankzugriff

async function cfApi(apiPath, init = {}) {
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}${apiPath}`, {
    ...init,
    headers: { Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`, 'content-type': 'application/json' },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.success) {
    const errors = JSON.stringify(body?.errors ?? body);
    if (res.status === 401 || res.status === 403) {
      fail(`Cloudflare lehnt den API-Token ab (${res.status}). Bitte Berechtigungen prüfen (D1: Edit). Details: ${errors}`);
    }
    fail(`Cloudflare-API ${apiPath} antwortet mit ${res.status}: ${errors}`);
  }
  return body.result;
}

let databaseId = null;

async function query(sql, params = []) {
  if (LOCAL) {
    const literal = (v) => (typeof v === 'number' ? String(v) : `'${String(v).replace(/'/g, "''")}'`);
    const inlined = sql.replace(/\?(\d+)/g, (_, n) => literal(params[Number(n) - 1]));
    const out = execFileSync('npx', ['wrangler', 'd1', 'execute', DB_NAME, '--local', '--json', '--command', inlined], {
      cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'],
    });
    return JSON.parse(out)[0]?.results ?? [];
  }
  const result = await cfApi(`/d1/database/${databaseId}/query`, {
    method: 'POST',
    body: JSON.stringify({ sql, params }),
  });
  return result[0]?.results ?? [];
}

async function ensureDatabase() {
  const found = await cfApi(`/d1/database?name=${encodeURIComponent(DB_NAME)}`);
  const existing = (found || []).find((db) => db.name === DB_NAME);
  if (existing) {
    console.log(`D1-Datenbank gefunden: ${existing.uuid}`);
    return existing.uuid;
  }
  // jurisdiction "eu": die Daten bleiben in der EU (lässt sich nur beim Anlegen festlegen).
  const created = await cfApi('/d1/database', { method: 'POST', body: JSON.stringify({ name: DB_NAME, jurisdiction: 'eu' }) });
  console.log(`D1-Datenbank angelegt (Speicherort: EU): ${created.uuid}`);
  return created.uuid;
}

async function writeDatabaseIdToConfig(id) {
  const file = path.join(ROOT, 'wrangler.toml');
  const toml = await readFile(file, 'utf8');
  await writeFile(file, toml.replace(/database_id = "[^"]*"/, `database_id = "${id}"`));
}

async function applySchema() {
  const sql = await readFile(path.join(ROOT, 'schema.sql'), 'utf8');
  const statements = sql
    .split('\n').filter((line) => !line.trim().startsWith('--')).join('\n')
    .split(';').map((s) => s.trim()).filter(Boolean);
  for (const statement of statements) await query(statement);
  console.log(`Tabellen geprüft (${statements.length} Anweisungen).`);
}

// ------------------------------------------------------------------ Schlüssel

// Schreibt alle Werte in EINER Anweisung – entweder alle oder keiner (kein halb geänderter Zustand).
async function setConfig(values) {
  const entries = Object.entries(values);
  const rows = entries.map((_, i) => `(?${2 * i + 1}, ?${2 * i + 2})`).join(', ');
  await query(`INSERT INTO config (k, v) VALUES ${rows} ON CONFLICT(k) DO UPDATE SET v = excluded.v`,
    entries.flatMap(([k, v]) => [k, String(v)]));
}

async function bootstrapKeys() {
  const rows = await query('SELECT k, v FROM config');
  const cfg = Object.fromEntries(rows.map((r) => [r.k, r.v]));

  if (!cfg.salt) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const dek = crypto.getRandomValues(new Uint8Array(32));
    const user = await deriveKeys(pwUser, salt, ITERATIONS);
    const admin = await deriveKeys(pwAdmin, salt, ITERATIONS);
    await setConfig({
      iterations: ITERATIONS,
      verifier_user: await sha256Hex(user.authKey),
      verifier_admin: await sha256Hex(admin.authKey),
      wrapped_user: await wrapDek(user.kek, dek),
      wrapped_admin: await wrapDek(admin.kek, dek),
      session_key: bytesToB64(crypto.getRandomValues(new Uint8Array(32))),
      pw_version: '1',
      seq: '1',
      salt: bytesToB64(salt),
    });
    console.log('Erstmalige Einrichtung abgeschlossen: Datenschlüssel erzeugt und für beide Passwörter verpackt.');
    return;
  }

  const salt = b64ToBytes(cfg.salt);
  const iterations = Number(cfg.iterations);
  const user = await deriveKeys(pwUser, salt, iterations);
  const admin = await deriveKeys(pwAdmin, salt, iterations);
  const userOk = (await sha256Hex(user.authKey)) === cfg.verifier_user;
  const adminOk = (await sha256Hex(admin.authKey)) === cfg.verifier_admin;

  if (userOk && adminOk) {
    console.log('Passwörter unverändert.');
    return;
  }
  if (!userOk && !adminOk) {
    fail('Beide Passwörter weichen von den gespeicherten ab. Bitte immer nur EIN Passwort pro Durchlauf ändern, ' +
      'damit der Datenschlüssel mit dem anderen Passwort entpackt werden kann.');
  }
  const [keep, change, label] = userOk ? [user, admin, 'admin'] : [admin, user, 'user'];
  const dek = await unwrapDek(keep.kek, userOk ? cfg.wrapped_user : cfg.wrapped_admin);
  await setConfig({
    [`verifier_${label}`]: await sha256Hex(change.authKey),
    [`wrapped_${label}`]: await wrapDek(change.kek, dek),
    pw_version: String(Number(cfg.pw_version || '1') + 1),
  });
  console.log(`Passwort „${label === 'admin' ? 'Schatzmeister' : 'Kenia-Team'}“ wurde geändert. Alle bestehenden Anmeldungen sind abgelaufen.`);
}

// ------------------------------------------------------------------ Adresse des Workers

// Die Oberfläche auf GitHub Pages muss wissen, wo der Worker erreichbar ist:
// https://<WORKER_NAME>.<workers.dev-Subdomain des Kontos>.workers.dev
async function workerUrl() {
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/workers/subdomain`, {
    headers: { Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}` },
  });
  const body = await res.json().catch(() => null);
  const subdomain = body?.result?.subdomain;
  if (!res.ok || !subdomain) {
    fail('Für dieses Cloudflare-Konto ist noch keine workers.dev-Subdomain eingerichtet. ' +
      'Bitte im Cloudflare-Dashboard unter „Workers & Pages“ eine Subdomain wählen und den Workflow erneut starten. ' +
      `Details: ${JSON.stringify(body?.errors ?? body)}`);
  }
  return `https://${WORKER_NAME}.${subdomain}.workers.dev`;
}

async function writeApiConfig(url) {
  const file = path.join(ROOT, 'public', 'config.js');
  const js = await readFile(file, 'utf8');
  await writeFile(file, js.replace(/window\.COF_API = '[^']*';/, `window.COF_API = '${url}';`));
  if (env.GITHUB_OUTPUT) await appendFile(env.GITHUB_OUTPUT, `api_url=${url}\n`);
  console.log(`Worker-Adresse: ${url}`);
}

// ------------------------------------------------------------------ Ablauf

if (!LOCAL) {
  databaseId = await ensureDatabase();
  await writeDatabaseIdToConfig(databaseId);
  await writeApiConfig(await workerUrl());
}
await applySchema();
await bootstrapKeys();
console.log('Einrichtung fertig.');
