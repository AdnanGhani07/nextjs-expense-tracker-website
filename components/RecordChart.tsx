'use client';

import { useEffect, useState } from 'react';
import { getExpenseStats, ExpenseStatsData } from '@/app/actions/getExpenseStats';

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#10b981', // emerald-500
  Transportation: '#3b82f6', // blue-500
  Entertainment: '#8b5cf6', // purple-500
  Shopping: '#ec4899', // pink-500
  Bills: '#f59e0b', // amber-500
  Healthcare: '#ef4444', // red-500
  Other: '#6b7280', // gray-500
};

export default function RecordChart() {
  const [stats, setStats] = useState<ExpenseStatsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'categories' | 'trend'>('categories');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getExpenseStats();
        if (res.stats) {
          setStats(res.stats);
        }
      } catch (err) {
        console.error('Error fetching chart stats:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 h-72 animate-pulse flex flex-col justify-between'>
        <div className='w-40 h-4 bg-gray-200 dark:bg-gray-700 rounded'></div>
        <div className='w-48 h-48 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full'></div>
      </div>
    );
  }

  const breakdown = stats?.categoryBreakdown || [];
  const trend = stats?.monthlyTrend || [];
  const maxTrendAmount = Math.max(...trend.map((t) => t.amount), 1);

  // SVG Donut chart calculation
  let cumulativePercent = 0;
  const donutSegments = breakdown.map((item) => {
    const startAngle = (cumulativePercent / 100) * 360;
    cumulativePercent += item.percentage;
    const endAngle = (cumulativePercent / 100) * 360;
    const color = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Other;
    return {
      ...item,
      color,
      startAngle,
      endAngle,
    };
  });

  return (
    <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300'>
      {/* Header & Tabs */}
      <div className='flex items-center justify-between gap-2 mb-6'>
        <div className='flex items-center gap-2.5'>
          <div className='w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg'>
            <span className='text-white text-sm sm:text-base'>📊</span>
          </div>
          <div>
            <h3 className='text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100'>
              Spending Analytics
            </h3>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              Visual distribution & trends
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className='flex p-1 bg-gray-100 dark:bg-gray-700/60 rounded-xl text-xs font-semibold'>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeTab === 'categories'
                ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('trend')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeTab === 'trend'
                ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {breakdown.length === 0 ? (
        <div className='py-12 text-center text-xs text-gray-500 dark:text-gray-400'>
          No expense data available to display charts.
        </div>
      ) : activeTab === 'categories' ? (
        /* Categories Breakdown View */
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 items-center'>
          {/* Donut Chart / Radial visualization */}
          <div className='relative flex items-center justify-center'>
            <svg viewBox='0 0 100 100' className='w-40 h-40 sm:w-44 sm:h-44 transform -rotate-90'>
              {donutSegments.map((seg, idx) => {
                const strokeDasharray = `${seg.percentage} ${100 - seg.percentage}`;
                const strokeDashoffset = -donutSegments
                  .slice(0, idx)
                  .reduce((acc, curr) => acc + curr.percentage, 0);

                return (
                  <circle
                    key={seg.category}
                    cx='50'
                    cy='50'
                    r='38'
                    fill='transparent'
                    stroke={seg.color}
                    strokeWidth={hoveredCategory === seg.category ? '18' : '14'}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className='transition-all duration-300 cursor-pointer'
                    onMouseEnter={() => setHoveredCategory(seg.category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  />
                );
              })}
            </svg>
            <div className='absolute flex flex-col items-center justify-center text-center pointer-events-none'>
              <span className='text-[10px] uppercase font-bold text-gray-400 tracking-wider'>
                {hoveredCategory || 'Total'}
              </span>
              <span className='text-sm sm:text-base font-black text-gray-800 dark:text-gray-100'>
                {hoveredCategory
                  ? `$${breakdown.find((b) => b.category === hoveredCategory)?.amount.toFixed(0)}`
                  : `$${stats?.totalExpenses.toFixed(0)}`}
              </span>
            </div>
          </div>

          {/* Category List with Bars */}
          <div className='space-y-2 max-h-48 overflow-y-auto pr-1'>
            {breakdown.map((item) => {
              const color = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Other;
              const isHovered = hoveredCategory === item.category;

              return (
                <div
                  key={item.category}
                  onMouseEnter={() => setHoveredCategory(item.category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    isHovered
                      ? 'bg-gray-100 dark:bg-gray-700/60 scale-[1.02]'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'
                  }`}
                >
                  <div className='flex items-center justify-between text-xs mb-1 font-semibold text-gray-700 dark:text-gray-200'>
                    <div className='flex items-center gap-2'>
                      <span
                        className='w-2.5 h-2.5 rounded-full flex-shrink-0'
                        style={{ backgroundColor: color }}
                      ></span>
                      <span className='truncate'>{item.category}</span>
                    </div>
                    <span>
                      ${item.amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}{' '}
                      <span className='text-gray-400 text-[11px] font-normal'>({item.percentage}%)</span>
                    </span>
                  </div>
                  <div className='w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden'>
                    <div
                      className='h-full rounded-full transition-all duration-500'
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: color,
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Monthly Spending Trend Bar Chart */
        <div className='space-y-4 pt-2'>
          <div className='h-40 flex items-end justify-between gap-2 sm:gap-4 px-2 pt-4 border-b border-gray-200 dark:border-gray-700'>
            {trend.map((item) => {
              const heightPercent = maxTrendAmount > 0 ? (item.amount / maxTrendAmount) * 100 : 0;
              return (
                <div
                  key={item.month}
                  className='flex-1 flex flex-col items-center h-full justify-end group'
                >
                  {/* Tooltip on hover */}
                  <div className='opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 px-1.5 py-0.5 rounded shadow mb-1 whitespace-nowrap'>
                    ${item.amount.toLocaleString()}
                  </div>
                  {/* Bar */}
                  <div
                    className='w-full max-w-[36px] bg-gradient-to-t from-emerald-600 to-teal-400 dark:from-emerald-500 dark:to-teal-300 rounded-t-lg transition-all duration-500 group-hover:brightness-110 min-h-[4px]'
                    style={{ height: `${Math.max(heightPercent, 4)}%` }}
                  ></div>
                </div>
              );
            })}
          </div>
          {/* Month Labels */}
          <div className='flex justify-between gap-2 px-2 text-[11px] font-semibold text-gray-500 dark:text-gray-400'>
            {trend.map((item) => (
              <div key={item.month} className='flex-1 text-center truncate'>
                {item.month}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}