import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

export interface ExpenseRecord {
  id: string;
  amount: number;
  category: string;
  text: string;
  date: Date;
}

// Logic directly extracted from getExpenseStats.ts for unit verification
export function calculateExpenseStats(records: ExpenseRecord[], referenceDate = new Date('2026-09-25T12:00:00Z')) {
  if (records.length === 0) {
    return {
      totalExpenses: 0,
      thisMonthExpenses: 0,
      lastMonthExpenses: 0,
      monthlyChangePercentage: 0,
      transactionCount: 0,
      averageExpense: 0,
      topCategory: null,
      categoryBreakdown: [],
      monthlyTrend: [],
    };
  }

  const currentYear = referenceDate.getFullYear();
  const currentMonth = referenceDate.getMonth();

  const startOfThisMonth = new Date(Date.UTC(currentYear, currentMonth, 1));
  const startOfLastMonth = new Date(Date.UTC(currentYear, currentMonth - 1, 1));
  const endOfLastMonth = new Date(Date.UTC(currentYear, currentMonth, 0, 23, 59, 59, 999));

  let totalExpenses = 0;
  let thisMonthExpenses = 0;
  let lastMonthExpenses = 0;
  const categoryTotals: Record<string, { amount: number; count: number }> = {};

  const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short' });
  const monthlyMap = new Map<string, number>();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(Date.UTC(currentYear, currentMonth - i, 1));
    const key = `${monthFormatter.format(d)} ${d.getFullYear().toString().slice(-2)}`;
    monthlyMap.set(key, 0);
  }

  for (const record of records) {
    const amount = record.amount;
    const recDate = new Date(record.date);

    totalExpenses += amount;

    if (recDate >= startOfThisMonth) {
      thisMonthExpenses += amount;
    } else if (recDate >= startOfLastMonth && recDate <= endOfLastMonth) {
      lastMonthExpenses += amount;
    }

    const cat = record.category || 'Other';
    if (!categoryTotals[cat]) {
      categoryTotals[cat] = { amount: 0, count: 0 };
    }
    categoryTotals[cat].amount += amount;
    categoryTotals[cat].count += 1;

    const monthKey = `${monthFormatter.format(recDate)} ${recDate.getFullYear().toString().slice(-2)}`;
    if (monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + amount);
    }
  }

  let monthlyChangePercentage = 0;
  if (lastMonthExpenses > 0) {
    monthlyChangePercentage = Math.round(((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100);
  } else if (thisMonthExpenses > 0) {
    monthlyChangePercentage = 100;
  }

  const categoryBreakdown = Object.entries(categoryTotals)
    .map(([category, { amount, count }]) => ({
      category,
      amount: Math.round(amount * 100) / 100,
      percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
      count,
    }))
    .sort((a, b) => b.amount - a.amount);

  const topCategory = categoryBreakdown.length > 0 ? {
    category: categoryBreakdown[0].category,
    amount: categoryBreakdown[0].amount,
  } : null;

  const monthlyTrend = Array.from(monthlyMap.entries()).map(([month, amount]) => ({
    month,
    amount: Math.round(amount * 100) / 100,
  }));

  return {
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    thisMonthExpenses: Math.round(thisMonthExpenses * 100) / 100,
    lastMonthExpenses: Math.round(lastMonthExpenses * 100) / 100,
    monthlyChangePercentage,
    transactionCount: records.length,
    averageExpense: records.length > 0 ? Math.round((totalExpenses / records.length) * 100) / 100 : 0,
    topCategory,
    categoryBreakdown,
    monthlyTrend,
  };
}

describe('Financial Analytics & Stats Calculation Tests', () => {
  it('should return empty stats structure when no records exist', () => {
    const stats = calculateExpenseStats([]);
    assert.equal(stats.totalExpenses, 0);
    assert.equal(stats.transactionCount, 0);
    assert.equal(stats.averageExpense, 0);
    assert.equal(stats.topCategory, null);
    assert.equal(stats.categoryBreakdown.length, 0);
    assert.equal(stats.monthlyTrend.length, 0);
  });

  it('should accurately calculate total expenses and average', () => {
    const mockRecords: ExpenseRecord[] = [
      { id: '1', amount: 50.00, category: 'Food', text: 'Lunch', date: new Date('2026-09-10T12:00:00Z') },
      { id: '2', amount: 25.50, category: 'Transportation', text: 'Uber', date: new Date('2026-09-12T12:00:00Z') },
      { id: '3', amount: 124.50, category: 'Bills', text: 'Internet', date: new Date('2026-09-15T12:00:00Z') },
    ];

    const stats = calculateExpenseStats(mockRecords, new Date('2026-09-25T12:00:00Z'));
    assert.equal(stats.totalExpenses, 200.00);
    assert.equal(stats.transactionCount, 3);
    assert.equal(stats.averageExpense, 66.67);
  });

  it('should categorize expenses and identify top category correctly sorted descending', () => {
    const mockRecords: ExpenseRecord[] = [
      { id: '1', amount: 50, category: 'Food', text: 'Lunch', date: new Date('2026-09-10T12:00:00Z') },
      { id: '2', amount: 300, category: 'Bills', text: 'Rent portion', date: new Date('2026-09-12T12:00:00Z') },
      { id: '3', amount: 150, category: 'Food', text: 'Groceries', date: new Date('2026-09-15T12:00:00Z') },
      { id: '4', amount: 100, category: 'Entertainment', text: 'Concert', date: new Date('2026-09-16T12:00:00Z') },
    ];

    // Total: 600. Bills: 300 (50%), Food: 200 (33%), Entertainment: 100 (17%)
    const stats = calculateExpenseStats(mockRecords, new Date('2026-09-25T12:00:00Z'));
    assert.equal(stats.topCategory?.category, 'Bills');
    assert.equal(stats.topCategory?.amount, 300);

    assert.equal(stats.categoryBreakdown.length, 3);
    assert.equal(stats.categoryBreakdown[0].category, 'Bills');
    assert.equal(stats.categoryBreakdown[0].percentage, 50);
    assert.equal(stats.categoryBreakdown[0].count, 1);

    assert.equal(stats.categoryBreakdown[1].category, 'Food');
    assert.equal(stats.categoryBreakdown[1].amount, 200);
    assert.equal(stats.categoryBreakdown[1].percentage, 33);
    assert.equal(stats.categoryBreakdown[1].count, 2);

    assert.equal(stats.categoryBreakdown[2].category, 'Entertainment');
    assert.equal(stats.categoryBreakdown[2].amount, 100);
    assert.equal(stats.categoryBreakdown[2].percentage, 17);
  });

  it('should calculate month-over-month increase percentage', () => {
    // Current date: Sept 2026.
    // Last month (August 2026): 200
    // This month (September 2026): 300
    // Change: +50%
    const mockRecords: ExpenseRecord[] = [
      { id: '1', amount: 200, category: 'Bills', text: 'Aug electric', date: new Date('2026-08-15T12:00:00Z') },
      { id: '2', amount: 300, category: 'Bills', text: 'Sep electric', date: new Date('2026-09-10T12:00:00Z') },
    ];

    const stats = calculateExpenseStats(mockRecords, new Date('2026-09-25T12:00:00Z'));
    assert.equal(stats.lastMonthExpenses, 200);
    assert.equal(stats.thisMonthExpenses, 300);
    assert.equal(stats.monthlyChangePercentage, 50);
  });

  it('should calculate month-over-month decrease percentage', () => {
    // Last month: 400. This month: 200. Change: -50%
    const mockRecords: ExpenseRecord[] = [
      { id: '1', amount: 400, category: 'Bills', text: 'Aug rent', date: new Date('2026-08-15T12:00:00Z') },
      { id: '2', amount: 200, category: 'Bills', text: 'Sep rent', date: new Date('2026-09-10T12:00:00Z') },
    ];

    const stats = calculateExpenseStats(mockRecords, new Date('2026-09-25T12:00:00Z'));
    assert.equal(stats.monthlyChangePercentage, -50);
  });

  it('should set 100% when last month was 0 and this month has expenses', () => {
    const mockRecords: ExpenseRecord[] = [
      { id: '1', amount: 150, category: 'Food', text: 'First month', date: new Date('2026-09-10T12:00:00Z') },
    ];

    const stats = calculateExpenseStats(mockRecords, new Date('2026-09-25T12:00:00Z'));
    assert.equal(stats.lastMonthExpenses, 0);
    assert.equal(stats.thisMonthExpenses, 150);
    assert.equal(stats.monthlyChangePercentage, 100);
  });

  it('should populate 6 monthly trend buckets', () => {
    const mockRecords: ExpenseRecord[] = [
      { id: '1', amount: 100, category: 'Food', text: 'Dinner', date: new Date('2026-09-05T12:00:00Z') },
      { id: '2', amount: 50, category: 'Shopping', text: 'Book', date: new Date('2026-08-12T12:00:00Z') },
    ];

    const stats = calculateExpenseStats(mockRecords, new Date('2026-09-25T12:00:00Z'));
    assert.equal(stats.monthlyTrend.length, 6);
    const lastBucket = stats.monthlyTrend[stats.monthlyTrend.length - 1];
    assert.equal(lastBucket.amount, 100);
  });
});
