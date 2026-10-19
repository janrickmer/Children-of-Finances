// Wiederverwendbare Bausteine: Eingabezeile für Zahlungen, Bildfelder, Vorschaubilder, Erfolgstabelle.
import { h, clear, append, openLightbox, infoButton, fmtDate, fmtAmount, fmtDateTime, todayIso } from './util.js';
import { t } from './i18n.js';
import * as store from './store.js';
import * as images from './images.js';
import { computePeriods, periodFor, SAVED } from './ledger.js';
import { icon } from './icons.js';

// ------------------------------------------------------------------ Vorschaubilder

const observer = 'IntersectionObserver' in window
  ? new IntersectionObserver((items) => {
    for (const item of items) {
      if (item.isIntersecting) {
        observer.unobserve(item.target);
        item.target.loadThumb?.();
      }
    }
  }, { rootMargin: '200px' })
  : null;

export function thumb({ loadThumb, loadFull, caption, onRemove, pending }) {
  const img = h('img', { class: 'thumb-img', alt: '' });
  const wrap = h('div', { class: pending ? 'thumb-wrap pending' : 'thumb-wrap' });
  const open = h('button', { type: 'button', class: 'thumb', title: caption || '', 'aria-label': caption || '', onclick: () => openLightbox(loadFull, caption) }, img);
  wrap.append(open);
  if (pending) wrap.append(h('span', { class: 'thumb-badge' }, t('upload.pending')));
  if (onRemove) {
    wrap.append(h('button', {
      type: 'button', class: 'thumb-remove', 'aria-label': t('upload.remove'), title: t('upload.remove'), onclick: onRemove,
    }, icon('x', { size: 14 })));
  }
  img.loadThumb = () => loadThumb().then((url) => { img.src = url; }).catch(() => {
    wrap.classList.add('broken');
    open.disabled = true;
    open.append(h('span', { class: 'thumb-missing' }, t('admin.missingImage')));
  });
  if (observer) observer.observe(img);
  else img.loadThumb();
  return wrap;
}

export function storedThumb(id, caption, onRemove) {
  return thumb({
    loadThumb: () => images.getThumbUrl(id),
    loadFull: () => images.getFullUrl(id),
    caption,
    onRemove,
    pending: images.isPending(id),
  });
}

export function thumbList(ids, caption) {
  if (!ids?.length) return h('span', { class: 'muted' }, '–');
  return h('div', { class: 'thumbs' }, ids.map((id, i) => storedThumb(id, `${caption} ${i + 1}/${ids.length}`)));
}

// ------------------------------------------------------------------ Eingabefelder

// Datumsfeld, das nur über den Kalender befüllt wird (keine Texteingabe).
export function dateInput(onChange) {
  const input = h('input', { type: 'date', class: 'in in-date', max: todayIso() });
  const openPicker = () => {
    try {
      input.showPicker();
    } catch { /* ältere Browser öffnen den Kalender selbst */ }
  };
  input.addEventListener('click', openPicker);
  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Tab' || ev.key === 'Escape') return;
    ev.preventDefault();
    if (ev.key === 'Enter' || ev.key === ' ') openPicker();
    if (ev.key === 'Backspace' || ev.key === 'Delete') {
      input.value = '';
      onChange('');
    }
  });
  input.addEventListener('paste', (ev) => ev.preventDefault());
  input.addEventListener('change', () => onChange(input.value));
  input.addEventListener('input', () => onChange(input.value));
  return input;
}

export function amountInput(onChange) {
  const input = h('input', { type: 'number', class: 'in in-amount', min: '0', step: '0.01', inputmode: 'decimal', placeholder: 'KSH' });
  input.addEventListener('input', () => onChange(input.value));
  return input;
}

function setIfIdle(input, value) {
  const v = value ?? '';
  if (document.activeElement !== input && input.value !== v) input.value = v;
}

class ImageEditor {
  constructor(row, field, caption) {
    this.row = row;
    this.field = field;
    this.caption = caption;
    this.list = h('div', { class: 'thumbs' });
    this.error = h('div', { class: 'upload-error', role: 'alert' });
    this.busy = h('div', { class: 'upload-busy', hidden: true }, icon('saving', { size: 16 }), t('upload.processing'));
    this.input = h('input', { type: 'file', accept: 'image/*,application/pdf,.pdf', multiple: true, class: 'file-input' });
    this.labelText = h('span', {}, t('upload.add'));
    this.button = h('label', { class: 'btn btn-small upload-btn' }, this.input, icon('camera', { size: 18 }), this.labelText);
    this.input.addEventListener('change', () => this.onFiles());
    this.el = h('div', { class: 'img-editor' }, this.list, this.button, this.busy, this.error);
    this.render();
  }

  get ids() {
    return this.row.entry.d[this.field] || [];
  }

  async onFiles() {
    const files = [...this.input.files];
    this.input.value = '';
    this.error.textContent = '';
    this.busy.hidden = false;
    for (const file of files) {
      try {
        const id = await images.addImage(file, this.row.entry.id);
        if (SAVED.includes(this.row.entry.status)) {
          images.removeImage(id); // Eintrag wurde inzwischen abgeschlossen
          this.error.textContent = t('upload.tooLate');
          continue;
        }
        store.update(this.row.entry, { [this.field]: [...this.ids, id] }, this.row.getName());
        this.render();
        this.row.refreshMissing();
      } catch (err) {
        this.error.textContent = t(err instanceof images.ImageError ? err.message : 'upload.failed');
      }
    }
    this.busy.hidden = true;
  }

  remove(id) {
    images.removeImage(id);
    store.update(this.row.entry, { [this.field]: this.ids.filter((x) => x !== id) }, this.row.getName());
    this.render();
    this.row.refreshMissing();
  }

  render() {
    const ids = this.ids;
    const key = ids.map((id) => id + images.isPending(id)).join();
    if (key === this.lastKey) return;
    this.lastKey = key;
    clear(this.list);
    ids.forEach((id, i) => this.list.append(storedThumb(id, `${this.caption} ${i + 1}/${ids.length}`, () => this.remove(id))));
    this.labelText.textContent = ids.length ? t('upload.more') : t('upload.add');
  }
}

function cellLabel(text, ...extra) {
  return h('span', { class: 'cell-label' }, text, ...extra);
}

function requiredMark() {
  return h('span', { class: 'req', title: t('col.required') }, ' *');
}

// Kopfzeile der Zahlungstabelle (Spalten 1–6 + optionale Zusatzspalten).
export function expenseHead(extra = []) {
  return h('thead', {}, h('tr', {},
    h('th', {}, t('col.what'), requiredMark()),
    h('th', {}, t('col.date'), requiredMark()),
    h('th', {}, t('col.amount'), requiredMark()),
    h('th', {}, t('col.receipt'), requiredMark(), ' ', infoButton(() => t('col.receiptInfo'), t('col.receiptInfoButton'))),
    h('th', {}, t('col.transfer'), h('span', { class: 'optional' }, ` (${t('col.transferOptional')})`)),
    h('th', {}, t('col.note')),
    extra.map((x) => h('th', {}, x)),
  ));
}

// Eine bearbeitbare Zeile (Entwurf oder unvollständiger Eintrag).
export class ExpenseRow {
  constructor(entry, { mode, getName, onDelete }) {
    this.entry = entry;
    this.mode = mode;
    this.getName = getName;
    const name = () => getName();

    this.what = h('textarea', { class: 'in', rows: 2, maxlength: 1000, 'aria-label': t('col.what') });
    this.what.addEventListener('input', () => { store.update(entry, { what: this.what.value }, name()); this.refreshMissing(); });
    this.date = dateInput((v) => { store.update(entry, { payDate: v }, name()); this.refreshMissing(); });
    this.date.setAttribute('aria-label', t('col.date'));
    this.amount = amountInput((v) => { store.update(entry, { amount: v }, name()); this.refreshMissing(); });
    this.amount.setAttribute('aria-label', t('col.amount'));
    this.note = h('textarea', { class: 'in', rows: 2, maxlength: 2000, 'aria-label': t('col.note') });
    this.note.addEventListener('input', () => store.update(entry, { note: this.note.value }, name()));
    this.receipts = new ImageEditor(this, 'receipts', t('col.receiptShort'));
    this.transfers = new ImageEditor(this, 'transfers', t('col.transferShort'));

    this.cells = {
      what: h('td', {}, cellLabel(t('col.what'), requiredMark()), this.what),
      date: h('td', {}, cellLabel(t('col.date'), requiredMark()), this.date),
      amount: h('td', {}, cellLabel(t('col.amount'), requiredMark()), this.amount),
      receipt: h('td', {}, cellLabel(t('col.receipt'), requiredMark(), ' ',
        infoButton(() => t('col.receiptInfo'), t('col.receiptInfoButton'))), this.receipts.el),
      transfer: h('td', {}, cellLabel(t('col.transfer'), h('span', { class: 'optional' }, ` (${t('col.transferOptional')})`)), this.transfers.el),
      note: h('td', {}, cellLabel(t('col.note')), this.note),
    };
    this.tr = h('tr', { class: 'entry-row', dataset: { id: entry.id } }, Object.values(this.cells));

    if (mode === 'incomplete') {
      this.info = h('div', { class: 'row-info' });
      this.tr.append(h('td', {}, cellLabel(t('col.name')), this.info));
    } else {
      this.tr.append(h('td', { class: 'row-actions' }, h('button', {
        type: 'button', class: 'btn btn-small btn-ghost', onclick: () => onDelete(entry),
      }, icon('trash', { size: 16 }), t('row.delete'))));
    }
    this.update();
  }

  update() {
    const d = this.entry.d;
    setIfIdle(this.what, d.what);
    setIfIdle(this.date, d.payDate);
    setIfIdle(this.amount, d.amount);
    setIfIdle(this.note, d.note);
    this.receipts.render();
    this.transfers.render();
    this.refreshMissing();
  }

  refreshMissing() {
    if (this.mode !== 'incomplete') return;
    const miss = store.missing(this.entry);
    for (const key of ['what', 'date', 'amount', 'receipt']) this.cells[key].classList.toggle('is-missing', miss.includes(key));
    const d = this.entry.d;
    append(clear(this.info), [
      h('div', {}, d.createdBy || '–'),
      d.editedBy && d.editedBy !== d.createdBy ? h('div', { class: 'muted small' }, t('row.editedBy', { name: d.editedBy })) : null,
      h('div', { class: 'muted small' }, fmtDateTime(this.entry.createdAt)),
      miss.length ? h('div', { class: 'missing-text' }, icon('alert', { size: 16 }), t('missing.list', { list: miss.map((k) => t(`field.${k}`)).join(', ') })) : null,
    ]);
  }
}

// Zeilen einer Tabelle anhand der Eintrags-ID abgleichen, ohne fokussierte Felder neu aufzubauen.
export function reconcile(tbody, entries, rows, create) {
  const keep = new Set(entries.map((e) => e.id));
  for (const [id, row] of rows) {
    if (!keep.has(id)) {
      row.tr.remove();
      rows.delete(id);
    }
  }
  let prev = null;
  for (const e of entries) {
    let row = rows.get(e.id);
    if (!row) {
      row = create(e);
      rows.set(e.id, row);
    } else {
      row.entry = e;
      row.update();
    }
    const expected = prev ? prev.nextSibling : tbody.firstChild;
    if (expected !== row.tr) tbody.insertBefore(row.tr, expected);
    prev = row.tr;
  }
}

// ------------------------------------------------------------------ Erfolgreiche Einträge

// Gespeicherte Einträge nach Zeitraum gruppiert, chronologisch (älteste zuerst).
export function successGroups() {
  const all = store.list();
  const { pre, periods } = computePeriods(all, store.state.ledger);
  const groups = new Map();
  const ensure = (period) => {
    if (!groups.has(period.key)) groups.set(period.key, { period, items: [] });
    return groups.get(period.key);
  };
  for (const e of all) {
    if (!SAVED.includes(e.status)) continue;
    const period = e.kind === 'income'
      ? periods.find((p) => p.key === e.id) || pre
      : periodFor(periods, pre, e.d.payDate);
    ensure(period).items.push(e);
  }
  const order = [pre, ...periods];
  const result = order.filter((p) => groups.has(p.key)).map((p) => groups.get(p.key));
  for (const g of result) {
    g.items.sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === 'income' ? -1 : 1;
      return (dateOf(a) || '9999').localeCompare(dateOf(b) || '9999') || a.createdAt - b.createdAt;
    });
    g.current = g.period === periods[periods.length - 1];
  }
  return result;
}

export function dateOf(e) {
  return e.kind === 'income' ? e.d.date : e.d.payDate;
}

export function orderedSuccessEntries() {
  return successGroups().flatMap((g) => g.items);
}

export function periodTitle(group) {
  const p = group.period;
  const base = p.income
    ? t('period.since', { date: fmtDate(p.income.date), amount: fmtAmount(p.income.amount), from: p.income.from || '–' })
    : t('period.pre');
  return [h('span', {}, base), group.current ? h('span', { class: 'now' }, t('period.current')) : null];
}

// Das Band: ein Geldeingang als Kassettenseite mit fester Länge, die nicht überlaufen darf.
export function tapeBand(period) {
  if (!period) {
    return h('div', { class: 'tape-band empty', role: 'group', 'aria-label': t('band.label') }, t('band.none'));
  }
  const inc = period.income;
  const amount = inc ? inc.amount : 0;
  const left = amount - period.spent;
  const over = left < 0;
  const ratio = amount > 0 ? Math.min(1, period.spent / amount) : (period.spent > 0 ? 1 : 0);
  const fill = h('div', { class: 'tape-fill' });
  fill.style.transform = `scaleX(${ratio})`;
  const classes = ['tape-band', over && 'overflow', inc?.archived && 'archived'].filter(Boolean).join(' ');
  return h('div', { class: classes, role: 'group', 'aria-label': t('band.label') },
    h('div', { class: 'tape-head' },
      h('div', { class: 'tape-source' },
        h('strong', {}, inc ? inc.from || '–' : t('period.pre')),
        inc ? t('band.since', { date: fmtDate(inc.date) }) : null,
        inc?.archived ? ` · ${t('admin.archivedIncome')}` : null),
      inc ? h('div', { class: 'tape-total' }, `KSh ${fmtAmount(amount)}`) : null),
    inc ? h('div', { class: 'tape-track', 'aria-hidden': 'true' }, fill) : null,
    h('div', { class: 'tape-foot' },
      h('span', { class: 'tape-spent' }, h('small', {}, t('band.paid')), h('b', {}, `KSh ${fmtAmount(period.spent)}`)),
      inc ? h('span', { class: 'tape-left' }, h('small', {}, t(over ? 'band.over' : 'band.left')),
        h('b', {}, `KSh ${fmtAmount(over ? -left : left)}`)) : null));
}

export function currentPeriod() {
  const { periods } = computePeriods(store.list(), store.state.ledger);
  return periods[periods.length - 1] || null;
}

export function statusBadge(e) {
  return h('span', { class: `badge badge-${e.status}` }, t(`status.${e.status}`));
}

export function successTable(items, { admin = false } = {}) {
  const head = h('thead', {}, h('tr', {},
    h('th', {}, t('col.dateShort')),
    h('th', {}, t('col.kind')),
    h('th', {}, t('col.whatOrFrom')),
    h('th', { class: 'num' }, t('col.amountShort')),
    h('th', {}, t('col.receiptShort')),
    h('th', {}, t('col.transferShort')),
    h('th', {}, t('col.noteShort')),
    h('th', {}, t('col.name')),
    admin && h('th', {}, t('col.enteredAt')),
    h('th', {}, t('col.status')),
  ));
  // Leere Zellen werden am Handy ausgeblendet (die Titelzeile zeigt nur, was es gibt).
  const cell = (cls, label, content) => {
    const empty = content == null || content === '' || content === '–';
    return h('td', { class: empty ? `${cls} is-empty` : cls }, cellLabel(label), empty ? '–' : content);
  };
  const body = h('tbody', {}, items.map((e) => {
    const income = e.kind === 'income';
    return h('tr', { class: income ? 'row-income' : '' },
      cell('c-date', t('col.dateShort'), fmtDate(dateOf(e))),
      cell('c-kind plain', t('col.kind'), t(income ? 'kind.income' : 'kind.expense')),
      cell('c-what wrap', t('col.whatOrFrom'), income ? e.d.from : e.d.what),
      cell('c-amount num', t('col.amountShort'), fmtAmount(e.d.amount)),
      cell('c-receipt', t('col.receiptShort'), income || !e.d.receipts?.length ? null : thumbList(e.d.receipts, t('col.receiptShort'))),
      cell('c-transfer', t('col.transferShort'), income || !e.d.transfers?.length ? null : thumbList(e.d.transfers, t('col.transferShort'))),
      cell('c-note wrap', t('col.noteShort'), e.d.note),
      cell('c-name', t('col.name'), e.d.createdBy),
      admin && cell('c-at plain', t('col.enteredAt'), fmtDateTime(e.createdAt)),
      cell('c-status plain', t('col.status'), statusBadge(e)),
    );
  }));
  return h('div', { class: 'table-scroll' }, h('table', { class: 'data-table track-table' }, head, body));
}
