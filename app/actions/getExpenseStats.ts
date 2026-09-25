'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { checkUser } from '@/lib/checkUser';

export interface CategorySummary {
  category: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface MonthlyTrendItem {
  month: string;
  amount: number;
}

export interface ExpenseStatsData {
  totalExpenses: number;
  thisMonthExpenses: number;
  lastMonthExpenses: number;
  monthlyChangePercentage: number;
  transactionCount: number;
  averageExpense: number;
  topCategory: { category: string; amount: number } | null;
  categoryBreakdown: CategorySummary[];
  monthlyTrend: MonthlyTrendItem[];
}

interface GetStatsResult {
  stats?: ExpenseStatsData;
  error?: string;
}

export async function getExpenseStats(): Promise<GetStatsResult> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: 'Unauthorized: User not signed in' };
    }

    await checkUser();

    const records = await db.record.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });

    if (records.length === 0) {
      return {
        stats: {
          totalExpenses: 0,
          thisMonthExpenses: 0,
          lastMonthExpenses: 0,
          monthlyChangePercentage: 0,
          transactionCount: 0,
          averageExpense: 0,
          topCategory: null,
          categoryBreakdown: [],
          monthlyTrend: [],
        },
      };
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const startOfThisMonth = new Date(Date.UTC(currentYear, currentMonth, 1));
    const startOfLastMonth = new Date(Date.UTC(currentYear, currentMonth - 1, 1));
    const endOfLastMonth = new Date(Date.UTC(currentYear, currentMonth, 0, 23, 59, 59, 999));

    let totalExpenses = 0;
    let thisMonthExpenses = 0;
    let lastMonthExpenses = 0;
    const categoryTotals: Record<string, { amount: number; count: number }> = {};

    // Grouping by month for trend
    const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short' });
    const monthlyMap = new Map<string, number>();

    // Initialize last 6 months in monthlyMap
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1);
      const key = `${monthFormatter.format(d)} ${d.getFullYear().toString().slice(-2)}`;
      monthlyMap.set(key, 0);
    }

    for (const record of records) {
      const amount = record.amount;
      const recDate = new Date(record.date);

      totalExpenses += amount;

      // Month stats
      if (recDate >= startOfThisMonth) {
        thisMonthExpenses += amount;
      } else if (recDate >= startOfLastMonth && recDate <= endOfLastMonth) {
        lastMonthExpenses += amount;
      }

      // Category breakdown
      const cat = record.category || 'Other';
      if (!categoryTotals[cat]) {
        categoryTotals[cat] = { amount: 0, count: 0 };
      }
      categoryTotals[cat].amount += amount;
      categoryTotals[cat].count += 1;

      // Trend mapping
      const monthKey = `${monthFormatter.format(recDate)} ${recDate.getFullYear().toString().slice(-2)}`;
      if (monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + amount);
      }
    }

    // Monthly change calculation
    let monthlyChangePercentage = 0;
    if (lastMonthExpenses > 0) {
      monthlyChangePercentage = Math.round(((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100);
    } else if (thisMonthExpenses > 0) {
      monthlyChangePercentage = 100;
    }

    // Category breakdown array sorted descending
    const categoryBreakdown: CategorySummary[] = Object.entries(categoryTotals)
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

    const monthlyTrend: MonthlyTrendItem[] = Array.from(monthlyMap.entries()).map(([month, amount]) => ({
      month,
      amount: Math.round(amount * 100) / 100,
    }));

    return {
      stats: {
        totalExpenses: Math.round(totalExpenses * 100) / 100,
        thisMonthExpenses: Math.round(thisMonthExpenses * 100) / 100,
        lastMonthExpenses: Math.round(lastMonthExpenses * 100) / 100,
        monthlyChangePercentage,
        transactionCount: records.length,
        averageExpense: records.length > 0 ? Math.round((totalExpenses / records.length) * 100) / 100 : 0,
        topCategory,
        categoryBreakdown,
        monthlyTrend,
      },
    };
  } catch (error) {
    console.error('Error generating expense stats:', error);
    return { error: 'Failed to calculate expense analytics' };
  }
}
