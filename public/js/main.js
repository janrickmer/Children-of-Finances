// Einstieg: Sprache → Passwort → (Kenia-Team: Name) → Ansicht
import { initLang, setLang, getLang, t } from './i18n.js';
import * as session from './session.js';
import * as store from './store.js';
import { h, clear, toast } from './util.js';
import { icon } from './icons.js';
import { mountUser } from './view-user.js';
import { mountAdmin } from './view-admin.js';

const app = document.getElementById('app');
const headerRight = document.getElementById('header-right');
const LANGS = [['de', 'Deutsch', 'DE'], ['en', 'English', 'EN'], ['sw', 'Kiswahili', 'SW']];

let role = null;
let name = '';
let view = null;
let screen = null; // 'login' | 'name' | 'main'
let syncEl = null;

function readStorage(storage, key) {
  try {
    return storage.getItem(key) || '';
  } catch {
    return '';
  }
}

function writeStorage(storage, key, value) {
  try {
    storage.setItem(key, value);
  } catch { /* privater Modus */ }
}

function langSwitch() {
  return h('div', { class: 'lang-switch', role: 'group', 'aria-label': t('lang.label') },
    LANGS.map(([code, label, short]) => h('button', {
      type: 'button',
      class: code === getLang() ? 'lang-btn active' : 'lang-btn',
      'aria-pressed': String(code === getLang()),
      'aria-label': label,
      lang: code,
      onclick: () => {
        setLang(code);
        rerender();
      },
    }, h('span', { class: 'lang-long' }, label), h('span', { class: 'lang-short', 'aria-hidden': 'true' }, short))));
}

function rerender() {
  if (screen === 'login') showLogin();
  else if (screen === 'name') showNameStep();
  else if (screen === 'main') showMain();
}

// ------------------------------------------------------------------ Kopfzeile

function renderSync() {
  if (!syncEl) return;
  const s = store.state.sync;
  syncEl.className = `sync sync-${s}`;
  clear(syncEl).append(
    icon(s === 'saved' ? 'check' : s === 'saving' ? 'saving' : 'cloud-off', { size: 18 }),
    t(s === 'saved' ? 'sync.saved' : s === 'saving' ? 'sync.saving' : 'sync.offline'),
  );
}

function renderHeader() {
  clear(headerRight);
  syncEl = null;
  if (screen === 'login') return;
  headerRight.append(langSwitch());
  if (role === 'user') {
    syncEl = h('span', { class: 'sync', role: 'status' });
    renderSync();
    headerRight.append(syncEl);
    if (screen === 'main') {
      headerRight.append(h('span', { class: 'who' }, t('name.current', { name }), ' ',
        h('button', { type: 'button', class: 'link-btn', onclick: showNameStep }, t('name.change'))));
    }
  }
  headerRight.append(h('button', {
    type: 'button', class: 'btn btn-small btn-ghost logout-btn', onclick: logout, 'aria-label': t('logout'), title: t('logout'),
  }, icon('logout', { size: 18 }), h('span', { class: 'btn-label' }, t('logout'))));
}

// ------------------------------------------------------------------ Anmeldung

function showLogin(message = '') {
  screen = 'login';
  view = null;
  renderHeader();
  const input = h('input', {
    type: 'password', class: 'in', id: 'password', autocomplete: 'current-password', autocapitalize: 'off', required: true,
  });
  const error = h('p', { class: 'form-error', role: 'alert' }, message);
  const submit = h('button', { type: 'submit', class: 'btn btn-primary btn-block' }, t('login.submit'));
  const form = h('form', { class: 'card login-card', novalidate: true },
    h('div', { class: 'field' }, h('span', { class: 'field-label' }, `${t('lang.label')} / Language / Lugha`), langSwitch()),
    h('h1', {}, t('login.title')),
    h('label', { class: 'field', for: 'password' }, h('span', {}, t('login.password')), input),
    error,
    submit);

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (!input.value.trim()) return;
    submit.disabled = true;
    error.textContent = '';
    submit.textContent = t('login.checking');
    try {
      role = await session.login(input.value);
      input.value = '';
      await startApp();
    } catch (err) {
      submit.disabled = false;
      submit.textContent = t('login.submit');
      input.select();
      if (err instanceof session.NetworkError) error.textContent = t('error.offline');
      else if (err.body?.error === 'wrong_password') {
        error.textContent = t('login.wrong');
        if (err.body.remaining <= 3) error.append(' ', t('login.remaining', { n: err.body.remaining }));
      } else if (err.body?.error === 'locked') error.textContent = t('login.locked', { min: Math.ceil((err.body.retryAfter || 900) / 60) });
      else if (err.body?.error === 'not_initialized') error.textContent = t('login.notReady');
      else error.textContent = t('error.generic');
    }
  });
  clear(app).append(form);
  input.focus();
}

async function startApp() {
  store.reset();
  if (role === 'user') await store.loadFromDevice();
  try {
    await store.refresh(true);
  } catch (err) {
    if (err instanceof session.NetworkError) toast(t('sync.offline'), 'error');
    else if (err.status === 401) return;
    else throw err;
  }
  store.start();
  name = role === 'user' ? readStorage(sessionStorage, 'cof-name') : '';
  if (role === 'user' && !name) showNameStep();
  else showMain();
}

// ------------------------------------------------------------------ Name

function showNameStep() {
  screen = 'name';
  view = null;
  renderHeader();
  const input = h('input', { type: 'text', class: 'in', id: 'fullname', autocomplete: 'name', maxlength: 120 });
  input.value = name || readStorage(localStorage, 'cof-last-name');
  const error = h('p', { class: 'form-error', role: 'alert' });
  const form = h('form', { class: 'card login-card', novalidate: true },
    h('h1', {}, t('name.question')),
    h('p', { class: 'muted' }, t('name.hint')),
    h('label', { class: 'field', for: 'fullname' }, h('span', {}, t('name.label')), input),
    error,
    h('button', { type: 'submit', class: 'btn btn-primary btn-block' }, t('name.continue')));
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const value = input.value.trim().replace(/\s+/g, ' ');
    const parts = value.split(' ').filter((p) => p.length >= 2);
    if (parts.length < 2) {
      error.textContent = t('name.invalid');
      input.focus();
      return;
    }
    name = value;
    writeStorage(sessionStorage, 'cof-name', name);
    writeStorage(localStorage, 'cof-last-name', name);
    showMain();
  });
  clear(app).append(form);
  input.focus();
}

// ------------------------------------------------------------------ Hauptansicht

function showMain() {
  screen = 'main';
  renderHeader();
  view = role === 'admin' ? mountAdmin(app) : mountUser(app, { getName: () => name });
}

async function logout() {
  await store.flushNow();
  store.stop();
  session.logout();
  try {
    sessionStorage.removeItem('cof-name');
  } catch { /* ignorieren */ }
  role = null;
  name = '';
  store.reset();
  showLogin();
}

store.subscribe((reason) => {
  if (reason === 'sync') renderSync();
  if (screen === 'main') view?.update(reason);
});
store.onConflict(() => toast(t('sync.conflict'), 'error'));
session.onExpired(() => {
  if (screen === 'login') return;
  store.stop();
  session.logout();
  role = null;
  showLogin(t('sync.expired'));
});

(async function boot() {
  if (window.top !== window.self) return; // nicht in fremden Seiten (iframes) anzeigen
  initLang();
  role = await session.restore();
  if (role) await startApp();
  else showLogin();
})();
