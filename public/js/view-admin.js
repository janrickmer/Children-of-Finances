// Ansicht für den Schatzmeister von Children of Mathare Germany.
import { h, clear, toast, confirmDialog, fmtDate, fmtAmount, fmtDateTime, fmtBytes, downloadBytes } from './util.js';
import { t } from './i18n.js';
import * as store from './store.js';
import { computePeriods, ledgerAfterArchive } from './ledger.js';
import {
  thumbList, successGroups, periodTitle, successTable, orderedSuccessEntries, statusBadge, tapeBand,
} from './components.js';
import { icon } from './icons.js';
import { buildBackupPdf } from './pdf-export.js';
import { mountBackupView } from './backup-import.js';

const WEEK = 7 * 24 * 60 * 60 * 1000;
const DB_LIMIT = 500_000_000;

export function mountAdmin(root) {
  let exported = null; // { ids, filename } nach erfolgreichem Download

  // ---------------------------------------------------------------- Kopfleiste
  const backupInput = h('input', { type: 'file', accept: 'application/pdf,.pdf', multiple: true, class: 'file-input' });
  const backupPanel = h('section', { class: 'backup-panel', hidden: true });
  backupInput.addEventListener('change', () => {
    const files = [...backupInput.files];
    backupInput.value = '';
    if (files.length) mountBackupView(backupPanel, files);
  });
  const storage = h('div', { class: 'storage' });
  const topBar = h('div', { class: 'admin-top' },
    h('div', { class: 'admin-top-left' }, h('h1', { class: 'view-title' }, t('admin.title')), storage),
    h('label', { class: 'btn' }, backupInput, icon('upload', { size: 18 }), t('admin.uploadBackups')));

  // ---------------------------------------------------------------- Bereiche
  const sidebar = h('aside', { class: 'sidebar' });
  const redBox = h('section', { class: 'section' });
  const successBox = h('section', { class: 'section' });
  const downloadBox = h('section', { class: 'section download-box' });

  clear(root).append(
    topBar,
    backupPanel,
    h('div', { class: 'admin-grid' }, sidebar, h('div', { class: 'admin-main' }, redBox, successBox, downloadBox)),
  );

  // ---------------------------------------------------------------- Geldeingänge links
  function renderSidebar() {
    const { pre, periods } = computePeriods(store.list(), store.state.ledger);
    clear(sidebar).append(h('h2', { class: 'section-title' }, t('admin.incomes')));
    if (!periods.length) sidebar.append(h('p', { class: 'muted' }, t('admin.noIncome')));
    for (const p of [...periods].reverse()) sidebar.append(tapeBand(p));
    if (pre.spent > 0) sidebar.append(tapeBand(pre));
    sidebar.append(h('p', { class: 'muted small' }, t('admin.sumHint')));
  }

  // ---------------------------------------------------------------- Rote Tabelle
  async function approve(e) {
    const ok = await confirmDialog({ message: t('admin.approveConfirm'), confirmLabel: t('admin.approve') });
    if (!ok) return;
    try {
      await store.approve(e);
    } catch {
      toast(t('error.generic'), 'error');
    }
  }

  function renderIncomeDrafts() {
    const drafts = store.list().filter((e) => e.kind === 'income' && e.status === 'draft' && !store.isEmpty(e));
    if (!drafts.length) return;
    redBox.append(h('div', { class: 'income-drafts' },
      h('h3', {}, t('admin.incomeDrafts')),
      h('ul', {}, drafts.map((e) => h('li', {},
        `${fmtDate(e.d.date) || '–'} · KSH ${e.d.amount ? fmtAmount(e.d.amount) : '–'} · ${e.d.from || '–'} · `,
        h('span', { class: 'muted' }, `${t('col.name')}: ${e.d.createdBy || '–'}, ${fmtDateTime(e.createdAt)}`))))));
  }

  function renderRed() {
    const list = store.list()
      .filter((e) => e.kind === 'expense' && (e.status === 'incomplete' || e.status === 'draft'))
      .sort((a, b) => a.createdAt - b.createdAt);
    clear(redBox);
    if (!list.length) {
      redBox.append(h('p', { class: 'all-good' }, icon('check', { size: 22 }), t('incomplete.none')));
      renderIncomeDrafts();
      return;
    }
    const now = Date.now();
    const rows = list.map((e) => {
      const old = now - e.createdAt > WEEK;
      const miss = store.missing(e);
      const cell = (key, content, label) => h('td', { class: miss.includes(key) ? 'is-missing' : '' },
        h('span', { class: 'cell-label' }, label), content);
      return h('tr', {},
        h('td', { class: 'flag-cell' }, old ? h('span', { class: 'overdue', title: t('admin.olderThanWeek') }, icon('alert', { size: 24, label: t('admin.olderThanWeek') })) : null),
        cell('what', e.d.what || '–', t('col.whatOrFrom')),
        cell('date', fmtDate(e.d.payDate) || '–', t('col.dateShort')),
        cell('amount', e.d.amount ? fmtAmount(e.d.amount) : '–', t('col.amountShort')),
        cell('receipt', thumbList(e.d.receipts, t('col.receiptShort')), t('col.receiptShort')),
        cell('transfer', thumbList(e.d.transfers, t('col.transferShort')), t('col.transferShort')),
        cell('note', e.d.note || '–', t('col.noteShort')),
        h('td', {}, h('span', { class: 'cell-label' }, t('col.name')), h('div', {},
          h('div', {}, e.d.createdBy || '–'),
          e.d.editedBy && e.d.editedBy !== e.d.createdBy ? h('div', { class: 'muted small' }, t('row.editedBy', { name: e.d.editedBy })) : null,
          h('div', { class: 'muted small' }, `${t('col.started')}: ${fmtDateTime(e.createdAt)}`))),
        h('td', {}, h('span', { class: 'cell-label' }, t('col.status')), statusBadge(e),
          miss.length ? h('div', { class: 'missing-text' }, icon('alert', { size: 16 }), t('missing.list', { list: miss.map((k) => t(`field.${k}`)).join(', ') })) : null),
        h('td', {}, h('span', { class: 'cell-label' }, t('col.action')),
          h('button', { type: 'button', class: 'btn btn-small btn-approve', onclick: () => approve(e) }, t('admin.approve'))),
      );
    });
    redBox.append(h('div', { class: 'red-wrap' },
      h('div', { class: 'red-head' }, h('h2', { class: 'red-title' }, t('incomplete.title')), h('span', { class: 'red-count' }, String(list.length))),
      h('div', { class: 'table-scroll' }, h('table', { class: 'data-table cards-on-mobile red-table' },
        h('thead', {}, h('tr', {},
          h('th', { class: 'flag-cell' }, h('span', { class: 'sr-only' }, '!')),
          h('th', {}, t('col.what')),
          h('th', {}, t('col.dateShort')),
          h('th', { class: 'num' }, t('col.amountShort')),
          h('th', {}, t('col.receiptShort')),
          h('th', {}, t('col.transferShort')),
          h('th', {}, t('col.noteShort')),
          h('th', {}, t('col.name')),
          h('th', {}, t('col.status')),
          h('th', {}, t('col.action')))),
        h('tbody', {}, rows)))));
    renderIncomeDrafts();
  }

  // ---------------------------------------------------------------- Erfolgreiche Einträge
  function renderSuccess() {
    clear(successBox).append(h('h2', { class: 'section-title' }, t('success.title')));
    const archive = store.state.lastArchive;
    if (archive) {
      successBox.append(h('p', { class: 'archive-note' }, icon('check', { size: 20 }), t('success.archived', {
        date: fmtDate(new Date(archive.at).toISOString().slice(0, 10)), n: archive.count,
      })));
    }
    const groups = successGroups();
    if (!groups.length) successBox.append(h('p', { class: 'muted' }, t('success.empty')));
    for (const g of groups) {
      successBox.append(h('h3', { class: g.current ? 'period-title current' : 'period-title' }, periodTitle(g)), successTable(g.items, { admin: true }));
    }
  }

  // ---------------------------------------------------------------- Herunterladen & Löschen
  const progress = h('p', { class: 'muted', role: 'status' });
  const downloadBtn = h('button', { type: 'button', class: 'btn btn-primary', onclick: download }, icon('download', { size: 18 }), t('admin.download'));

  async function download() {
    const entries = orderedSuccessEntries();
    if (!entries.length) {
      toast(t('admin.nothingToDownload'));
      return;
    }
    downloadBtn.disabled = true;
    try {
      const { bytes, filename, missingIds } = await buildBackupPdf(entries, (done, total) => {
        progress.textContent = t('admin.preparing', { done, total });
      });
      downloadBytes(bytes, filename, 'application/pdf');
      // Einträge, deren Bilder nicht vollständig in der PDF stehen, bleiben in der Datenbank.
      exported = { ids: entries.filter((e) => !missingIds.includes(e.id)).map((e) => e.id), filename, skipped: missingIds.length };
      if (missingIds.length) toast(t('admin.imagesMissing', { n: missingIds.length }), 'error', 20000);
      progress.textContent = '';
      renderDownload();
    } catch (err) {
      console.error(err);
      progress.textContent = '';
      toast(t('error.generic'), 'error');
    } finally {
      downloadBtn.disabled = false;
    }
  }

  async function deleteExported() {
    const ok = await confirmDialog({
      message: t('admin.deleteConfirm', { n: exported.ids.length }),
      confirmLabel: t('admin.deleteYes'),
      checkboxLabel: t('admin.deleteCheck'),
      danger: true,
    });
    if (!ok) return;
    try {
      const ledger = ledgerAfterArchive(store.list(), store.state.ledger, exported.ids);
      const deleted = await store.archive(exported.ids, ledger);
      exported = null;
      toast(t('admin.deleted', { n: deleted }), 'success');
      renderDownload();
    } catch (err) {
      console.error(err);
      toast(t('error.generic'), 'error');
    }
  }

  function renderDownload() {
    clear(downloadBox).append(downloadBtn, progress);
    if (exported) {
      downloadBox.append(h('p', { class: 'download-done' }, t('admin.downloaded', { file: exported.filename, n: exported.ids.length + exported.skipped })));
      if (exported.skipped) downloadBox.append(h('p', { class: 'form-error' }, t('admin.imagesMissing', { n: exported.skipped })));
      if (exported.ids.length) {
        downloadBox.append(h('button', { type: 'button', class: 'btn btn-danger', onclick: deleteExported }, icon('trash', { size: 18 }), t('admin.delete')));
      }
    }
  }

  function renderStorage() {
    const size = store.state.dbSize;
    clear(storage);
    if (size == null) return;
    storage.append(t('admin.storage', { used: fmtBytes(size) }));
    if (size > DB_LIMIT * 0.8) storage.append(h('span', { class: 'form-error block' }, t('admin.storageWarn')));
  }

  function update(reason) {
    renderStorage();
    if (reason === 'sync') return;
    renderSidebar();
    renderRed();
    renderSuccess();
  }

  update();
  renderDownload();
  return { update };
}
