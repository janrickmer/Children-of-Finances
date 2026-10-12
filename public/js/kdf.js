// Schlüsselableitung aus einem Passwort. Wird im Browser UND im Einrichtungsskript
// (scripts/setup.mjs, Node) verwendet – beide Seiten müssen exakt gleich rechnen.
//
// Passwort --PBKDF2-SHA256--> Master --HKDF--> authKey (geht an den Server)
//                                       \--HKDF--> kek (bleibt im Browser, entschlüsselt den Datenschlüssel)

const enc = new TextEncoder();

export function normalizePassword(password) {
  return String(password).normalize('NFC').trim();
}

export async function deriveKeys(password, saltBytes, iterations) {
  const pwKey = await crypto.subtle.importKey(
    'raw', enc.encode(normalizePassword(password)), 'PBKDF2', false, ['deriveBits']);
  const master = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: saltBytes, iterations }, pwKey, 256);
  const hkdf = await crypto.subtle.importKey('raw', master, 'HKDF', false, ['deriveBits', 'deriveKey']);
  const noSalt = new Uint8Array(0);
  const authKey = new Uint8Array(await crypto.subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt: noSalt, info: enc.encode('cof-auth-v1') }, hkdf, 256));
  const kek = await crypto.subtle.deriveKey(
    { name: 'HKDF', hash: 'SHA-256', salt: noSalt, info: enc.encode('cof-kek-v1') },
    hkdf, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  return { authKey, kek };
}

export async function sha256Hex(bytes) {
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
  return Array.from(digest, (b) => b.toString(16).padStart(2, '0')).join('');
}

const DEK_AAD = enc.encode('cof-dek-v1');

// Datenschlüssel (DEK) mit dem passwortabgeleiteten Schlüssel (KEK) verpacken.
export async function wrapDek(kek, dekBytes) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, additionalData: DEK_AAD }, kek, dekBytes));
  return bytesToB64(concat(iv, ct));
}

export async function unwrapDek(kek, wrappedB64) {
  const raw = b64ToBytes(wrappedB64);
  const pt = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: raw.subarray(0, 12), additionalData: DEK_AAD }, kek, raw.subarray(12));
  return new Uint8Array(pt);
}

export function concat(a, b) {
  const out = new Uint8Array(a.length + b.length);
  out.set(a, 0);
  out.set(b, a.length);
  return out;
}

export function bytesToB64(bytes) {
  let s = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    s += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(s);
}

export function b64ToBytes(b64) {
  const s = atob(b64);
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}
