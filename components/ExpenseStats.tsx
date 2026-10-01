'use client';

import { useEffect, useState } from 'react';
import { getExpenseStats, ExpenseStatsData } from '@/app/actions/getExpenseStats';

export default function ExpenseStats() {
  const [stats, setStats] = useState<ExpenseStatsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getExpenseStats();
      if (res.error) {
        setError(res.error);
      } else if (res.stats) {
        setStats(res.stats);
      }
    } catch {
      setError('Failed to compute statistics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const formatCurrency = (val: number) => {
    return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (isLoading) {
    return (
      <div className='grid grid-cols-2 gap-4'>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className='glass-card rounded-3xl p-5 animate-pulse h-32 flex flex-col justify-between'
          >
            <div className='w-20 h-3 bg-slate-200 dark:bg-slate-800 rounded' />
            <div className='w-28 h-7 bg-slate-200 dark:bg-slate-800 rounded' />
            <div className='w-24 h-2 bg-slate-200 dark:bg-slate-800 rounded' />
          </div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className='glass-card rounded-3xl p-6 text-center space-y-3'>
        <p className='text-xs text-rose-500 font-medium'>{error || 'No statistics available'}</p>
        <button
          onClick={loadStats}
          className='text-xs bg-brand-500 hover:bg-brand-600 text-slate-950 font-bold px-4 py-2 rounded-xl transition-all'
        >
          Refresh Analytics
        </button>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
      
      {/* 1. Total Spending Card */}
      <div className='glass-card rounded-3xl p-5 relative overflow-hidden group hover:shadow-glow-sm transition-all duration-300'>
        <div className='flex items-center justify-between mb-3'>
          <span className='text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500'>
            Total Expenditure
          </span>
          <div className='w-8 h-8 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center text-sm shadow-sm'>
            💵
          </div>
        </div>
        <div className='text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight tabular-nums'>
          {formatCurrency(stats.totalExpenses)}
        </div>
        <div className='mt-3 flex items-center text-xs text-slate-500 dark:text-slate-400'>
          <span className='font-mono font-bold text-brand-600 dark:text-brand-400 mr-1.5'>
            {stats.transactionCount}
          </span>
          <span>total recorded receipts</span>
        </div>
        <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-teal-500 opacity-80' />
      </div>

      {/* 2. Monthly Trajectory Card */}
      <div className='glass-card rounded-3xl p-5 relative overflow-hidden group hover:shadow-glow-cyan transition-all duration-300'>
        <div className='flex items-center justify-between mb-3'>
          <span className='text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500'>
            This Month
          </span>
          <div className='w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center text-sm shadow-sm'>
            📅
          </div>
        </div>
        <div className='text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight tabular-nums'>
          {formatCurrency(stats.thisMonthExpenses)}
        </div>
        <div className='mt-3 flex items-center text-xs'>
          {stats.monthlyChangePercentage !== 0 ? (
            <span
              className={`inline-flex items-center font-mono font-bold px-2 py-0.5 rounded-lg text-[10px] mr-2 ${
                stats.monthlyChangePercentage > 0
                  ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
                  : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900'
              }`}
            >
              {stats.monthlyChangePercentage > 0 ? '▲ +' : '▼ '}
              {stats.monthlyChangePercentage}%
            </span>
          ) : null}
          <span className='text-slate-400 dark:text-slate-500 text-[11px] truncate'>
            vs last mo ({formatCurrency(stats.lastMonthExpenses)})
          </span>
        </div>
        <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-80' />
      </div>

      {/* 3. Top Spending Category */}
      <div className='glass-card rounded-3xl p-5 relative overflow-hidden group hover:shadow-glow-indigo transition-all duration-300'>
        <div className='flex items-center justify-between mb-3'>
          <span className='text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500'>
            Top Expense Category
          </span>
          <div className='w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm shadow-sm'>
            🏷️
          </div>
        </div>
        <div className='text-xl sm:text-2xl font-bold text-slate-900 dark:text-white truncate'>
          {stats.topCategory ? stats.topCategory.category : 'None'}
        </div>
        <div className='mt-3 text-xs text-slate-500 dark:text-slate-400'>
          {stats.topCategory ? (
            <span>
              <strong className='font-mono text-purple-600 dark:text-purple-400 font-bold'>
                {formatCurrency(stats.topCategory.amount)}
              </strong>{' '}
              cumulative spend
            </span>
          ) : (
            'Awaiting first transaction'
          )}
        </div>
        <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-80' />
      </div>

      {/* 4. Average Per Transaction */}
      <div className='glass-card rounded-3xl p-5 relative overflow-hidden group hover:shadow-glow-sm transition-all duration-300'>
        <div className='flex items-center justify-between mb-3'>
          <span className='text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500'>
            Mean Transaction
          </span>
          <div className='w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-sm shadow-sm'>
            ⚡
          </div>
        </div>
        <div className='text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight tabular-nums'>
          {formatCurrency(stats.averageExpense)}
        </div>
        <div className='mt-3 text-xs text-slate-500 dark:text-slate-400'>
          Average across all logged records
        </div>
        <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-brand-500 opacity-80' />
      </div>
    </div>
  );
}