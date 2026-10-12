// Zentraler Datenbestand + sekündliches Speichern.
//
// Jede Änderung wird innerhalb einer Sekunde verschlüsselt auf dem Gerät (IndexedDB) abgelegt
// und – sobald eine Verbindung besteht – an den Server übertragen. Gesendet wird nur, was sich
// seit dem letzten Mal geändert hat, damit die Gratis-Kontingente von Cloudflare reichen.
import { request, encryptJson, decryptJson, NetworkError, getRole } from './session.js';
import * as images from './images.js';
import * as idb from './idb.js';
import { emptyLedger, SAVED } from './ledger.js';

export const state = {
  entries: new Map(),
  ledger: emptyLedger(),
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
    d: emptyData(kind, name), rev: 0, syncedRev: 0, onServer: false,
  };
  state.entries.set(e.id, e);
  return e;
}

export function update(e, patch, name) {
  if (SAVED.includes(e.status)) return;
  Object.assign(e.d, patch);
  if (name) e.d.editedBy = name;
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
    await idb.put('entries', e.id, { id: e.id, kind: e.kind, status: e.status, createdAt: e.createdAt, cipher });
  }
}

export async function loadFromDevice() {
  await images.loadPendingFromDevice();
  for (const item of await idb.getAll('deletes')) if (item.type === 'entry') pendingDeletes.add(item.id);
  for (const item of await idb.getAll('entries')) {
    try {
      const d = await decryptJson(item.cipher, `entry:${item.id}`);
      state.entries.set(item.id, {
        id: item.id, kind: item.kind, status: item.status, createdAt: item.createdAt, updatedAt: 0,
        d, rev: 1, syncedRev: 0, onServer: false,
      });
    } catch (err) {
      console.warn('Lokaler Eintrag nicht lesbar', err);
    }
  }
}

// ------------------------------------------------------------------ Synchronisation

async function pushChanges() {
  for (const id of [...pendingDeletes]) {
    try {
      await request(`/api/entries/${id}`, { method: 'DELETE' });
    } catch (err) {
      if (err instanceof NetworkError || err.status === 401) throw err;
    }
    pendingDeletes.delete(id);
    await idb.remove('deletes', `entry:${id}`);
  }

  await images.flush();

  for (const e of list().filter(isDirty)) {
    const rev = e.rev;
    const data = await encryptJson(e.d, `entry:${e.id}`);
    try {
      const res = await request(`/api/entries/${e.id}`, { method: 'PUT', body: { kind: e.kind, status: e.status, data } });
      e.syncedRev = Math.max(e.syncedRev, rev);
      e.onServer = true;
      e.createdAt = res.created_at;
      e.updatedAt = res.updated_at;
    } catch (err) {
      if (err instanceof NetworkError || err.status === 401) throw err;
      // Eintrag wurde inzwischen abgeschlossen/gelöscht oder abgelehnt: Serverstand gilt.
      e.syncedRev = e.rev;
      refreshNeeded = true;
      if (err.status === 409) conflictHandler();
      else console.error('Eintrag abgelehnt', err);
    }
    if (!isDirty(e)) await idb.remove('entries', e.id);
  }
}

async function tick() {
  if (busy) return;
  busy = true;
  try {
    if (persistQueue.size) await persistLocal();
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
    setSync(list().some(isDirty) ? 'saving' : 'saved');
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
  const params = new URLSearchParams({ since: String(full ? 0 : state.since) });
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
    if (e && isDirty(e) && !locked) continue; // eigene, noch nicht übertragene Änderungen haben Vorrang
    if (e && isDirty(e) && locked) {
      e.syncedRev = e.rev; // jemand anderes hat abgeschlossen
      idb.remove('entries', e.id);
      if (d == null) needFull = true;
    }
    if (d != null) {
      if (!e) {
        e = { id: row.id, kind: row.kind, rev: 0, syncedRev: 0 };
        state.entries.set(row.id, e);
      }
      Object.assign(e, { status: row.status, createdAt: row.created_at, updatedAt: row.updated_at, d, onServer: true });
    } else if (e) {
      Object.assign(e, { status: row.status, createdAt: row.created_at, onServer: true });
    } else {
      needFull = true;
    }
    state.since = Math.max(state.since, row.updated_at);
  }
  for (const [id, e] of state.entries) {
    if (!seen.has(id) && e.onServer && !isDirty(e)) state.entries.delete(id);
  }

  state.ledger = res.ledger ? await decryptJson(res.ledger, 'ledger').catch(() => emptyLedger()) : emptyLedger();
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
  state.entries.clear();
  state.ledger = emptyLedger();
  state.lastArchive = null;
  state.seq = null;
  state.since = 0;
}

// ------------------------------------------------------------------ Schatzmeister

export async function approve(e) {
  await request(`/api/entries/${e.id}/approve`, { method: 'POST' });
  await refresh(true);
}

export async function archive(ids, ledger) {
  const encrypted = await encryptJson(ledger, 'ledger');
  const res = await request('/api/archive', { method: 'POST', body: { ids, ledger: encrypted } });
  await refresh(true);
  return res.deleted;
}
