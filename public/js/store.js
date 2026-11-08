// Zentraler Datenbestand + sekündliches Speichern.
//
// Jede Änderung wird innerhalb einer Sekunde verschlüsselt auf dem Gerät (IndexedDB) abgelegt
// und – sobald eine Verbindung besteht – an den Server übertragen. Gesendet wird nur, was sich
// seit dem letzten Mal geändert hat, damit die Gratis-Kontingente von Cloudflare reichen.
import { request, encryptJson, decryptJson, NetworkError, getRole } from './session.js';
import * as images from './images.js';
import * as idb from './idb.js';
import { emptyLedger, SAVED } from './ledger.js';
import { sha256Hex } from './kdf.js';
import { normName } from './util.js';

export const state = {
  entries: new Map(),
  ledger: emptyLedger(),
  ledgerRaw: null, // verschlüsselte Fassung, wie sie der Server hält (für die Versionsprüfung beim Löschen)
  rates: new Map(), // Tag (JJJJ-MM-TT) → { kesPerEur, rateDay } oder null, nur beim Schatzmeister
  requests: [], // Geldanfragen: { id, status (open | read | removed), createdAt, updatedAt, removedAt, d }
  requestDrafts: new Map(), // normName → noch nicht gesendete Geldanfrage auf diesem Gerät (nur Team, je Person eine)
  lastArchive: null,
  dbSize: null,
  seq: null,
  since: 0,
  sync: 'saved', // saved | saving | offline
};

const listeners = new Set();
const pendingDeletes = new Set();
const persistQueue = new Set();
let timer = null;
let pollTimer = null;
let busy = false;
let failures = 0;
let nextAttempt = 0;
let refreshNeeded = false;
let conflictHandler = () => {};

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit(reason) {
  for (const fn of listeners) fn(reason);
}

export function onConflict(fn) {
  conflictHandler = fn;
}

function setSync(value) {
  if (state.sync !== value) {
    state.sync = value;
    emit('sync');
  }
}

export function isDirty(e) {
  return e.rev > e.syncedRev;
}

export function list() {
  return [...state.entries.values()];
}

// ------------------------------------------------------------------ Einträge bearbeiten

export function emptyData(kind, name) {
  const base = { createdBy: name, editedBy: name, clientCreatedAt: Date.now() };
  if (kind === 'income') return { ...base, from: '', amount: '', date: '' };
  return { ...base, what: '', payDate: '', amount: '', receipts: [], transfers: [], note: '' };
}

export function createEntry(kind, name) {
  const e = {
    id: crypto.randomUUID(), kind, status: 'draft', createdAt: Date.now(), updatedAt: 0,
    d: emptyData(kind, name), rev: 0, syncedRev: 0, onServer: false, touched: new Set(),
  };
  state.entries.set(e.id, e);
  return e;
}

export function update(e, patch, name) {
  if (SAVED.includes(e.status)) return;
  Object.assign(e.d, patch);
  Object.keys(patch).forEach((k) => e.touched.add(k));
  if (name) {
    e.d.editedBy = name;
    e.touched.add('editedBy');
  }
  e.rev++;
  persistQueue.add(e.id);
}

export function setStatus(e, status) {
  e.status = status;
  e.rev++;
  persistQueue.add(e.id);
}

export function removeDraft(e) {
  if (e.status !== 'draft') return;
  for (const id of [...(e.d.receipts || []), ...(e.d.transfers || [])]) images.removeImage(id);
  state.entries.delete(e.id);
  idb.remove('entries', e.id);
  persistQueue.delete(e.id);
  if (e.onServer || e.rev > 0) {
    pendingDeletes.add(e.id);
    idb.put('deletes', `entry:${e.id}`, { type: 'entry', id: e.id });
  }
}

export function isEmpty(e) {
  const d = e.d;
  if (e.kind === 'income') return !d.from?.trim() && !d.amount && !d.date;
  return !d.what?.trim() && !d.payDate && !d.amount && !d.receipts.length && !d.transfers.length && !d.note?.trim();
}

// Welche Pflichtangaben fehlen? (Spalten 1–4)
export function missing(e) {
  const d = e.d;
  const out = [];
  if (e.kind === 'income') {
    if (!d.from?.trim()) out.push('from');
    if (!(Number.parseFloat(d.amount) > 0)) out.push('amount');
    if (!d.date) out.push('date');
    return out;
  }
  if (!d.what?.trim()) out.push('what');
  if (!d.payDate) out.push('date');
  if (!(Number.parseFloat(d.amount) > 0)) out.push('amount');
  if (!d.receipts?.length) out.push('receipt');
  return out;
}

// ------------------------------------------------------------------ Lokale Sicherung

async function persistLocal() {
  const ids = [...persistQueue];
  persistQueue.clear();
  for (const id of ids) {
    const e = state.entries.get(id);
    if (!e || !isDirty(e)) continue;
    const cipher = await encryptJson(e.d, `entry:${e.id}`);
    await idb.put('entries', e.id, {
      id: e.id, kind: e.kind, status: e.status, createdAt: e.createdAt, updatedAt: e.updatedAt, touched: [...e.touched], cipher,
    });
  }
}

export async function loadFromDevice() {
  await images.loadPendingFromDevice();
  for (const item of await idb.getAll('deletes')) {
    if (item.type === 'entry') pendingDeletes.add(item.id);
    if (item.type === 'request-draft') {
      try {
        const d = await decryptJson(item.cipher, 'request-draft');
        state.requestDrafts.set(normName(d.createdBy), d);
      } catch (err) {
        console.warn('Entwurf der Geldanfrage nicht lesbar', err);
      }
    }
  }
  for (const item of await idb.getAll('entries')) {
    try {
      const d = await decryptJson(item.cipher, `entry:${item.id}`);
      state.entries.set(item.id, {
        id: item.id, kind: item.kind, status: item.status, createdAt: item.createdAt, updatedAt: item.updatedAt || 0,
        d, rev: 1, syncedRev: 0, onServer: Boolean(item.updatedAt), touched: new Set(item.touched || Object.keys(d)),
      });
    } catch (err) {
      console.warn('Lokaler Eintrag nicht lesbar', err);
    }
  }
}

// ------------------------------------------------------------------ Synchronisation

// Jemand anderes hat denselben Eintrag inzwischen gespeichert: Serverstand holen und nur die Felder
// darüberlegen, die auf diesem Gerät geändert wurden. Der Eintrag bleibt "dirty" und wird erneut gesendet.
async function mergeWithServer(e) {
  let row;
  try {
    row = await request(`/api/entries/${e.id}`);
  } catch (err) {
    if (err.status !== 404) throw err;
    e.onServer = false;
    e.updatedAt = 0;
    return;
  }
  const server = await decryptJson(row.data, `entry:${e.id}`);
  if (SAVED.includes(row.status)) {
    Object.assign(e, { d: server, status: row.status, updatedAt: row.updated_at, syncedRev: e.rev });
    e.touched.clear();
    await idb.remove('entries', e.id);
    conflictHandler();
  } else {
    const merged = { ...server };
    for (const k of e.touched) merged[k] = e.d[k];
    e.d = merged;
    if (e.status === 'draft' && row.status !== 'draft') e.status = row.status;
    Object.assign(e, { updatedAt: row.updated_at, createdAt: row.created_at, onServer: true });
    persistQueue.add(e.id);
  }
  emit('remote');
}

async function pushChanges() {
  for (const id of [...pendingDeletes]) {
    try {
      await request(`/api/entries/${id}`, { method: 'DELETE' });
    } catch (err) {
      if (!images.isFinalRejection(err)) throw err;
    }
    pendingDeletes.delete(id);
    await idb.remove('deletes', `entry:${id}`);
  }

  // Einträge vor den Bildern senden, damit kein Bild ohne zugehörigen Eintrag auf dem Server liegt.
  for (const e of list().filter(isDirty)) {
    const rev = e.rev;
    const data = await encryptJson(e.d, `entry:${e.id}`);
    try {
      const res = await request(`/api/entries/${e.id}`, {
        method: 'PUT', body: { kind: e.kind, status: e.status, data, base: e.updatedAt || null },
      });
      e.syncedRev = Math.max(e.syncedRev, rev);
      e.onServer = true;
      e.createdAt = res.created_at;
      e.updatedAt = res.updated_at;
      if (e.rev === rev) e.touched.clear();
    } catch (err) {
      if (!images.isFinalRejection(err)) throw err;
      const code = err.body?.error;
      if (code === 'stale') {
        await mergeWithServer(e);
        continue;
      }
      if (code === 'archived') {
        // Wurde bereits gesichert und gelöscht – die veraltete Kopie auf diesem Gerät verwerfen.
        state.entries.delete(e.id);
        await idb.remove('entries', e.id);
        conflictHandler();
        emit('remote');
        continue;
      }
      // Eintrag wurde inzwischen abgeschlossen oder abgelehnt: Serverstand gilt.
      e.syncedRev = e.rev;
      e.touched.clear();
      refreshNeeded = true;
      if (err.status === 409) conflictHandler();
      else console.error('Eintrag abgelehnt', err);
    }
    if (!isDirty(e)) await idb.remove('entries', e.id);
  }

  await images.flush();
}

async function tick() {
  if (busy || getRole() !== 'user') return;
  busy = true;
  try {
    // Auf dem Gerät sichern – immer, auch wenn der Server gerade nicht antwortet.
    if (persistQueue.size) await persistLocal();
    // Nicht senden, während eine Abfrage läuft (sonst könnte deren ältere Antwort neue Daten überschreiben).
    if (refreshing) return;
    const work = pendingDeletes.size || images.hasWork() || list().some(isDirty);
    if (!work && !refreshNeeded) {
      setSync('saved');
      return;
    }
    if (Date.now() < nextAttempt) return;
    if (work) {
      setSync('saving');
      await pushChanges();
    }
    failures = 0;
    if (refreshNeeded) {
      refreshNeeded = false;
      await refresh(true);
    }
    setSync(list().some(isDirty) || images.hasWork() ? 'saving' : 'saved');
  } catch (err) {
    if (err instanceof NetworkError) {
      failures++;
      nextAttempt = Date.now() + Math.min(30_000, 1000 * 2 ** failures);
      setSync('offline');
    } else if (err.status !== 401) {
      console.error(err);
    }
  } finally {
    busy = false;
  }
}

let refreshing = null;

export async function refresh(full = false) {
  while (refreshing) await refreshing.catch(() => {});
  refreshing = doRefresh(full);
  try {
    return await refreshing;
  } finally {
    refreshing = null;
  }
}

async function doRefresh(full) {
  // 2 Minuten Überlappung, damit kein Schreibvorgang übersprungen wird, der zeitgleich gespeichert wurde.
  const params = new URLSearchParams({ since: String(full ? 0 : Math.max(0, state.since - 120_000)) });
  if (!full && state.seq) params.set('seq', state.seq);
  const res = await request(`/api/state?${params}`);
  if (res.dbSize != null) state.dbSize = res.dbSize;
  if (res.unchanged) return false;
  let needFull = false;
  const seen = new Set();

  for (const row of res.entries) {
    seen.add(row.id);
    let d = null;
    if (row.data != null) {
      try {
        d = await decryptJson(row.data, `entry:${row.id}`);
      } catch (err) {
        console.warn('Eintrag nicht entschlüsselbar', row.id, err);
        continue;
      }
    }
    let e = state.entries.get(row.id);
    const locked = SAVED.includes(row.status);
    state.since = Math.max(state.since, row.updated_at);
    if (e && isDirty(e) && !locked) continue; // eigene, noch nicht übertragene Änderungen haben Vorrang
    if (e && !isDirty(e) && e.updatedAt && row.updated_at < e.updatedAt) continue; // Antwort ist älter als unser Stand
    if (e && isDirty(e) && locked) {
      e.syncedRev = e.rev; // jemand anderes hat abgeschlossen
      e.touched.clear();
      idb.remove('entries', e.id);
      if (d == null) needFull = true;
    }
    if (d != null) {
      if (!e) {
        e = { id: row.id, kind: row.kind, rev: 0, syncedRev: 0, touched: new Set() };
        state.entries.set(row.id, e);
      }
      Object.assign(e, { status: row.status, createdAt: row.created_at, updatedAt: row.updated_at, d, onServer: true });
    } else if (e) {
      Object.assign(e, { status: row.status, createdAt: row.created_at, onServer: true });
    } else {
      needFull = true;
    }
  }
  for (const [id, e] of state.entries) {
    if (!seen.has(id) && e.onServer && !isDirty(e)) state.entries.delete(id);
  }

  state.requests = await readRequests(res.requests || []);
  // Antwort beim Senden verloren gegangen? Steht die Anfrage schon auf dem Server, ist der Entwurf erledigt.
  if (!sendingRequest) {
    for (const d of [...state.requestDrafts.values()]) {
      if (!state.requests.some((r) => r.id === d.id)) continue;
      clearRequestDraft(d);
      arrived.push(d);
    }
  }
  state.ledger = res.ledger ? await decryptJson(res.ledger, 'ledger').catch(() => emptyLedger()) : emptyLedger();
  state.ledgerRaw = res.ledger || null;
  state.lastArchive = res.lastArchive;
  state.seq = res.seq;
  if (needFull) return doRefresh(true);
  emit('remote');
  return true;
}

export function changed() {
  emit('local');
}

export function start() {
  stop();
  timer = setInterval(tick, 1000);
  const poll = async () => {
    if (document.visibilityState === 'visible' && !busy) {
      try {
        await refresh();
      } catch { /* nächster Versuch beim nächsten Intervall */ }
    }
  };
  pollTimer = setInterval(poll, getRole() === 'admin' ? 20_000 : 15_000);
  onVisible = poll;
  document.addEventListener('visibilitychange', onVisible);
  window.addEventListener('beforeunload', warnUnsaved);
}

let onVisible = null;

export function stop() {
  clearInterval(timer);
  clearInterval(pollTimer);
  if (onVisible) document.removeEventListener('visibilitychange', onVisible);
  window.removeEventListener('beforeunload', warnUnsaved);
}

export function flushNow() {
  return tick();
}

function warnUnsaved(ev) {
  if (state.sync !== 'saved') {
    ev.preventDefault();
    ev.returnValue = '';
  }
}

export function reset() {
  pendingDeletes.clear();
  persistQueue.clear();
  images.resetMemory();
  refreshNeeded = false;
  failures = 0;
  nextAttempt = 0;
  state.entries.clear();
  state.ledger = emptyLedger();
  state.ledgerRaw = null;
  state.rates.clear();
  rateTried.clear();
  state.requests = [];
  state.requestDrafts.clear();
  requestCache.clear();
  dirtyDrafts.clear();
  arrived = [];
  clearTimeout(draftTimer);
  state.lastArchive = null;
  state.seq = null;
  state.since = 0;
}

// ------------------------------------------------------------------ Schatzmeister

export async function approve(e) {
  await request(`/api/entries/${e.id}/approve`, { method: 'POST', body: { updatedAt: e.updatedAt } });
  await refresh(true);
}

// Geldeingang bestätigen: passt zu einer Zahlung von Children of Mathare Germany.
export async function verifyIncome(e) {
  await request(`/api/entries/${e.id}/verify`, { method: 'POST', body: { updatedAt: e.updatedAt } });
  await refresh(true);
}

// Geldeingang löschen (z. B. doppelt eingetragen). `nextLedger` nur, wenn sich das Ledger ändert;
// `ledgerRaw` ist die verschlüsselte Fassung, auf der gerechnet wurde. Liefert false, wenn es den
// Geldeingang nicht mehr gab (z. B. inzwischen gesichert).
export async function removeIncome(e, nextLedger, ledgerRaw) {
  const body = { ledgerBase: await ledgerHash(ledgerRaw) };
  if (nextLedger) body.ledger = await encryptJson(nextLedger, 'ledger');
  const res = await request(`/api/entries/${e.id}/remove`, { method: 'POST', body });
  await refresh(true);
  return res.removed !== false;
}

function ledgerHash(raw) {
  return sha256Hex(new TextEncoder().encode(raw || ''));
}

// Tageskurse (KSh je Euro) für die angegebenen Tage holen, neueste zuerst. Bekannte Kurse werden nicht
// erneut abgefragt; Tage, für die der Kursdienst nichts hatte, frühestens nach 10 Minuten wieder.
// Liefert true, wenn neue Kurse dazugekommen sind.
const rateTried = new Map();

export async function loadRates(days) {
  const now = Date.now();
  const missing = [...new Set(days)]
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d) && !state.rates.get(d) && !(now - (rateTried.get(d) || 0) < 600_000))
    .sort()
    .reverse()
    .slice(0, 40);
  if (!missing.length) return false;
  missing.forEach((d) => rateTried.set(d, now)); // nicht doppelt anfragen, solange die Antwort aussteht
  try {
    const res = await request(`/api/rates?days=${missing.join(',')}`);
    let added = false;
    for (const d of missing) {
      const r = res.rates?.[d];
      if (r && Number.isFinite(r.kesPerEur)) {
        state.rates.set(d, r);
        added = true;
      }
    }
    // Tage, die der Server diesmal nicht prüfen konnte (Kursdienst gestört, Zeit aufgebraucht): bald erneut
    for (const d of res.unchecked || []) rateTried.delete(d);
    return added;
  } catch {
    missing.forEach((d) => rateTried.delete(d));
    return false;
  }
}

export async function archive(ids, ledger, ledgerRaw) {
  const encrypted = await encryptJson(ledger, 'ledger');
  const res = await request('/api/archive', { method: 'POST', body: { ids, ledger: encrypted, ledgerBase: await ledgerHash(ledgerRaw) } });
  await refresh(true);
  return res.deleted;
}

// ------------------------------------------------------------------ Geldanfragen

// Entschlüsselte Inhalte merken, damit nicht bei jeder Abfrage alles neu entschlüsselt wird.
const requestCache = new Map();
const dirtyDrafts = new Set();
let draftTimer = null;
let arrived = []; // Entwürfe, deren Anfrage sich beim Abgleich als angekommen herausstellte (für eine Meldung)
let sendingRequest = false;

async function readRequests(rows) {
  const out = [];
  for (const row of rows) {
    let cached = requestCache.get(row.id);
    if (!cached || cached.updatedAt !== row.updated_at) {
      try {
        cached = { updatedAt: row.updated_at, d: await decryptJson(row.data, `request:${row.id}`) };
      } catch (err) {
        // Nicht lesbar (beschädigt oder nicht mit dem Datenschlüssel verschlüsselt): ohne Inhalt zeigen,
        // damit der Schatzmeister sie löschen kann und sie nicht unsichtbar Platz belegt.
        console.warn('Geldanfrage nicht entschlüsselbar', row.id, err);
        cached = { updatedAt: row.updated_at, d: null };
      }
      requestCache.set(row.id, cached);
    }
    out.push({
      id: row.id, status: row.status, createdAt: row.created_at, updatedAt: row.updated_at, removedAt: row.removed_at, d: cached.d,
    });
  }
  const ids = new Set(rows.map((r) => r.id));
  for (const id of requestCache.keys()) if (!ids.has(id)) requestCache.delete(id);
  return out;
}

export const REQUEST_FIELDS = ['person', 'purpose', 'from', 'to', 'amount', 'deadline'];

// Jede Person hat auf dem Gerät ihren eigenen Entwurf (mehrere Leute können dasselbe Gerät nutzen).
export function getRequestDraft(name) {
  return state.requestDrafts.get(normName(name)) || null;
}

export function updateRequestDraft(name, patch) {
  const key = normName(name);
  let d = state.requestDrafts.get(key);
  if (d?.pending) return d; // Ausgang des letzten Sendeversuchs unklar: Inhalt bleibt, wie er gesendet wurde
  if (!d) {
    d = { id: crypto.randomUUID(), createdBy: name, ...Object.fromEntries(REQUEST_FIELDS.map((k) => [k, ''])) };
    state.requestDrafts.set(key, d);
  }
  Object.assign(d, patch);
  saveDraftSoon(d);
  return d;
}

export function requestDraftEmpty(d) {
  return !d || REQUEST_FIELDS.every((k) => !String(d[k] || '').trim());
}

// Welche Angaben fehlen? (alle Felder sind Pflicht; ein Betrag muss größer als 0 sein)
export function requestMissing(d) {
  return REQUEST_FIELDS.filter((k) => (k === 'amount' ? !(Number.parseFloat(d?.amount) > 0) : !String(d?.[k] || '').trim()));
}

function saveDraftSoon(d) {
  dirtyDrafts.add(d);
  clearTimeout(draftTimer);
  draftTimer = setTimeout(flushDrafts, 400);
}

async function flushDrafts() {
  const list = [...dirtyDrafts];
  dirtyDrafts.clear();
  for (const d of list) await saveRequestDraft(d);
}

// Verschlüsselt auf dem Gerät sichern, damit beim Neuladen nichts verloren geht.
// Schlüssel ist die zufällige ID des Entwurfs, damit dort kein Name im Klartext steht.
// Ist der Entwurf nicht mehr im Speicher (gesendet oder abgemeldet), bleibt die Gerätekopie unberührt:
// Nach dem Senden löscht clearRequestDraft sie selbst, nach dem Abmelden wird sie noch gebraucht.
async function saveRequestDraft(d) {
  const key = `request-draft:${d.id}`;
  const current = () => state.requestDrafts.get(normName(d.createdBy)) === d;
  if (!current()) return;
  if (requestDraftEmpty(d)) {
    await idb.remove('deletes', key);
    return;
  }
  const cipher = await encryptJson(d, 'request-draft');
  if (current()) await idb.put('deletes', key, { type: 'request-draft', cipher });
}

function clearRequestDraft(d) {
  dirtyDrafts.delete(d);
  const key = normName(d.createdBy);
  if (state.requestDrafts.get(key) === d) state.requestDrafts.delete(key);
  idb.remove('deletes', `request-draft:${d.id}`);
}

// Abfragen erst, wenn gerade keine Einträge gesendet werden (sonst kann eine ältere Antwort einen eben
// gespeicherten Eintrag kurz verdrängen). Dauert das Senden länger, holt tick() den Stand danach.
async function refreshWhenIdle() {
  for (let i = 0; busy && i < 30; i++) await new Promise((r) => setTimeout(r, 100));
  if (busy) {
    refreshNeeded = true;
    return;
  }
  await refresh(true);
}

// Entwürfe der angegebenen Person, deren Anfrage sich beim Abgleich als angekommen herausstellte.
export function takeArrived(name) {
  const mine = arrived.filter((d) => normName(d.createdBy) === normName(name));
  arrived = arrived.filter((d) => !mine.includes(d));
  return mine;
}

// Geldanfrage an CoM Germany schicken. Liefert den Stand auf dem Server ({ status, ... };
// status 'gone': war schon angekommen und ist inzwischen zurückgezogen oder gelöscht).
// Der Entwurf wird vor dem Senden gesperrt (pending) und so gesichert. Kommt keine Antwort (oder wird
// die Seite neu geladen), ist unklar, ob die Anfrage angekommen ist; sie kann dann nur unverändert
// erneut gesendet werden. So landet nie eine geänderte Fassung unter derselben ID.
export async function sendRequest(draft) {
  draft.pending = true;
  await saveRequestDraft(draft);
  const { id, pending, ...d } = draft;
  const data = await encryptJson({ ...d, sentAt: Date.now() }, `request:${id}`);
  sendingRequest = true;
  try {
    const row = await request(`/api/requests/${id}`, { method: 'PUT', body: { data } });
    clearRequestDraft(draft);
    return row;
  } catch (err) {
    // Eine Antwort des Servers (z. B. 409) heißt: nicht gespeichert, der Entwurf ist wieder frei.
    if (!(err instanceof NetworkError)) {
      draft.pending = false;
      await saveRequestDraft(draft);
    }
    throw err;
  } finally {
    sendingRequest = false;
    await refreshWhenIdle().catch(() => {});
  }
}

// Das Team zieht eine noch nicht gelesene Anfrage zurück.
export async function withdrawRequest(r) {
  try {
    await request(`/api/requests/${r.id}`, { method: 'DELETE' });
  } finally {
    await refreshWhenIdle().catch(() => {});
  }
}

// Schatzmeister: „gelesen und in Absprache“
export async function markRequestRead(r) {
  try {
    await request(`/api/requests/${r.id}/read`, { method: 'POST' });
  } finally {
    await refresh(true).catch(() => {});
  }
}

// Schatzmeister: Anfrage löschen. Liefert { removed, status }: removed=false und status=null heißt,
// das Team hatte sie schon zurückgezogen; status='removed' heißt, sie war schon gelöscht.
export async function removeRequest(r) {
  try {
    return await request(`/api/requests/${r.id}/remove`, { method: 'POST' });
  } finally {
    await refresh(true).catch(() => {});
  }
}
