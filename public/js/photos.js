// Fotos aus offenen Sammlungen: klein gerechnet, selbst gehostet, mit Bildnachweis.
// Bei aktivem Datensparmodus des Handys werden sie gar nicht erst geladen.
import { h } from './util.js';
import { t, getLang } from './i18n.js';

// Jedes Foto liegt in drei Breiten als WebP unter img/<id>-<breite>.webp.
const WIDTHS = [480, 800, 1200];

export const PHOTOS = {};

// Welche Stelle welches Foto zeigt.
export const SLOTS = {};

function saveData() {
  try {
    return navigator.connection?.saveData === true;
  } catch {
    return false;
  }
}

function credit(p) {
  const lang = getLang();
  return h('figcaption', { class: 'photo-credit' },
    `${t('photo.credit')} `,
    h('a', { href: p.source, target: '_blank', rel: 'noopener' }, p.title),
    ` · ${p.author} · `,
    h('a', { href: p.licenseUrl, target: '_blank', rel: 'noopener', lang: 'en' }, p.license),
    ` · ${p.changes?.[lang] || t('photo.changes')}`);
}

// Liefert <figure> mit Foto und Nachweis, oder null (kein Foto für die Stelle oder Datensparmodus).
export function photo(slot, { className = '', sizes = '100vw', eager = false } = {}) {
  const p = PHOTOS[SLOTS[slot]];
  if (!p || saveData()) return null;
  const lang = getLang();
  // loading und srcset stehen vor src, damit der Browser nicht vorab die falsche Größe lädt.
  const img = h('img', {
    class: 'photo-img',
    loading: eager ? 'eager' : 'lazy',
    decoding: 'async',
    fetchpriority: 'low',
    width: p.width,
    height: p.height,
    alt: p.alt[lang] || p.alt.en,
    sizes,
    srcset: WIDTHS.map((w) => `img/${p.id}-${w}.webp ${w}w`).join(', '),
    src: `img/${p.id}-800.webp`,
  });
  if (p.position) img.style.objectPosition = p.position;
  img.addEventListener('error', () => img.closest('figure')?.remove(), { once: true });
  return h('figure', { class: `photo ${className}`.trim() }, h('div', { class: 'photo-frame' }, img), credit(p));
}

// Leerzustand: Foto (falls vorhanden) und Text.
export function emptyState(slot, text) {
  const fig = photo(slot, { className: 'photo-empty', sizes: '(max-width: 760px) 92vw, 420px' });
  return h('div', { class: fig ? 'empty-state' : 'empty-state no-photo' }, fig, h('p', { class: 'muted' }, text));
}
