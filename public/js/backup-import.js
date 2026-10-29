// Liest Sicherungs-PDFs (nur im Browser, nichts wird gespeichert) und zeigt sie als filterbare,
// sortierbare Tabelle mit aufklappbaren Zeilen.
import { h, clear, fmtDate, fmtDateTime, fmtAmount, isoFromTs, ensurePdfLib } from './util.js';
import { t } from './i18n.js';
import { thumb, statusBadge } from './components.js';
import { BACKUP_FORMAT, ATTACHMENT_NAME } from './pdf-export.js';
import { sha256Hex } from './kdf.js';
import { icon } from './icons.js';

function findAttachment(pdf, name) {
  const { PDFName, PDFDict, PDFArray, PDFRawStream, decodePDFRawStream } = window.PDFLib;
  const search = (node) => {
    if (!node) return null;
    const names = node.lookupMaybe(PDFName.of('Names'), PDFArray);
    if (names) {
      for (let i = 0; i + 1 < names.size(); i += 2) {
        const key = names.lookup(i);
        if (key?.decodeText?.() !== name) continue;
        const spec = names.lookup(i + 1, PDFDict);
        const stream = spec.lookup(PDFName.of('EF'), PDFDict).lookup(PDFName.of('F'), PDFRawStream);
        return decodePDFRawStream(stream).decode();
      }
    }
    const kids = node.lookupMaybe(PDFName.of('Kids'), PDFArray);
    for (let i = 0; kids && i < kids.size(); i++) {
      const found = search(kids.lookup(i, PDFDict));
      if (found) return found;
    }
    return null;
  };
  const namesDict = pdf.catalog.lookupMaybe(PDFName.of('Names'), PDFDict);
  return search(namesDict?.lookupMaybe(PDFName.of('EmbeddedFiles'), PDFDict));
}

function imageOnPage(pdf, index) {
  const { PDFName, PDFDict, PDFRawStream } = window.PDFLib;
  if (index == null || index < 0 || index >= pdf.getPageCount()) return null;
  const resources = pdf.getPage(index).node.Resources();
  const xobjects = resources?.lookupMaybe(PDFName.of('XObject'), PDFDict);
  if (!xobjects) return null;
  for (const [, ref] of xobjects.entries()) {
    const obj = pdf.context.lookup(ref);
    if (obj instanceof PDFRawStream && obj.dict.get(PDFName.of('Subtype')) === PDFName.of('Image')) return obj.contents;
  }
  return null;
}

export async function readBackup(file) {
  const { PDFDocument } = await ensurePdfLib();
  const pdf = await PDFDocument.load(new Uint8Array(await file.arrayBuffer()), { updateMetadata: false, ignoreEncryption: true });
  const raw = findAttachment(pdf, ATTACHMENT_NAME);
  if (!raw) throw new Error('invalid');
  const data = JSON.parse(new TextDecoder().decode(raw));
  if (data.format !== BACKUP_FORMAT || !Array.isArray(data.entries)) throw new Error('invalid');

  const withImages = async (list = []) => {
    const out = [];
    for (const ref of list) {
      const bytes = imageOnPage(pdf, ref.page);
      if (!bytes) continue;
      const verified = ref.sha256 ? (await sha256Hex(bytes)) === ref.sha256 : null;
      out.push({ ...ref, bytes, verified });
    }
    return out;
  };

  const entries = [];
  for (const rec of data.entries) {
    entries.push({
      ...rec,
      file: file.name,
      createdTs: Date.parse(rec.createdAt) || 0,
      paidOn: rec.kind === 'income' ? rec.date : rec.payDate,
      receiptImages: await withImages(rec.receipts),
      transferImages: await withImages(rec.transfers),
    });
  }
  return entries;
}

// ------------------------------------------------------------------ Anzeige

// Sicherungen vor dem 29.10.2026 kennen das Bestätigen von Geldeingängen nicht (kein Feld „confirmed“):
// Dort steht für Geldeingänge wie damals „vollständig“.
function backupBadge(e) {
  if (e.kind !== 'income') return statusBadge(e);
  if (typeof e.confirmed !== 'boolean') return statusBadge({ kind: 'expense', status: 'complete' });
  return statusBadge({ kind: 'income', status: e.confirmed ? 'approved' : 'complete' });
}

export function mountBackupView(panel, files, onClose) {
  const urls = [];
  const state = {
    entries: [], duplicates: 0, files: 0, errors: [],
    filter: { name: '', enteredFrom: '', enteredTo: '', paidFrom: '', paidTo: '' },
    sort: { key: 'createdTs', dir: 1 },
    expanded: new Set(),
  };
  const status = h('p', { class: 'muted' });
  const controls = h('div', { class: 'backup-filters' });
  const tableBox = h('div');
  const closeView = () => {
    urls.forEach((u) => URL.revokeObjectURL(u));
    clear(panel);
    panel.hidden = true;
    onClose?.();
  };

  clear(panel).append(
    h('div', { class: 'backup-head' },
      h('h2', { class: 'section-title' }, t('backup.title')),
      h('button', { type: 'button', class: 'btn btn-small', onclick: closeView }, icon('x', { size: 16 }), t('backup.closeView'))),
    h('p', { class: 'muted' }, t('backup.intro')),
    status, controls, tableBox,
  );
  panel.hidden = false;

  const objectUrl = (bytes) => {
    const url = URL.createObjectURL(new Blob([bytes], { type: 'image/jpeg' }));
    urls.push(url);
    return url;
  };

  (async () => {
    const seen = new Set();
    for (const file of files) {
      status.textContent = t('backup.reading', { file: file.name });
      try {
        const list = await readBackup(file);
        state.files++;
        for (const e of list) {
          if (seen.has(e.id)) {
            state.duplicates++;
            continue;
          }
          seen.add(e.id);
          state.entries.push(e);
        }
      } catch (err) {
        console.warn(err);
        state.errors.push(t('backup.invalid', { file: file.name }));
      }
    }
    renderControls();
    render();
  })();

  function renderControls() {
    const names = [...new Set(state.entries.map((e) => e.createdBy).filter(Boolean))].sort((a, b) => a.localeCompare(b));
    const bind = (key, input) => {
      input.value = state.filter[key];
      input.addEventListener('input', () => {
        state.filter[key] = input.value;
        render();
      });
      return input;
    };
    const nameSelect = bind('name', h('select', { class: 'in' },
      h('option', { value: '' }, t('backup.all')), names.map((n) => h('option', { value: n }, n))));
    const range = (label, fromKey, toKey) => h('fieldset', { class: 'range' },
      h('legend', {}, label),
      h('label', {}, t('backup.from'), ' ', bind(fromKey, h('input', { type: 'date', class: 'in' }))),
      h('label', {}, t('backup.to'), ' ', bind(toKey, h('input', { type: 'date', class: 'in' }))));
    clear(controls).append(
      h('label', { class: 'field-inline' }, t('backup.filterName'), ' ', nameSelect),
      range(t('backup.enteredRange'), 'enteredFrom', 'enteredTo'),
      range(t('backup.paidRange'), 'paidFrom', 'paidTo'),
      h('button', {
        type: 'button', class: 'btn btn-small',
        onclick: () => {
          state.filter = { name: '', enteredFrom: '', enteredTo: '', paidFrom: '', paidTo: '' };
          renderControls();
          render();
        },
      }, t('backup.reset')),
    );
  }

  function visible() {
    const f = state.filter;
    const list = state.entries.filter((e) => {
      const entered = e.createdTs ? isoFromTs(e.createdTs) : '';
      if (f.name && e.createdBy !== f.name) return false;
      if (f.enteredFrom && entered < f.enteredFrom) return false;
      if (f.enteredTo && entered > f.enteredTo) return false;
      if (f.paidFrom && (!e.paidOn || e.paidOn < f.paidFrom)) return false;
      if (f.paidTo && (!e.paidOn || e.paidOn > f.paidTo)) return false;
      return true;
    });
    const { key, dir } = state.sort;
    const value = (e) => (key === 'amount' ? Number(e.amount) || 0 : String(e[key] ?? ''));
    return list.sort((a, b) => {
      const va = value(a);
      const vb = value(b);
      const cmp = typeof va === 'number' ? va - vb : va.localeCompare(vb);
      return cmp * dir || a.createdTs - b.createdTs;
    });
  }

  function sortHeader(label, key, className) {
    const active = state.sort.key === key;
    const arrow = icon(active ? (state.sort.dir === 1 ? 'arrow-up' : 'arrow-down') : 'sort', { size: 16 });
    return h('th', { class: className, 'aria-sort': active ? (state.sort.dir === 1 ? 'ascending' : 'descending') : 'none' },
      h('button', {
        type: 'button', class: 'sort-btn',
        onclick: () => {
          state.sort = { key, dir: active ? -state.sort.dir : 1 };
          render();
        },
      }, label, arrow));
  }

  function imagesBlock(title, list) {
    return h('div', { class: 'detail-images' },
      h('h4', {}, title),
      list.length
        ? h('div', { class: 'thumbs' }, list.map((img, i) => {
          let url = null;
          const get = () => {
            url = url || objectUrl(img.bytes);
            return Promise.resolve(url);
          };
          return thumb({ loadThumb: get, loadFull: get, caption: `${title} ${i + 1}/${list.length}` });
        }))
        : h('p', { class: 'muted' }, t('backup.noImages')));
  }

  function render() {
    const list = visible();
    status.textContent = '';
    status.append(
      t('backup.count', { n: state.entries.length, f: state.files }), ' · ', t('backup.shown', { n: list.length }),
      state.duplicates ? ` · ${t('backup.duplicates', { n: state.duplicates })}` : '',
      ...state.errors.map((msg) => h('span', { class: 'form-error block' }, msg)),
    );
    const head = h('thead', {}, h('tr', {},
      sortHeader(t('backup.enteredRange'), 'createdTs'),
      sortHeader(t('backup.paidRange'), 'paidOn'),
      h('th', {}, t('col.kind')),
      h('th', {}, t('col.whatOrFrom')),
      sortHeader(t('col.amountShort'), 'amount', 'num'),
      sortHeader(t('col.name'), 'createdBy'),
      h('th', {}, t('col.noteShort')),
      h('th', {}, t('col.status')),
      h('th', {}, t('col.file')),
    ));
    const body = h('tbody');
    for (const e of list) {
      const open = state.expanded.has(e.id);
      const income = e.kind === 'income';
      const row = h('tr', {
        class: `backup-row${open ? ' open' : ''}${income ? ' row-income' : ''}`, tabindex: '0', 'aria-expanded': String(open),
      },
      h('td', {}, h('span', { class: 'chevron' }, icon(open ? 'chevron-down' : 'chevron-right', { size: 18 })), fmtDateTime(e.createdTs)),
      h('td', {}, fmtDate(e.paidOn) || '–'),
      h('td', {}, t(income ? 'kind.income' : 'kind.expense')),
      h('td', { class: 'wrap' }, (income ? e.from : e.what) || '–'),
      h('td', { class: 'num' }, fmtAmount(e.amount)),
      h('td', {}, e.createdBy || '–'),
      h('td', { class: 'wrap' }, e.note || '–'),
      h('td', {}, backupBadge(e)),
      h('td', { class: 'small' }, e.file));
      const toggle = () => {
        if (open) state.expanded.delete(e.id);
        else state.expanded.add(e.id);
        render();
      };
      row.addEventListener('click', toggle);
      row.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          toggle();
        }
      });
      body.append(row);
      if (open) {
        body.append(h('tr', { class: 'backup-detail' }, h('td', { colspan: '9' },
          income
            ? h('p', { class: 'muted' }, t('backup.noImages'))
            : h('div', { class: 'detail-grid' },
              imagesBlock(t('col.receiptShort'), e.receiptImages),
              imagesBlock(t('col.transferShort'), e.transferImages)))));
      }
    }
    clear(tableBox).append(h('div', { class: 'table-scroll' }, h('table', { class: 'data-table backup-table' }, head, body)));
  }
}
