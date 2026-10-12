// Erstellt die Sicherungs-PDF: pro Eintrag eine Infoseite, danach je eine Seite pro Bild
// (Rechnung, Transaktionsnachweis). Zusätzlich steckt eine JSON-Datei mit allen Angaben als
// PDF-Anhang darin; die Bilder werden beim Wiedereinlesen direkt aus den Bildseiten gelesen.
import * as images from './images.js';
import { sha256Hex } from './kdf.js';
import { parseAmount, ensurePdfLib } from './util.js';

export const BACKUP_FORMAT = 'children-of-finances-backup';
export const ATTACHMENT_NAME = 'children-of-finances-daten.json';

const A4 = [595.28, 841.89];
const MARGIN = 50;
const de = {
  date: new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }),
  dateTime: new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
  amount: new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
};

const fmtDate = (iso) => (iso ? de.date.format(new Date(`${iso}T00:00:00Z`)) : '–');
const fmtDateTime = (ts) => (ts ? de.dateTime.format(new Date(ts)) : '–');
const fmtKsh = (v) => `KSH ${de.amount.format(parseAmount(v))}`;

// Standardschriften können nur WinAnsi-Zeichen darstellen; alles andere wird ersetzt.
// (Die exakten Texte stehen zusätzlich im JSON-Anhang.)
const WIN_ANSI_EXTRA = '€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ';
function pdfSafe(text) {
  return Array.from(String(text ?? '').replace(/\t/g, ' '), (ch) => {
    const c = ch.codePointAt(0);
    if (ch === '\n' || (c >= 0x20 && c <= 0x7e) || (c >= 0xa0 && c <= 0xff) || WIN_ANSI_EXTRA.includes(ch)) return ch;
    return '?';
  }).join('');
}

function wrap(text, font, size, width) {
  const lines = [];
  for (const paragraph of pdfSafe(text).split('\n')) {
    let line = '';
    for (const word of paragraph.split(' ')) {
      const candidate = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) <= width) {
        line = candidate;
        continue;
      }
      if (line) lines.push(line);
      line = '';
      let rest = word;
      while (font.widthOfTextAtSize(rest, size) > width) {
        let cut = rest.length - 1;
        while (cut > 1 && font.widthOfTextAtSize(rest.slice(0, cut), size) > width) cut--;
        lines.push(rest.slice(0, cut));
        rest = rest.slice(cut);
      }
      line = rest;
    }
    lines.push(line);
  }
  return lines;
}

function pageRange(list) {
  if (!list.length) return null;
  const first = list[0].page + 1;
  const last = list[list.length - 1].page + 1;
  return first === last ? `Seite ${first}` : `Seiten ${first}–${last}`;
}

function missingFields(e) {
  const d = e.d;
  const out = [];
  if (!d.what?.trim()) out.push('Beschreibung');
  if (!d.payDate) out.push('Bezahldatum');
  if (!(parseAmount(d.amount) > 0)) out.push('Betrag');
  if (!d.receipts?.length) out.push('Rechnung');
  return out;
}

export async function buildBackupPdf(entries, onProgress = () => {}) {
  const { PDFDocument, StandardFonts, rgb } = await ensurePdfLib();
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const now = new Date();
  const colors = { text: rgb(0.1, 0.1, 0.1), muted: rgb(0.42, 0.42, 0.42), accent: rgb(0.8, 0.35, 0), red: rgb(0.7, 0.05, 0.05) };

  pdf.setTitle(`Children of Finances – Sicherung vom ${fmtDateTime(now.getTime())}`);
  pdf.setAuthor('Children of Mathare Germany');
  pdf.setSubject('Ausgaben, Rechnungen und Zahlungsnachweise von Children of Mathare Kenya');
  pdf.setKeywords([BACKUP_FORMAT, 'Children of Mathare']);
  pdf.setCreator('Children of Finances');
  pdf.setProducer('Children of Finances');
  pdf.setCreationDate(now);
  pdf.setModificationDate(now);

  const totalImages = entries.reduce((n, e) => n + (e.d.receipts?.length || 0) + (e.d.transfers?.length || 0), 0);
  let loaded = 0;
  onProgress(0, totalImages);

  const records = [];
  const total = entries.length;

  for (const [index, e] of entries.entries()) {
    const income = e.kind === 'income';
    const infoPage = pdf.addPage(A4);
    const record = {
      id: e.id,
      kind: e.kind,
      status: e.status,
      createdAt: new Date(e.createdAt).toISOString(),
      updatedAt: e.updatedAt ? new Date(e.updatedAt).toISOString() : null,
      createdBy: e.d.createdBy || '',
      editedBy: e.d.editedBy || '',
      infoPage: pdf.getPageCount() - 1,
      ...(income
        ? { from: e.d.from || '', date: e.d.date || '', amount: parseAmount(e.d.amount) }
        : {
          what: e.d.what || '', payDate: e.d.payDate || '', amount: parseAmount(e.d.amount), note: e.d.note || '',
          receipts: [], transfers: [], missingImages: [],
        }),
    };

    if (!income) {
      for (const [field, label] of [['receipts', 'Rechnung'], ['transfers', 'Transaktionsnachweis']]) {
        const ids = e.d[field] || [];
        for (const [i, id] of ids.entries()) {
          let bytes = null;
          try {
            bytes = await images.getBytes(id);
          } catch (err) {
            console.warn('Bild nicht verfügbar', id, err);
          }
          onProgress(++loaded, totalImages);
          if (!bytes) {
            record.missingImages.push(id);
            continue;
          }
          const image = await pdf.embedJpg(bytes);
          const page = pdf.addPage(A4);
          const [w, hgt] = A4;
          page.drawText(pdfSafe(`Eintrag ${index + 1} von ${total} – ${label}, Bild ${i + 1} von ${ids.length}`),
            { x: MARGIN, y: hgt - 45, size: 12, font: bold, color: colors.text });
          page.drawText(pdfSafe(`${(e.d.what || '').slice(0, 90)} · ${fmtDate(e.d.payDate)} · ${fmtKsh(e.d.amount)}`),
            { x: MARGIN, y: hgt - 62, size: 9, font, color: colors.muted });
          const boxW = w - 2 * 30;
          const boxH = hgt - 80 - 45;
          const scale = Math.min(boxW / image.width, boxH / image.height);
          const iw = image.width * scale;
          const ih = image.height * scale;
          page.drawImage(image, { x: (w - iw) / 2, y: 45 + (boxH - ih) / 2, width: iw, height: ih });
          record[field].push({ id, page: pdf.getPageCount() - 1, sha256: await sha256Hex(bytes) });
        }
      }
    }

    drawInfoPage(infoPage, e, record, index, total, { font, bold, colors, now });
    records.push(record);
  }

  const pages = pdf.getPages();
  pages.forEach((page, i) => {
    page.drawText(`Children of Finances · Seite ${i + 1} von ${pages.length}`, {
      x: MARGIN, y: 22, size: 8, font, color: colors.muted,
    });
  });

  const data = {
    format: BACKUP_FORMAT,
    version: 1,
    exportedAt: now.toISOString(),
    entryCount: records.length,
    note: 'Bilder sind nicht doppelt enthalten: Sie stehen als JPEG auf den angegebenen Seiten (Index ab 0).',
    entries: records,
  };
  await pdf.attach(new TextEncoder().encode(JSON.stringify(data, null, 2)), ATTACHMENT_NAME, {
    mimeType: 'application/json',
    description: 'Maschinenlesbare Daten dieser Sicherung (Children of Finances)',
    creationDate: now,
    modificationDate: now,
  });

  const bytes = await pdf.save();
  const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  return { bytes, filename: `Children-of-Finances_Sicherung_${stamp}.pdf` };
}

function drawInfoPage(page, e, record, index, total, { font, bold, colors, now }) {
  const [w, hgt] = A4;
  const width = w - 2 * MARGIN;
  let y = hgt - 50;
  const income = e.kind === 'income';

  page.drawText('Children of Finances · Children of Mathare Kenya / Germany', { x: MARGIN, y, size: 9, font, color: colors.muted });
  const stamp = `Sicherung vom ${fmtDateTime(now.getTime())}`;
  page.drawText(stamp, { x: w - MARGIN - font.widthOfTextAtSize(stamp, 9), y, size: 9, font, color: colors.muted });
  y -= 34;
  page.drawText(pdfSafe(`Eintrag ${index + 1} von ${total} – ${income ? 'Geldeingang' : 'Ausgabe'}`), {
    x: MARGIN, y, size: 18, font: bold, color: colors.accent,
  });
  y -= 14;
  page.drawLine({ start: { x: MARGIN, y }, end: { x: w - MARGIN, y }, thickness: 1, color: colors.accent });
  y -= 26;

  if (e.status === 'approved') {
    const missing = missingFields(e);
    const text = `Ausnahmsweise durch den Schatzmeister genehmigt${missing.length ? ` – fehlende Angaben: ${missing.join(', ')}` : ''}.`;
    for (const line of wrap(text, bold, 11, width)) {
      page.drawText(line, { x: MARGIN, y, size: 11, font: bold, color: colors.red });
      y -= 15;
    }
    y -= 10;
  }

  const field = (label, value) => {
    page.drawText(pdfSafe(label), { x: MARGIN, y, size: 9, font: bold, color: colors.muted });
    y -= 15;
    for (const line of wrap(value || '–', font, 12, width)) {
      if (y < 60) return;
      page.drawText(line, { x: MARGIN, y, size: 12, font, color: colors.text });
      y -= 16;
    }
    y -= 10;
  };

  if (income) {
    field('Von wem wurde Geld erhalten?', e.d.from);
    field('An welchem Tag wurde das Geld erhalten?', fmtDate(e.d.date));
    field('Betrag', fmtKsh(e.d.amount));
  } else {
    const r = record.receipts.length;
    const tr = record.transfers.length;
    field('Was wurde bezahlt?', e.d.what);
    field('An welchem Tag wurde das bezahlt?', fmtDate(e.d.payDate));
    field('Betrag', fmtKsh(e.d.amount));
    field('Rechnung', r ? `${r} Bild${r > 1 ? 'er' : ''} (${pageRange(record.receipts)})` : 'keine');
    field('Transaktionsnachweis (z. B. M-PESA)', tr ? `${tr} Bild${tr > 1 ? 'er' : ''} (${pageRange(record.transfers)})` : 'keiner');
    if (record.missingImages.length) field('Hinweis', `${record.missingImages.length} Bild(er) waren beim Export nicht abrufbar.`);
    field('Eigener Hinweis zu dieser Zahlung', e.d.note);
  }
  field('Eingetragen von', e.d.createdBy);
  if (e.d.editedBy && e.d.editedBy !== e.d.createdBy) field('Zuletzt bearbeitet von', e.d.editedBy);
  field('Eintragung begonnen am', fmtDateTime(e.createdAt));
  if (e.updatedAt) field('Zuletzt gespeichert am', fmtDateTime(e.updatedAt));
  field('Status', e.status === 'approved' ? 'ausnahmsweise genehmigt' : 'vollständig');
  field('Eintrag-ID', e.id);
}
