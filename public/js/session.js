// Anmeldung, Datenschlüssel und verschlüsselte Kommunikation mit dem Worker.
import { deriveKeys, unwrapDek, bytesToB64, b64ToBytes, concat } from './kdf.js';

const STORAGE_KEY = 'cof-session';
// Adresse des Workers (aus config.js). Leer = gleiche Adresse wie die Seite.
const API = String(window.COF_API || '').replace(/\/+$/, '');
const enc = new TextEncoder();
const dec = new TextDecoder();

let session = null; // { token, role, expires, key: CryptoKey }
const expiredHandlers = new Set();

export class ApiError extends Error {
  constructor(status, body) {
    super(body?.error || `HTTP ${status}`);
    this.status = status;
    this.body = body || {};
  }
}

export class NetworkError extends Error {}

export function onExpired(fn) {
  expiredHandlers.add(fn);
}

export function getRole() {
  return session?.role || null;
}

async function importDek(raw) {
  return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

export async function login(password) {
  const params = await request('/api/params', { auth: false });
  const salt = b64ToBytes(params.salt);
  // Nur sichere Parameter akzeptieren (Schutz gegen einen manipulierten Server)
  if (!Number.isInteger(params.iterations) || params.iterations < 600_000 || salt.length < 16) {
    throw new ApiError(500, { error: 'unsafe_params' });
  }
  const { authKey, kek } = await deriveKeys(password, salt, params.iterations);
  const res = await request('/api/login', { method: 'POST', body: { authKey: bytesToB64(authKey) }, auth: false });
  const raw = await unwrapDek(kek, res.wrappedKey);
  session = { token: res.token, role: res.role, expires: res.expires, key: await importDek(raw) };
  // Nur für diesen Browser-Tab (sessionStorage), höchstens 12 Stunden gültig.
  // Hinweis: Browser können einen gerade geschlossenen Tab samt sessionStorage wiederherstellen.
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
      token: res.token, role: res.role, expires: res.expires, dek: bytesToB64(raw),
    }));
  } catch { /* privater Modus: dann eben ohne Wiederherstellung */ }
  raw.fill(0);
  return res.role;
}

export async function restore() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null');
    if (!saved || saved.expires < Date.now() + 60_000) return null;
    session = { token: saved.token, role: saved.role, expires: saved.expires, key: await importDek(b64ToBytes(saved.dek)) };
    return session.role;
  } catch {
    return null;
  }
}

export function logout() {
  session = null;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch { /* ignorieren */ }
}

export async function request(path, { method = 'GET', body, text, auth = true, timeout } = {}) {
  const headers = {};
  if (auth) {
    if (!session) throw new ApiError(401, { error: 'unauthorized' });
    headers.Authorization = `Bearer ${session.token}`;
  }
  let payload;
  if (text !== undefined) {
    payload = text;
    headers['content-type'] = 'text/plain';
  } else if (body !== undefined) {
    payload = JSON.stringify(body);
    headers['content-type'] = 'application/json';
  }
  // Bei schlechter Verbindung nicht ewig warten: abbrechen und später erneut versuchen.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout || (text !== undefined ? 120_000 : 30_000));
  let res;
  try {
    res = await fetch(API + path, { method, headers, body: payload, cache: 'no-store', signal: controller.signal });
  } catch (err) {
    clearTimeout(timer);
    throw new NetworkError(err.message);
  }
  const type = res.headers.get('content-type') || '';
  let data;
  try {
    data = type.includes('application/json') ? await res.json().catch(() => null) : await res.text();
  } catch (err) {
    throw new NetworkError(err.message); // Verbindung beim Lesen der Antwort abgebrochen
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) {
    if (res.status === 401 && auth) expiredHandlers.forEach((fn) => fn());
    // Serverfehler und Überlastung sind vorübergehend: später erneut versuchen, nichts verwerfen.
    const transient = res.status === 429 ? auth : res.status >= 500 && data?.error !== 'not_initialized';
    if (transient) throw new NetworkError(`HTTP ${res.status}`);
    throw new ApiError(res.status, typeof data === 'object' ? data : null);
  }
  return data;
}

// ------------------------------------------------------------------ Verschlüsselung (AES-256-GCM)

export async function encryptBytes(bytes, aad) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, additionalData: enc.encode(aad) }, session.key, bytes));
  return bytesToB64(concat(iv, ct));
}

export async function decryptBytes(b64, aad) {
  const raw = b64ToBytes(b64);
  const pt = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: raw.subarray(0, 12), additionalData: enc.encode(aad) }, session.key, raw.subarray(12));
  return new Uint8Array(pt);
}

export async function encryptJson(obj, aad) {
  return encryptBytes(enc.encode(JSON.stringify(obj)), aad);
}

export async function decryptJson(b64, aad) {
  return JSON.parse(dec.decode(await decryptBytes(b64, aad)));
}
