// Zeiträume: Ein Zeitraum beginnt am Tag eines Geldeingangs und endet mit dem nächsten Geldeingang.
// Das "Ledger" bewahrt nach dem Löschen gesicherter Einträge die Geldeingänge und die bereits
// gesicherten Ausgabensummen auf, damit die Restbeträge des Schatzmeisters stimmen.
import { parseAmount } from './util.js';

export const SAVED = ['complete', 'approved'];

export function emptyLedger() {
  return { v: 1, incomes: [], spent: { pre: 0 } };
}

function liveIncomes(entries) {
  return entries
    .filter((e) => e.kind === 'income' && SAVED.includes(e.status) && e.d.date)
    .map((e) => ({
      id: e.id, date: e.d.date, from: e.d.from, amount: parseAmount(e.d.amount), createdAt: e.createdAt, archived: false, entry: e,
    }));
}

export function computePeriods(entries, ledger) {
  const live = liveIncomes(entries);
  const liveIds = new Set(live.map((i) => i.id));
  const incomes = [
    ...ledger.incomes.filter((i) => !liveIds.has(i.id)).map((i) => ({ ...i, archived: true })),
    ...live,
  ].sort((a, b) => a.date.localeCompare(b.date) || (a.createdAt || 0) - (b.createdAt || 0));

  const periods = incomes.map((income, i) => ({
    key: income.id,
    income,
    start: income.date,
    end: incomes[i + 1]?.date || null,
    spent: ledger.spent[income.id] || 0,
    expenses: [],
  }));
  const pre = { key: 'pre', income: null, start: null, end: incomes[0]?.date || null, spent: ledger.spent.pre || 0, expenses: [] };

  for (const e of entries) {
    if (e.kind !== 'expense') continue;
    const period = periodFor(periods, pre, e.d.payDate);
    period.expenses.push(e);
    if (e.d.payDate || SAVED.includes(e.status)) period.spent += parseAmount(e.d.amount);
  }
  for (const p of periods) p.remaining = p.income.amount - p.spent;
  return { pre, periods };
}

export function periodFor(periods, pre, isoDate) {
  if (!isoDate) return periods[periods.length - 1] || pre;
  let found = pre;
  for (const p of periods) if (p.start <= isoDate) found = p;
  return found;
}

// Neues Ledger nach dem Löschen der Einträge mit den IDs `archivedIds`.
export function ledgerAfterArchive(entries, ledger, archivedIds) {
  const ids = new Set(archivedIds);
  const next = { v: 1, incomes: [...ledger.incomes], spent: { ...ledger.spent } };
  const { pre, periods } = computePeriods(entries, ledger);
  for (const p of [pre, ...periods]) {
    const sum = p.expenses
      .filter((e) => ids.has(e.id) && (e.d.payDate || SAVED.includes(e.status)))
      .reduce((acc, e) => acc + parseAmount(e.d.amount), 0);
    if (sum) next.spent[p.key] = (next.spent[p.key] || 0) + sum;
    if (p.income && !p.income.archived && ids.has(p.income.id)) {
      const { id, date, from, amount, createdAt } = p.income;
      next.incomes.push({ id, date, from, amount, createdAt, verified: p.income.entry?.status === 'approved' });
    }
  }
  return next;
}

// Neues Ledger, wenn der Schatzmeister den Geldeingang `incomeId` löscht – oder null, wenn sich nichts ändert.
// Waren ihm schon gesicherte Ausgaben zugeordnet, gehen deren Summen an den Zeitraum, dem seine
// übrigen Ausgaben ab jetzt auch angehören (der vorherige Geldeingang, sonst „vor dem ersten“).
export function ledgerAfterIncomeRemoval(entries, ledger, incomeId) {
  const sum = ledger.spent[incomeId] || 0;
  if (!sum) return null;
  const income = entries.find((e) => e.id === incomeId);
  if (!income) return null;
  const { pre, periods } = computePeriods(entries.filter((e) => e.id !== incomeId), ledger);
  const target = periodFor(periods, pre, income.d.date);
  const spent = { ...ledger.spent };
  delete spent[incomeId];
  spent[target.key] = (spent[target.key] || 0) + sum;
  return { v: 1, incomes: [...ledger.incomes], spent };
}
