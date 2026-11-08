// Ansicht für CoM Kenya (Passwort des Teams).
import { h, clear, toast, confirmDialog, fmtDate, normName, todayIso } from './util.js';
import { t } from './i18n.js';
import * as store from './store.js';
import * as images from './images.js';
import { NetworkError } from './session.js';
import {
  ExpenseRow, expenseHead, reconcile, dateInput, amountInput, successGroups, periodTitle, successTable, tapeBand, currentPeriod,
  requestCard, requestRemovedNotice, requiredMark, REQUEST_NOTICE_MS,
} from './components.js';
import { icon } from './icons.js';
import { emptyState } from './photos.js';

export function mountUser(root, { getName }) {
  const incompleteRows = new Map();
  const draftRows = new Map();
  let mode = null;

  const myDrafts = (kind) => store.list()
    .filter((e) => e.kind === kind && e.status === 'draft' && normName(e.d.createdBy) === normName(getName()))
    .sort((a, b) => a.d.clientCreatedAt - b.d.clientCreatedAt);

  // ---------------------------------------------------------------- Warnhinweis
  const warning = h('section', { class: 'warning-box', role: 'note' }, icon('alert', { size: 22 }), h('p', {}, t('warning.text')));
  const bandSlot = h('div', { class: 'band-slot' });
  const noticeSlot = h('div', { class: 'notice-slot' });

  // ---------------------------------------------------------------- Unvollständige Eingaben
  const incBody = h('tbody');
  const incCount = h('span', { class: 'red-count' });
  const incWrap = h('div', { class: 'red-wrap' },
    h('div', { class: 'red-head' }, h('h2', { class: 'red-title' }, t('incomplete.title')), incCount),
    h('p', { class: 'red-intro' }, t('incomplete.intro')),
    h('div', { class: 'red-body table-scroll' }, h('table', { class: 'entry-table' }, expenseHead([t('col.name')], { summary: true }), incBody)),
    h('div', { class: 'actions' }, h('button', { type: 'button', class: 'btn btn-primary', onclick: saveIncomplete }, icon('check', { size: 18 }), t('save'))),
  );
  const allGood = h('p', { class: 'all-good' }, icon('check', { size: 22 }), t('incomplete.none'));

  // ---------------------------------------------------------------- Auswahl
  const incomeChoice = h('button', { type: 'button', class: 'choice choice-income', 'aria-pressed': 'false', onclick: () => setMode('income') },
    h('span', { class: 'choice-icon' }, icon('money-in', { size: 22 })),
    h('span', { class: 'choice-title' }, t('choose.income')),
    h('span', { class: 'choice-hint' }, t('choose.incomeHint')));
  const expenseChoice = h('button', { type: 'button', class: 'choice choice-expense', 'aria-pressed': 'false', onclick: () => setMode('expense') },
    h('span', { class: 'choice-icon' }, icon('money-out', { size: 22 })),
    h('span', { class: 'choice-title' }, t('choose.expense')));
  const requestChoice = h('button', { type: 'button', class: 'choice choice-request', 'aria-pressed': 'false', onclick: () => setMode('request') },
    h('span', { class: 'choice-icon' }, icon('calendar', { size: 22 })),
    h('span', { class: 'choice-title' }, t('choose.request')),
    h('span', { class: 'choice-hint' }, t('choose.requestHint')));

  // ---------------------------------------------------------------- Geldeingang
  const incomeDraft = (create) => myDrafts('income')[0] || (create ? store.createEntry('income', getName()) : null);
  const incomeFrom = h('input', { type: 'text', class: 'in', maxlength: 200, autocomplete: 'off' });
  incomeFrom.addEventListener('input', () => store.update(incomeDraft(true), { from: incomeFrom.value }, getName()));
  const incomeAmount = amountInput((v) => store.update(incomeDraft(true), { amount: v }, getName()));
  const incomeDate = dateInput((v) => store.update(incomeDraft(true), { date: v }, getName()));
  const incomeError = h('p', { class: 'form-error', role: 'alert' });
  const incomeUnsaved = h('p', { class: 'unsaved-hint', hidden: true }, icon('info', { size: 18 }), t('income.unsaved'));
  const refreshIncomeHint = () => {
    const e = incomeDraft(false);
    incomeUnsaved.hidden = !e || store.isEmpty(e);
  };
  for (const input of [incomeFrom, incomeAmount, incomeDate]) {
    input.addEventListener('input', refreshIncomeHint);
    input.addEventListener('change', refreshIncomeHint);
  }
  const incomeForm = h('div', { class: 'form-card', hidden: true },
    h('label', { class: 'field' }, h('span', {}, t('income.from')), incomeFrom),
    h('label', { class: 'field' }, h('span', {}, t('income.amount')), incomeAmount),
    h('label', { class: 'field' }, h('span', {}, t('income.date')), incomeDate),
    incomeError,
    incomeUnsaved,
    h('div', { class: 'actions' }, h('button', { type: 'button', class: 'btn btn-primary', onclick: saveIncome }, icon('check', { size: 18 }), t('save'))),
  );

  function fillIncome() {
    const e = incomeDraft(false);
    for (const [input, value] of [[incomeFrom, e?.d.from], [incomeAmount, e?.d.amount], [incomeDate, e?.d.date]]) {
      if (document.activeElement !== input) input.value = value || '';
    }
    refreshIncomeHint();
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

  // ---------------------------------------------------------------- Geldanfrage an CoM Germany
  const myRequestDraft = () => store.getRequestDraft(getName());
  const setRequest = (patch) => {
    store.updateRequestDraft(getName(), patch);
    refreshRequestForm();
  };
  const reqPerson = h('input', { type: 'text', class: 'in', id: 'req-person', maxlength: 200, autocomplete: 'off' });
  reqPerson.addEventListener('input', () => setRequest({ person: reqPerson.value }));
  const reqPurpose = h('textarea', { class: 'in', id: 'req-purpose', rows: 4, maxlength: 4000, 'aria-describedby': 'req-purpose-hint' });
  reqPurpose.addEventListener('input', () => setRequest({ purpose: reqPurpose.value }));
  const reqFrom = dateInput((v) => setRequest({ from: v }), { max: null });
  const reqTo = dateInput((v) => setRequest({ to: v }), { max: null });
  const reqAmount = amountInput((v) => setRequest({ amount: v }));
  const reqDeadline = dateInput((v) => setRequest({ deadline: v }), { min: todayIso(), max: null });
  const reqInputs = [reqPerson, reqPurpose, reqFrom, reqTo, reqAmount, reqDeadline];
  for (const [input, id] of [[reqFrom, 'req-from'], [reqTo, 'req-to'], [reqAmount, 'req-amount'], [reqDeadline, 'req-deadline']]) input.id = id;
  for (const input of reqInputs) input.setAttribute('aria-required', 'true');
  const reqError = h('p', { class: 'form-error', role: 'alert' });
  const reqUnsent = h('p', { class: 'unsaved-hint', hidden: true }, icon('info', { size: 18 }), t('request.unsent'));
  // Verbindung beim Senden abgebrochen: unklar, ob die Anfrage angekommen ist; bis dahin nicht änderbar
  const reqPending = h('p', { class: 'pending-note', role: 'status', hidden: true }, icon('alert', { size: 18 }), t('request.pending'));
  const reqSubmit = h('button', { type: 'button', class: 'btn btn-primary btn-wrap', onclick: sendRequest });
  const submitLabel = (sending) => clear(reqSubmit).append(icon(sending ? 'saving' : 'send', { size: 18 }), t(sending ? 'request.sending' : 'request.submit'));
  submitLabel(false);
  let reqShowMissing = false; // Fehlendes erst nach dem ersten Absendeversuch rot zeigen
  const reqFields = {
    person: h('div', { class: 'field' }, h('label', { for: 'req-person' }, t('request.person'), requiredMark()), reqPerson),
    purpose: h('div', { class: 'field' },
      h('label', { for: 'req-purpose' }, t('request.purpose'), requiredMark()),
      h('p', { class: 'field-hint', id: 'req-purpose-hint' }, t('request.purposeHint')),
      reqPurpose),
    period: h('fieldset', { class: 'field field-set' },
      h('legend', {}, t('request.period'), requiredMark()),
      h('div', { class: 'field-pair' },
        h('label', { class: 'field-sub', for: 'req-from' }, h('span', {}, t('request.periodFrom')), reqFrom),
        h('label', { class: 'field-sub', for: 'req-to' }, h('span', {}, t('request.periodTo')), reqTo))),
    amount: h('div', { class: 'field' }, h('label', { for: 'req-amount' }, t('request.amount'), requiredMark()), reqAmount),
    deadline: h('div', { class: 'field' }, h('label', { for: 'req-deadline' }, t('request.deadline'), requiredMark()), reqDeadline),
  };
  const requestForm = h('div', { class: 'form-card request-form', hidden: true },
    Object.values(reqFields),
    reqError,
    reqUnsent,
    reqPending,
    h('div', { class: 'actions' }, reqSubmit));

  // Welche Felder fehlen oder passen nicht? (für Markierung und Fehlermeldung)
  function requestProblems(d) {
    const miss = store.requestMissing(d);
    const bad = new Set(miss.map((k) => (k === 'from' || k === 'to' ? 'period' : k)));
    // Ein ausgefüllter Betrag von 0 oder weniger fehlt nicht, sondern ist falsch: eigene Meldung
    const empty = miss.filter((k) => k !== 'amount' || !String(d.amount ?? '').trim());
    let message = empty.length ? t('request.missing') : miss.length ? t('request.badAmount') : '';
    if (!message && d.to < d.from) {
      bad.add('period');
      message = t('request.badRange');
    }
    if (!message && d.deadline < todayIso()) {
      bad.add('deadline');
      message = t('request.pastDeadline');
    }
    return { bad, message };
  }

  function refreshRequestForm() {
    const d = myRequestDraft();
    const locked = Boolean(d?.pending);
    for (const input of reqInputs) input.disabled = locked;
    reqPending.hidden = !locked;
    reqUnsent.hidden = locked || store.requestDraftEmpty(d);
    reqTo.min = d?.from || '';
    reqDeadline.min = todayIso();
    if (!reqShowMissing) return;
    const { bad, message } = requestProblems(d || {});
    for (const [key, field] of Object.entries(reqFields)) {
      field.classList.toggle('is-missing', bad.has(key));
      field.querySelectorAll('.in').forEach((input) => input.setAttribute('aria-invalid', String(bad.has(key))));
    }
    reqError.textContent = message;
  }

  function fillRequest() {
    const d = myRequestDraft();
    for (const [input, value] of [[reqPerson, d?.person], [reqPurpose, d?.purpose], [reqFrom, d?.from], [reqTo, d?.to],
      [reqAmount, d?.amount], [reqDeadline, d?.deadline]]) {
      if (document.activeElement !== input && input.value !== (value || '')) input.value = value || '';
    }
    refreshRequestForm();
  }

  async function sendRequest() {
    const d = myRequestDraft();
    reqShowMissing = true;
    refreshRequestForm();
    if (!d || requestProblems(d).message) {
      firstProblem()?.focus();
      return;
    }
    // Ein erneuter Versuch nach Verbindungsabbruch sendet unverändert und braucht keine zweite Rückfrage.
    if (!d.pending) {
      const ok = await confirmDialog({ message: t('request.confirm'), confirmLabel: t('request.confirmYes'), cancelLabel: t('back') });
      if (!ok) return;
    }
    reqSubmit.disabled = true;
    submitLabel(true);
    try {
      await store.sendRequest(d);
      toast(t('request.sent'), 'success', 10000);
      requestSent();
    } catch (err) {
      if (store.state.requests.some((r) => r.id === d.id)) {
        // Die Antwort ging verloren, die Anfrage ist aber angekommen.
        toast(t('request.sent'), 'success', 10000);
        requestSent();
      } else if (err instanceof NetworkError) {
        toast(t('request.offline'), 'error', 12000);
      } else {
        console.error(err);
        toast(t('error.generic'), 'error');
      }
    } finally {
      reqSubmit.disabled = false;
      submitLabel(false);
      refreshRequestForm();
    }
  }

  // Erstes Feld mit einem Problem (zum Hinspringen)
  function firstProblem() {
    return requestForm.querySelector('.is-missing .in');
  }

  function requestSent() {
    reqShowMissing = false;
    reqError.textContent = '';
    for (const field of Object.values(reqFields)) field.classList.remove('is-missing');
    fillRequest();
    renderRequests();
    // Nur wenn das Formular noch offen ist (wer inzwischen etwas anderes einträgt, wird nicht gestört)
    if (mode !== 'request') return;
    setMode(null);
    requestsTitle.focus({ preventScroll: true });
    requestsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function withdrawRequest(r) {
    const ok = await confirmDialog({ message: t('request.withdrawConfirm'), confirmLabel: t('request.withdraw'), cancelLabel: t('back'), danger: true });
    if (!ok) return;
    try {
      await store.withdrawRequest(r);
      toast(t('request.withdrawn'), 'success');
    } catch (err) {
      if (err?.status === 409) toast(t('request.changed'), 'error');
      else if (err instanceof NetworkError) toast(t('error.offline'), 'error');
      else {
        console.error(err);
        toast(t('error.generic'), 'error');
      }
    }
  }

  // ---------------------------------------------------------------- Anfragen an CoM Germany (Liste)
  const requestsList = h('div', { class: 'req-list' });
  const requestsTitle = h('h2', { class: 'section-title', tabindex: '-1' }, t('requests.title'));
  const requestsSection = h('section', { class: 'section', hidden: true }, requestsTitle, requestsList);
  let noticeTimer = null;

  function renderRequests() {
    const now = Date.now();
    const readable = store.state.requests.filter((r) => r.d);
    const removed = readable.filter((r) => r.status === 'removed' && now - r.removedAt < REQUEST_NOTICE_MS)
      .sort((a, b) => b.removedAt - a.removedAt);
    clear(noticeSlot).append(...removed.map(requestRemovedNotice));
    // Der Hinweis verschwindet pünktlich, auch wenn sich sonst nichts ändert.
    clearTimeout(noticeTimer);
    if (removed.length) {
      const next = Math.min(...removed.map((r) => r.removedAt + REQUEST_NOTICE_MS)) - now;
      noticeTimer = setTimeout(renderRequests, Math.min(Math.max(next, 0) + 1000, 2_000_000_000));
    }
    const live = readable.filter((r) => r.status === 'open' || r.status === 'read')
      .sort((a, b) => String(a.d.deadline).localeCompare(String(b.d.deadline)) || a.createdAt - b.createdAt);
    clear(requestsList).append(...live.map((r) => requestCard(r, { onWithdraw: withdrawRequest })));
    requestsSection.hidden = !live.length;
  }

  // ---------------------------------------------------------------- Bezahlungen
  const draftBody = h('tbody');
  const expenseForm = h('div', { class: 'form-card form-wide', hidden: true },
    h('div', { class: 'table-scroll' }, h('table', { class: 'entry-table draft-table' }, expenseHead(['']), draftBody)),
    h('div', { class: 'actions actions-split' },
      h('button', { type: 'button', class: 'btn btn-add', onclick: addRow }, icon('plus', { size: 18 }), t('row.add')),
      h('button', { type: 'button', class: 'btn btn-primary', onclick: saveDrafts }, icon('check', { size: 18 }), t('save'))),
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

  // Solange ein Foto noch verarbeitet wird, würde es beim Speichern fehlen.
  function imagesBusy() {
    if (!images.processing()) return false;
    toast(t('upload.wait'), 'error');
    return true;
  }

  async function saveDrafts() {
    if (imagesBusy()) return;
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
    if (imagesBusy()) return;
    // Erst den neuesten Stand holen, damit keine veraltete Fassung fremder Einträge gespeichert wird.
    try {
      await store.refresh();
    } catch { /* offline: mit dem lokalen Stand weiter */ }
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
    requestChoice.setAttribute('aria-pressed', String(mode === 'request'));
    incomeForm.hidden = mode !== 'income';
    expenseForm.hidden = mode !== 'expense';
    requestForm.hidden = mode !== 'request';
    // kurzer Seitenwechsel wie beim Umdrehen einer Kassette
    const shown = { income: incomeForm, expense: expenseForm, request: requestForm }[mode];
    if (shown) {
      shown.classList.remove('flip-in');
      void shown.offsetWidth;
      shown.classList.add('flip-in');
    }
    if (mode === 'expense') renderDrafts();
    if (mode === 'income') fillIncome();
    if (mode === 'request') fillRequest();
  }

  // ---------------------------------------------------------------- Erfolgreiche Einträge
  const successBox = h('div');

  function renderSuccess() {
    clear(successBox);
    const archive = store.state.lastArchive;
    if (archive) {
      successBox.append(h('p', { class: 'archive-note' }, icon('check', { size: 20 }), h('span', {}, t('success.archived', {
        date: fmtDate(new Date(archive.at).toISOString().slice(0, 10)), n: archive.count,
      }))));
    }
    const groups = successGroups().reverse(); // aktueller Zeitraum oben
    if (!groups.length) {
      successBox.append(emptyState('team-empty', t('success.empty')));
      return;
    }
    for (const g of groups) {
      successBox.append(h('h3', { class: g.current ? 'period-title current' : 'period-title' }, periodTitle(g)), successTable(g.items));
    }
  }

  // ---------------------------------------------------------------- Aufbau
  clear(root).append(
    h('div', { class: 'user-top' }, bandSlot, noticeSlot, warning),
    h('section', { class: 'section section-tight' }, incWrap, allGood),
    h('section', { class: 'section' },
      h('h2', { class: 'section-title' }, t('choose.title')),
      h('div', { class: 'choices' }, incomeChoice, expenseChoice, requestChoice),
      incomeForm,
      expenseForm,
      requestForm),
    requestsSection,
    h('section', { class: 'section' },
      h('h2', { class: 'section-title' }, t('success.title')),
      h('p', { class: 'muted section-intro' }, t('success.intro')),
      successBox),
  );

  function renderIncomplete() {
    const list = store.list()
      .filter((e) => e.kind === 'expense' && e.status === 'incomplete')
      .sort((a, b) => a.createdAt - b.createdAt);
    reconcile(incBody, list, incompleteRows, (e) => new ExpenseRow(e, { mode: 'incomplete', getName, onState: refreshSaveButton }));
    refreshSaveButton();
    incCount.textContent = String(list.length);
    incWrap.hidden = !list.length;
    allGood.hidden = list.length > 0;
  }

  // Am Handy erscheint „Speichern“ nur, wenn eine Zeile offen ist oder alles ausgefüllt hat.
  function refreshSaveButton() {
    incWrap.classList.toggle('needs-save', [...incompleteRows.values()].some((row) => row.wantsSave()));
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
    clear(bandSlot).append(tapeBand(currentPeriod()));
    renderIncomplete();
    if (mode === 'expense') renderDrafts();
    if (mode === 'income') fillIncome();
    if (mode === 'request') fillRequest();
    renderRequests();
    renderSuccess();
  }

  update();
  if (myDrafts('expense').some((e) => !store.isEmpty(e))) setMode('expense');
  else if (myDrafts('income').some((e) => !store.isEmpty(e))) setMode('income');
  else if (!store.requestDraftEmpty(myRequestDraft())) setMode('request');
  return { update };
}
