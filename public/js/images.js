// Fotos: im Browser verkleinern (max. 2000 px, JPEG), verschlüsseln, hochladen und wieder anzeigen.
import { request, encryptBytes, decryptBytes, NetworkError, ApiError } from './session.js';
import * as idb from './idb.js';

const MAX_SIDE = 2000;
const MAX_JPEG_BYTES = 1_300_000; // verschlüsselt + Base64 bleibt so unter dem D1-Limit von 2 MB
const THUMB_SIDE = 240;

const pending = new Map(); // id -> { id, entryId, cipher }  noch nicht hochgeladen
const pendingDeletes = new Set();
const thumbs = new Map(); // id -> Promise<objectURL>
const fulls = new Map(); // id -> Promise<Blob>  (LRU)
const FULL_CACHE = 20;
let active = 0;
const queue = [];

export class ImageError extends Error {}

// ------------------------------------------------------------------ Bild umwandeln

function isPdf(file) {
  return file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
}

function looksLikeImage(file) {
  return file.type.startsWith('image/') || /\.(jpe?g|png|gif|webp|bmp|heic|heif|avif)$/i.test(file.name);
}

async function decode(blob) {
  if (typeof createImageBitmap === 'function') {
    try {
      const bmp = await createImageBitmap(blob, { imageOrientation: 'from-image' });
      return { source: bmp, width: bmp.width, height: bmp.height, done: () => bmp.close() };
    } catch { /* weiter mit <img> */ }
  }
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.src = url;
  try {
    await img.decode();
  } catch (err) {
    URL.revokeObjectURL(url);
    throw err;
  }
  return { source: img, width: img.naturalWidth, height: img.naturalHeight, done: () => URL.revokeObjectURL(url) };
}

function canvasToJpeg(decoded, maxSide, quality) {
  const scale = Math.min(1, maxSide / Math.max(decoded.width, decoded.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(decoded.width * scale));
  canvas.height = Math.max(1, Math.round(decoded.height * scale));
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff'; // transparente PNGs bekommen weißen Hintergrund
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(decoded.source, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('toBlob'))), 'image/jpeg', quality);
  });
}

async function toJpeg(file) {
  const decoded = await decode(file);
  try {
    const attempts = [[MAX_SIDE, 0.8], [MAX_SIDE, 0.65], [1600, 0.65], [1300, 0.6]];
    let blob = null;
    for (const [side, quality] of attempts) {
      blob = await canvasToJpeg(decoded, side, quality);
      if (blob.size <= MAX_JPEG_BYTES) break;
    }
    return blob;
  } finally {
    decoded.done();
  }
}

async function makeThumb(blob) {
  const decoded = await decode(blob);
  try {
    return URL.createObjectURL(await canvasToJpeg(decoded, THUMB_SIDE, 0.7));
  } finally {
    decoded.done();
  }
}

// ------------------------------------------------------------------ Hinzufügen / Entfernen

export async function addImage(file, entryId) {
  if (isPdf(file)) throw new ImageError('upload.pdf');
  if (!looksLikeImage(file)) throw new ImageError('upload.notImage');
  let jpeg;
  try {
    jpeg = await toJpeg(file);
  } catch {
    throw new ImageError('upload.failed');
  }
  const id = crypto.randomUUID();
  const cipher = await encryptBytes(new Uint8Array(await jpeg.arrayBuffer()), `image:${id}`);
  const item = { id, entryId, cipher };
  pending.set(id, item);
  await idb.put('images', id, item);
  remember(id, Promise.resolve(jpeg));
  thumbs.set(id, makeThumb(jpeg));
  return id;
}

export function removeImage(id) {
  if (pending.has(id)) {
    pending.delete(id);
    idb.remove('images', id);
  } else {
    pendingDeletes.add(id);
    idb.put('deletes', `image:${id}`, { type: 'image', id });
  }
}

export function isPending(id) {
  return pending.has(id);
}

export function hasWork() {
  return pending.size > 0 || pendingDeletes.size > 0;
}

export async function loadPendingFromDevice() {
  for (const item of await idb.getAll('images')) pending.set(item.id, item);
  for (const item of await idb.getAll('deletes')) if (item.type === 'image') pendingDeletes.add(item.id);
}

// Ausstehende Uploads und Löschungen an den Server senden. Netzwerkfehler werden weitergereicht.
export async function flush() {
  for (const item of [...pending.values()]) {
    try {
      await request(`/api/images/${item.id}?entry=${item.entryId}`, { method: 'PUT', text: item.cipher });
    } catch (err) {
      if (err instanceof NetworkError || err.status === 401) throw err;
      console.error('Bild-Upload abgelehnt', err);
    }
    pending.delete(item.id);
    await idb.remove('images', item.id);
  }
  for (const id of [...pendingDeletes]) {
    try {
      await request(`/api/images/${id}`, { method: 'DELETE' });
    } catch (err) {
      if (err instanceof NetworkError || err.status === 401) throw err;
    }
    pendingDeletes.delete(id);
    await idb.remove('deletes', `image:${id}`);
  }
}

// ------------------------------------------------------------------ Anzeigen

function limit(fn) {
  return new Promise((resolve, reject) => {
    const run = () => {
      active++;
      fn().then(resolve, reject).finally(() => {
        active--;
        if (queue.length) queue.shift()();
      });
    };
    if (active < 4) run();
    else queue.push(run);
  });
}

function remember(id, promise) {
  fulls.delete(id);
  fulls.set(id, promise);
  while (fulls.size > FULL_CACHE) fulls.delete(fulls.keys().next().value);
}

export function getBlob(id) {
  if (fulls.has(id)) {
    const p = fulls.get(id);
    remember(id, p);
    return p;
  }
  const p = limit(async () => {
    const local = pending.get(id);
    const cipher = local ? local.cipher : await request(`/api/images/${id}`);
    const bytes = await decryptBytes(cipher, `image:${id}`);
    return new Blob([bytes], { type: 'image/jpeg' });
  });
  p.catch(() => fulls.delete(id));
  remember(id, p);
  return p;
}

export async function getBytes(id) {
  return new Uint8Array(await (await getBlob(id)).arrayBuffer());
}

export function getThumbUrl(id) {
  if (!thumbs.has(id)) {
    const p = getBlob(id).then(makeThumb);
    p.catch(() => thumbs.delete(id));
    thumbs.set(id, p);
  }
  return thumbs.get(id);
}

const fullUrls = new Map();

export function getFullUrl(id) {
  if (!fullUrls.has(id)) {
    const p = getBlob(id).then((blob) => URL.createObjectURL(blob));
    p.catch(() => fullUrls.delete(id));
    fullUrls.set(id, p);
  }
  return fullUrls.get(id);
}

export { NetworkError, ApiError };
