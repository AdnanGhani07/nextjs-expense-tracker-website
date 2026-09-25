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

  if (isLoading) {
    return (
      <div className='grid grid-cols-2 gap-3 sm:gap-4'>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-100/50 dark:border-gray-700/50 animate-pulse h-28 flex flex-col justify-between'
          >
            <div className='w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded'></div>
            <div className='w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded'></div>
            <div className='w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded'></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-gray-100/50 dark:border-gray-700/50 text-center'>
        <p className='text-xs text-red-500 mb-2'>{error || 'No stats available'}</p>
        <button
          onClick={loadStats}
          className='text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg'
        >
          Retry
        </button>
      </div>
    );
  }

  const formatCurrency = (val: number) => {
    return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className='space-y-3 sm:space-y-4'>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
        {/* Total Spending Card */}
        <div className='relative overflow-hidden bg-gradient-to-br from-white/90 to-emerald-50/40 dark:from-gray-800/90 dark:to-emerald-950/20 backdrop-blur-sm p-4 sm:p-5 rounded-2xl shadow-xl border border-gray-100/60 dark:border-gray-700/60 hover:shadow-2xl transition-all duration-300 group'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'>
              Total Spending
            </span>
            <div className='w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm shadow-sm'>
              💵
            </div>
          </div>
          <div className='text-xl sm:text-2xl font-black text-gray-900 dark:text-gray-100'>
            {formatCurrency(stats.totalExpenses)}
          </div>
          <div className='mt-2 flex items-center text-[11px] text-gray-500 dark:text-gray-400'>
            <span className='font-semibold text-emerald-600 dark:text-emerald-400 mr-1'>
              {stats.transactionCount}
            </span>
            total recorded transactions
          </div>
          <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-60'></div>
        </div>

        {/* This Month Spending Card */}
        <div className='relative overflow-hidden bg-gradient-to-br from-white/90 to-blue-50/40 dark:from-gray-800/90 dark:to-blue-950/20 backdrop-blur-sm p-4 sm:p-5 rounded-2xl shadow-xl border border-gray-100/60 dark:border-gray-700/60 hover:shadow-2xl transition-all duration-300 group'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'>
              This Month
            </span>
            <div className='w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm shadow-sm'>
              📅
            </div>
          </div>
          <div className='text-xl sm:text-2xl font-black text-gray-900 dark:text-gray-100'>
            {formatCurrency(stats.thisMonthExpenses)}
          </div>
          <div className='mt-2 flex items-center text-[11px]'>
            {stats.monthlyChangePercentage !== 0 ? (
              <span
                className={`inline-flex items-center font-bold px-1.5 py-0.5 rounded-md text-[10px] mr-1.5 ${
                  stats.monthlyChangePercentage > 0
                    ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
                    : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                }`}
              >
                {stats.monthlyChangePercentage > 0 ? '↑' : '↓'} {Math.abs(stats.monthlyChangePercentage)}%
              </span>
            ) : null}
            <span className='text-gray-500 dark:text-gray-400 text-[11px]'>
              vs last month ({formatCurrency(stats.lastMonthExpenses)})
            </span>
          </div>
          <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-60'></div>
        </div>

        {/* Top Expense Category */}
        <div className='relative overflow-hidden bg-gradient-to-br from-white/90 to-purple-50/40 dark:from-gray-800/90 dark:to-purple-950/20 backdrop-blur-sm p-4 sm:p-5 rounded-2xl shadow-xl border border-gray-100/60 dark:border-gray-700/60 hover:shadow-2xl transition-all duration-300 group'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'>
              Top Category
            </span>
            <div className='w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm shadow-sm'>
              🏷️
            </div>
          </div>
          <div className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 truncate'>
            {stats.topCategory ? stats.topCategory.category : 'None'}
          </div>
          <div className='mt-2 flex items-center text-[11px] text-gray-500 dark:text-gray-400'>
            {stats.topCategory ? (
              <span>
                <strong className='text-purple-600 dark:text-purple-400'>
                  {formatCurrency(stats.topCategory.amount)}
                </strong>{' '}
                spent
              </span>
            ) : (
              'No category data yet'
            )}
          </div>
          <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-60'></div>
        </div>

        {/* Average Transaction */}
        <div className='relative overflow-hidden bg-gradient-to-br from-white/90 to-teal-50/40 dark:from-gray-800/90 dark:to-teal-950/20 backdrop-blur-sm p-4 sm:p-5 rounded-2xl shadow-xl border border-gray-100/60 dark:border-gray-700/60 hover:shadow-2xl transition-all duration-300 group'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'>
              Avg. Per Expense
            </span>
            <div className='w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 flex items-center justify-center text-sm shadow-sm'>
              ⚡
            </div>
          </div>
          <div className='text-xl sm:text-2xl font-black text-gray-900 dark:text-gray-100'>
            {formatCurrency(stats.averageExpense)}
          </div>
          <div className='mt-2 flex items-center text-[11px] text-gray-500 dark:text-gray-400'>
            Across all logged receipts
          </div>
          <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 opacity-60'></div>
        </div>
      </div>
    </div>
  );
}