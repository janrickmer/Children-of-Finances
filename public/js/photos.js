// Fotos aus offenen Sammlungen: klein gerechnet, selbst gehostet, mit Bildnachweis.
// Bei aktivem Datensparmodus des Handys werden sie gar nicht erst geladen.
import { h } from './util.js';
import { t, getLang } from './i18n.js';

// Jedes Foto liegt in zwei Breiten als WebP unter img/<id>-<breite>.webp (höchstens 800 px, damit es leicht bleibt).
const WIDTHS = [480, 800];

// Lizenzen am 19.10.2026 auf den Wikimedia-Commons-Seiten geprüft.
export const PHOTOS = {
  'uhuru-park': {
    id: 'uhuru-park',
    width: 800,
    height: 533,
    position: '50% 62%',
    title: "Nairobi's skyline from Uhuru Park",
    author: 'Jorge Láscar',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Lascar_Nairobi%27s_skyline_from_Uhuru_Park_(4519272483).jpg',
    alt: {
      de: 'Nairobis Skyline vom Uhuru Park aus: rote Erde, ein junger Baum, dahinter die Hochhäuser der Innenstadt.',
      en: "Nairobi's skyline from Uhuru Park: red earth, a young tree and the city-centre towers behind it.",
      sw: 'Majengo marefu ya Nairobi yakionekana kutoka Uhuru Park: udongo mwekundu, mti mchanga na majengo ya katikati ya jiji nyuma yake.',
    },
  },
  'ngong-hills': {
    id: 'ngong-hills',
    width: 800,
    height: 533,
    title: 'Ngong Hills',
    author: 'Rotsee2',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Ngong_Hills.jpg',
    alt: {
      de: 'Die grünen Ngong Hills am Stadtrand von Nairobi.',
      en: 'The green Ngong Hills on the edge of Nairobi.',
      sw: 'Milima ya Ngong yenye kijani kibichi, pembeni mwa Nairobi.',
    },
  },
  gemuesestand: {
    id: 'gemuesestand',
    width: 800,
    height: 533,
    title: 'A pile of tomatoes, onions, avocados, garlic, ginger, lemons',
    author: 'Queen Asali',
    license: 'CC0 1.0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    source: 'https://commons.wikimedia.org/wiki/File:A_pile_of_tomatoes,_onions,_avocados,_garlic,_ginger,_lemons.jpg',
    alt: {
      de: 'Körbe mit Knoblauch, Ingwer, Limetten, Orangen, Avocados, Zwiebeln und Tomaten in einem Geschäft in Kenia.',
      en: 'Baskets of garlic, ginger, limes, oranges, avocados, onions and tomatoes in a shop in Kenya.',
      sw: 'Vikapu vya vitunguu saumu, tangawizi, ndimu, machungwa, parachichi, vitunguu na nyanya dukani nchini Kenya.',
    },
  },
};

// Welche Stelle welches Foto zeigt.
export const SLOTS = {
  cover: 'uhuru-park',
  'team-empty': 'gemuesestand',
  'treasurer-empty': 'ngong-hills',
};

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
  return h('div', { class: fig ? 'empty-state' : 'empty-state no-photo' }, h('p', { class: 'muted' }, text), fig);
}
