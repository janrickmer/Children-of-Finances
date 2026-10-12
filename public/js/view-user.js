// Ansicht für CoM Kenya (Passwort des Teams).
import { h, clear, toast, confirmDialog, fmtDate, normName } from './util.js';
import { t } from './i18n.js';
import * as store from './store.js';
import {
  ExpenseRow, expenseHead, reconcile, dateInput, amountInput, successGroups, periodTitle, successTable,
} from './components.js';

export function mountUser(root, { getName }) {
  const incompleteRows = new Map();
  const draftRows = new Map();
  let mode = null;

  const myDrafts = (kind) => store.list()
    .filter((e) => e.kind === kind && e.status === 'draft' && normName(e.d.createdBy) === normName(getName()))
    .sort((a, b) => a.d.clientCreatedAt - b.d.clientCreatedAt);

  // ---------------------------------------------------------------- Warnhinweis
  const warning = h('section', { class: 'warning-box' }, h('p', {}, t('warning.text')));

  // ---------------------------------------------------------------- Unvollständige Eingaben
  const incBody = h('tbody');
  const incWrap = h('div', { class: 'red-wrap' },
    h('h2', { class: 'red-title' }, t('incomplete.title')),
    h('p', { class: 'red-intro' }, t('incomplete.intro')),
    h('div', { class: 'table-scroll' }, h('table', { class: 'entry-table' }, expenseHead([t('col.name')]), incBody)),
    h('div', { class: 'actions' }, h('button', { type: 'button', class: 'btn btn-primary', onclick: saveIncomplete }, t('save'))),
  );
  const allGood = h('p', { class: 'all-good' }, t('incomplete.none'));

  // ---------------------------------------------------------------- Auswahl
  const incomeChoice = h('button', { type: 'button', class: 'choice', 'aria-pressed': 'false', onclick: () => setMode('income') },
    h('span', { class: 'choice-title' }, t('choose.income')),
    h('span', { class: 'choice-hint' }, t('choose.incomeHint')));
  const expenseChoice = h('button', { type: 'button', class: 'choice', 'aria-pressed': 'false', onclick: () => setMode('expense') },
    h('span', { class: 'choice-title' }, t('choose.expense')));

  // ---------------------------------------------------------------- Geldeingang
  const incomeDraft = (create) => myDrafts('income')[0] || (create ? store.createEntry('income', getName()) : null);
  const incomeFrom = h('input', { type: 'text', class: 'in', maxlength: 200, autocomplete: 'off' });
  incomeFrom.addEventListener('input', () => store.update(incomeDraft(true), { from: incomeFrom.value }, getName()));
  const incomeAmount = amountInput((v) => store.update(incomeDraft(true), { amount: v }, getName()));
  const incomeDate = dateInput((v) => store.update(incomeDraft(true), { date: v }, getName()));
  const incomeError = h('p', { class: 'form-error', role: 'alert' });
  const incomeForm = h('div', { class: 'form-card', hidden: true },
    h('label', { class: 'field' }, h('span', {}, t('income.from')), incomeFrom),
    h('label', { class: 'field' }, h('span', {}, t('income.amount')), incomeAmount),
    h('label', { class: 'field' }, h('span', {}, t('income.date')), incomeDate),
    incomeError,
    h('div', { class: 'actions' }, h('button', { type: 'button', class: 'btn btn-primary', onclick: saveIncome }, t('save'))),
  );

  function fillIncome() {
    const e = incomeDraft(false);
    for (const [input, value] of [[incomeFrom, e?.d.from], [incomeAmount, e?.d.amount], [incomeDate, e?.d.date]]) {
      if (document.activeElement !== input) input.value = value || '';
    }
  }

  async function saveIncome() {
    const e = incomeDraft(false);
    if (!e || store.missing(e).length) {
      incomeError.textContent = t('income.missing');
      return;
    }
    incomeError.textContent = '';
    store.setStatus(e, 'complete');
    store.changed();
    store.flushNow();
    toast(t('income.saved'), 'success');
  }

  // ---------------------------------------------------------------- Bezahlungen
  const draftBody = h('tbody');
  const expenseForm = h('div', { class: 'form-card form-wide', hidden: true },
    h('div', { class: 'table-scroll' }, h('table', { class: 'entry-table' }, expenseHead(['']), draftBody)),
    h('div', { class: 'actions actions-split' },
      h('button', { type: 'button', class: 'btn btn-add', onclick: addRow, title: t('row.add') }, t('row.add')),
      h('button', { type: 'button', class: 'btn btn-primary', onclick: saveDrafts }, t('save'))),
  );

  function addRow() {
    const e = store.createEntry('expense', getName());
    renderDrafts();
    draftRows.get(e.id)?.what.focus();
  }

  async function deleteDraft(e) {
    if (!store.isEmpty(e)) {
      const ok = await confirmDialog({ message: t('row.deleteConfirm'), confirmLabel: t('row.delete'), danger: true });
      if (!ok) return;
    }
    store.removeDraft(e);
    renderDrafts();
  }

  async function saveDrafts() {
    const drafts = myDrafts('expense');
    const filled = drafts.filter((e) => !store.isEmpty(e));
    if (!filled.length) {
      toast(t('save.nothing'));
      return;
    }
    const complete = filled.filter((e) => !store.missing(e).length);
    const withoutTransfer = complete.filter((e) => !e.d.transfers.length).length;
    if (withoutTransfer) {
      const ok = await confirmDialog({
        message: t('save.noTransfer', { n: withoutTransfer }), confirmLabel: t('save.anyway'), cancelLabel: t('back'),
      });
      if (!ok) return;
    }
    drafts.filter((e) => store.isEmpty(e)).forEach((e) => store.removeDraft(e));
    for (const e of filled) store.setStatus(e, store.missing(e).length ? 'incomplete' : 'complete');
    store.changed();
    store.flushNow();
    const bad = filled.length - complete.length;
    if (complete.length) toast(t('save.ok', { n: complete.length }), 'success');
    if (bad) toast(t('save.incomplete', { n: bad }), 'error');
    if (bad) incWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function saveIncomplete() {
    const list = store.list().filter((e) => e.kind === 'expense' && e.status === 'incomplete');
    const ready = list.filter((e) => !store.missing(e).length);
    const withoutTransfer = ready.filter((e) => !e.d.transfers.length).length;
    if (withoutTransfer) {
      const ok = await confirmDialog({
        message: t('save.noTransfer', { n: withoutTransfer }), confirmLabel: t('save.anyway'), cancelLabel: t('back'),
      });
      if (!ok) return;
    }
    for (const e of ready) store.setStatus(e, 'complete');
    store.changed();
    store.flushNow();
    if (ready.length) toast(t('save.ok', { n: ready.length }), 'success');
    if (list.length - ready.length) toast(t('save.stillIncomplete', { n: list.length - ready.length }), 'error');
  }

  function setMode(next) {
    mode = next;
    incomeChoice.setAttribute('aria-pressed', String(mode === 'income'));
    expenseChoice.setAttribute('aria-pressed', String(mode === 'expense'));
    incomeForm.hidden = mode !== 'income';
    expenseForm.hidden = mode !== 'expense';
    if (mode === 'expense') renderDrafts();
    if (mode === 'income') fillIncome();
  }

  // ---------------------------------------------------------------- Erfolgreiche Einträge
  const successBox = h('div');

  function renderSuccess() {
    clear(successBox);
    const archive = store.state.lastArchive;
    if (archive) {
      successBox.append(h('p', { class: 'archive-note' }, t('success.archived', {
        date: fmtDate(new Date(archive.at).toISOString().slice(0, 10)), n: archive.count,
      })));
    }
    const groups = successGroups().reverse(); // aktueller Zeitraum oben
    if (!groups.length) {
      successBox.append(h('p', { class: 'muted' }, t('success.empty')));
      return;
    }
    for (const g of groups) {
      successBox.append(h('h3', { class: g.current ? 'period-title current' : 'period-title' }, periodTitle(g)), successTable(g.items));
    }
  }

  // ---------------------------------------------------------------- Aufbau
  clear(root).append(
    warning,
    h('section', { class: 'section' }, incWrap, allGood),
    h('section', { class: 'section' },
      h('h2', {}, t('choose.title')),
      h('div', { class: 'choices' }, incomeChoice, expenseChoice),
      incomeForm,
      expenseForm),
    h('section', { class: 'section' },
      h('h2', {}, t('success.title')),
      h('p', { class: 'muted' }, t('success.intro')),
      successBox),
  );

  function renderIncomplete() {
    const list = store.list()
      .filter((e) => e.kind === 'expense' && e.status === 'incomplete')
      .sort((a, b) => a.createdAt - b.createdAt);
    reconcile(incBody, list, incompleteRows, (e) => new ExpenseRow(e, { mode: 'incomplete', getName }));
    incWrap.hidden = !list.length;
    allGood.hidden = list.length > 0;
  }

  function renderDrafts() {
    let drafts = myDrafts('expense');
    if (!drafts.length) {
      store.createEntry('expense', getName());
      drafts = myDrafts('expense');
    }
    reconcile(draftBody, drafts, draftRows, (e) => new ExpenseRow(e, { mode: 'draft', getName, onDelete: deleteDraft }));
  }

  function update(reason) {
    if (reason === 'sync') return;
    renderIncomplete();
    if (mode === 'expense') renderDrafts();
    if (mode === 'income') fillIncome();
    renderSuccess();
  }

  update();
  if (myDrafts('expense').some((e) => !store.isEmpty(e))) setMode('expense');
  else if (myDrafts('income').some((e) => !store.isEmpty(e))) setMode('income');
  return { update };
}
