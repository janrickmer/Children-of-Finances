// Lokale Sicherung auf dem Gerät (IndexedDB). Inhalte liegen auch hier nur verschlüsselt.

const DB_NAME = 'children-of-finances';
const STORES = ['entries', 'images', 'deletes'];
let dbPromise = null;

function open() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve) => {
      let req;
      try {
        req = indexedDB.open(DB_NAME, 1);
      } catch {
        resolve(null);
        return;
      }
      req.onupgradeneeded = () => {
        for (const name of STORES) if (!req.result.objectStoreNames.contains(name)) req.result.createObjectStore(name);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null); // ohne IndexedDB läuft die Seite trotzdem, nur ohne Offline-Puffer
    });
  }
  return dbPromise;
}

async function tx(store, mode, fn) {
  const db = await open();
  if (!db) return undefined;
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(store, mode);
    const result = fn(transaction.objectStore(store));
    transaction.oncomplete = () => resolve(result?.result);
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

export function put(store, key, value) {
  return tx(store, 'readwrite', (s) => s.put(value, key)).catch(() => {});
}

export function remove(store, key) {
  return tx(store, 'readwrite', (s) => s.delete(key)).catch(() => {});
}

export function getAll(store) {
  return tx(store, 'readonly', (s) => s.getAll()).catch(() => []).then((v) => v || []);
}
