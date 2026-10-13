import { t, locale } from './i18n.js';

// ------------------------------------------------------------------ DOM

const PROPS = new Set(['value', 'checked', 'disabled', 'hidden', 'multiple', 'required', 'readOnly', 'open']);

export function h(tag, attrs, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs || {})) {
    if (value == null || value === false) continue;
    if (key === 'class') el.className = value;
    else if (key === 'dataset') Object.assign(el.dataset, value);
    else if (key.startsWith('on') && typeof value === 'function') el.addEventListener(key.slice(2).toLowerCase(), value);
    else if (PROPS.has(key)) el[key] = value;
    else el.setAttribute(key, value === true ? '' : String(value));
  }
  append(el, children);
  return el;
}

export function append(el, children) {
  for (const child of children.flat(Infinity)) {
    if (child == null || child === false) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return el;
}

export function clear(el) {
  while (el.firstChild) el.firstChild.remove();
  return el;
}

// ------------------------------------------------------------------ Formatierung

export function parseAmount(value) {
  if (value == null || value === '') return 0;
  const n = Number.parseFloat(String(value).replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

export function fmtAmount(value) {
  const n = parseAmount(value);
  const digits = Number.isInteger(n) ? 0 : 2;
  return new Intl.NumberFormat(locale(), { minimumFractionDigits: digits, maximumFractionDigits: 2 }).format(n);
}

export function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(locale(), { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(d);
}

export function fmtDateTime(ts) {
  if (!ts) return '';
  return new Intl.DateTimeFormat(locale(), {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(new Date(ts));
}

export function fmtBytes(bytes) {
  return `${(bytes / 1_000_000).toLocaleString(locale(), { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MB`;
}

export function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function isoFromTs(ts) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function normName(name) {
  return String(name || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase();
}

// ------------------------------------------------------------------ Meldungen

let toastBox = null;

export function toast(message, type = 'info', ms = 7000) {
  if (!toastBox) {
    toastBox = h('div', { class: 'toasts', role: 'status', 'aria-live': 'polite' });
    document.body.append(toastBox);
  }
  const item = h('div', { class: `toast toast-${type}` }, message);
  toastBox.append(item);
  setTimeout(() => item.remove(), ms);
}

// Bestätigungsdialog. Optional mit Pflicht-Häkchen.
export function confirmDialog({ message, confirmLabel, cancelLabel, checkboxLabel, danger = false }) {
  return new Promise((resolve) => {
    const previous = document.activeElement;
    let checkbox = null;
    const confirmBtn = h('button', { class: danger ? 'btn btn-danger' : 'btn btn-primary', type: 'button' }, confirmLabel || t('yes'));
    const cancelBtn = h('button', { class: 'btn', type: 'button' }, cancelLabel || t('cancel'));
    if (checkboxLabel) {
      checkbox = h('input', { type: 'checkbox', id: 'confirm-check' });
      confirmBtn.disabled = true;
      checkbox.addEventListener('change', () => { confirmBtn.disabled = !checkbox.checked; });
    }
    const box = h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true' },
      h('p', { class: 'modal-text' }, message),
      checkbox && h('label', { class: 'modal-check', for: 'confirm-check' }, checkbox, ' ', checkboxLabel),
      h('div', { class: 'modal-actions' }, cancelBtn, confirmBtn),
    );
    const overlay = h('div', { class: 'overlay' }, box);
    const done = (result) => {
      overlay.remove();
      document.removeEventListener('keydown', onKey);
      if (previous && previous.focus) previous.focus();
      resolve(result);
    };
    const onKey = (ev) => { if (ev.key === 'Escape') done(false); };
    confirmBtn.addEventListener('click', () => done(true));
    cancelBtn.addEventListener('click', () => done(false));
    overlay.addEventListener('click', (ev) => { if (ev.target === overlay) done(false); });
    document.addEventListener('keydown', onKey);
    document.body.append(overlay);
    (checkbox || cancelBtn).focus();
  });
}

// ------------------------------------------------------------------ Bild-Vollansicht

export function openLightbox(loadUrl, caption = '') {
  const img = h('img', { class: 'lightbox-img', alt: caption });
  const spinner = h('div', { class: 'spinner', 'aria-hidden': 'true' });
  const closeBtn = h('button', { class: 'lightbox-close', type: 'button', 'aria-label': t('close'), title: t('close') }, '×');
  const overlay = h('div', { class: 'overlay lightbox', role: 'dialog', 'aria-modal': 'true' },
    closeBtn, spinner, img, caption && h('div', { class: 'lightbox-caption' }, caption));
  const close = () => {
    overlay.remove();
    document.removeEventListener('keydown', onKey);
  };
  const onKey = (ev) => { if (ev.key === 'Escape') close(); };
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (ev) => { if (ev.target === overlay) close(); });
  document.addEventListener('keydown', onKey);
  document.body.append(overlay);
  closeBtn.focus();
  Promise.resolve(typeof loadUrl === 'function' ? loadUrl() : loadUrl)
    .then((url) => { img.src = url; })
    .catch(() => { overlay.append(h('p', { class: 'lightbox-error' }, t('error.generic'))); })
    .finally(() => spinner.remove());
}

// ------------------------------------------------------------------ Info-Sprechblase

let openBubble = null;

function closeBubble() {
  if (openBubble) {
    openBubble.bubble.remove();
    openBubble.button.setAttribute('aria-expanded', 'false');
    openBubble = null;
  }
}

document.addEventListener('click', (ev) => {
  if (openBubble && !openBubble.bubble.contains(ev.target) && ev.target !== openBubble.button) closeBubble();
});
document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') closeBubble(); });
window.addEventListener('resize', closeBubble);
window.addEventListener('scroll', (ev) => {
  if (openBubble && ev.target instanceof Node && openBubble.bubble.contains(ev.target)) return;
  closeBubble();
}, true);

export function infoButton(getText, label) {
  const button = h('button', { class: 'info-btn', type: 'button', 'aria-label': label, title: label, 'aria-expanded': 'false' }, 'i');
  button.addEventListener('click', (ev) => {
    ev.stopPropagation();
    if (openBubble && openBubble.button === button) {
      closeBubble();
      return;
    }
    closeBubble();
    const bubble = h('div', { class: 'bubble', role: 'tooltip' },
      h('div', { class: 'bubble-text' }, typeof getText === 'function' ? getText() : getText));
    document.body.append(bubble);
    const rect = button.getBoundingClientRect();
    const width = Math.min(360, window.innerWidth - 24);
    bubble.style.width = `${width}px`;
    const left = Math.max(12, Math.min(rect.left + rect.width / 2 - width / 2, window.innerWidth - width - 12));
    bubble.style.left = `${left}px`;
    const below = window.innerHeight - rect.bottom - 18;
    const above = rect.top - 18;
    const openAbove = bubble.offsetHeight > below && above > below;
    bubble.querySelector('.bubble-text').style.maxHeight = `${Math.max(120, (openAbove ? above : below) - 24)}px`;
    const height = bubble.offsetHeight;
    bubble.classList.toggle('above', openAbove);
    bubble.style.top = `${openAbove ? Math.max(8, rect.top - 10 - height) : rect.bottom + 10}px`;
    bubble.style.setProperty('--arrow-left', `${rect.left + rect.width / 2 - left}px`);
    button.setAttribute('aria-expanded', 'true');
    openBubble = { bubble, button };
  });
  return button;
}

// ------------------------------------------------------------------ Datei-Download

export function downloadBytes(bytes, filename, type) {
  const blob = new Blob([bytes], { type });
  const url = URL.createObjectURL(blob);
  const a = h('a', { href: url, download: filename, class: 'hidden' });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

// ------------------------------------------------------------------ PDF-Bibliothek bei Bedarf laden

let pdfLibPromise = null;

export function ensurePdfLib() {
  if (window.PDFLib) return Promise.resolve(window.PDFLib);
  if (!pdfLibPromise) {
    pdfLibPromise = new Promise((resolve, reject) => {
      const script = h('script', { src: 'vendor/pdf-lib.min.js' });
      script.addEventListener('load', () => resolve(window.PDFLib));
      script.addEventListener('error', () => {
        pdfLibPromise = null;
        reject(new Error('pdf-lib konnte nicht geladen werden'));
      });
      document.head.append(script);
    });
  }
  return pdfLibPromise;
}
