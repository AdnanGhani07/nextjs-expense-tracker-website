'use client';

import { useEffect, useState } from 'react';
import { getExpenseStats, ExpenseStatsData } from '@/app/actions/getExpenseStats';

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#10B981',           // Emerald
  Transportation: '#06B6D4', // Cyan
  Bills: '#F43F5E',          // Rose
  Shopping: '#8B5CF6',       // Purple
  Entertainment: '#EC4899',  // Pink
  Healthcare: '#3B82F6',     // Blue
  Other: '#64748B',          // Slate
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
      <div className='glass-card rounded-3xl p-6 h-80 animate-pulse flex flex-col justify-between'>
        <div className='w-40 h-4 bg-slate-200 dark:bg-slate-800 rounded' />
        <div className='w-44 h-44 mx-auto bg-slate-200 dark:bg-slate-800 rounded-full' />
        <div className='w-32 h-3 bg-slate-200 dark:bg-slate-800 rounded mx-auto' />
      </div>
    );
  }

  const breakdown = stats?.categoryBreakdown || [];
  const trend = stats?.monthlyTrend || [];
  const maxTrendAmount = Math.max(...trend.map((t) => t.amount), 1);

  // SVG Donut calculation
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

  const getCoordinatesForAngle = (angle: number, radius: number) => {
    const rad = ((angle - 90) * Math.PI) / 180.0;
    return {
      x: 100 + radius * Math.cos(rad),
      y: 100 + radius * Math.sin(rad),
    };
  };

  const activeCategoryData = hoveredCategory
    ? breakdown.find((b) => b.category === hoveredCategory)
    : null;

  return (
    <div className='glass-card rounded-3xl p-6 sm:p-7 space-y-6 relative overflow-hidden transition-all duration-300'>
      
      {/* Header & View Switcher */}
      <div className='flex items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-white/5'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-brand-500 flex items-center justify-center shadow-glow-cyan'>
            <span className='text-lg'>📊</span>
          </div>
          <div>
            <h2 className='text-lg font-bold text-slate-900 dark:text-white leading-tight'>
              Visual Analytics
            </h2>
            <p className='text-xs text-slate-500 dark:text-slate-400'>
              Real-time portfolio distribution
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className='flex p-1 bg-slate-100 dark:bg-obsidian-900 rounded-2xl border border-slate-200/80 dark:border-white/5 text-xs font-semibold'>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'categories'
                ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Category Share
          </button>
          <button
            onClick={() => setActiveTab('trend')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'trend'
                ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            6-Mo Trend
          </button>
        </div>
      </div>

      {/* Categories Donut View */}
      {activeTab === 'categories' && (
        <div className='space-y-6'>
          {breakdown.length === 0 ? (
            <div className='py-12 text-center text-xs text-slate-400'>
              No expenses recorded yet. Log your first expense above!
            </div>
          ) : (
            <div className='flex flex-col sm:flex-row items-center justify-between gap-6'>
              
              {/* Circular SVG Donut */}
              <div className='relative w-48 h-48 flex-shrink-0'>
                <svg viewBox='0 0 200 200' className='w-full h-full transform -rotate-90'>
                  {donutSegments.map((segment) => {
                    const isHovered = hoveredCategory === segment.category;
                    const radius = isHovered ? 82 : 80;
                    const innerRadius = 55;
                    const largeArcFlag = segment.endAngle - segment.startAngle > 180 ? 1 : 0;

                    const p1 = getCoordinatesForAngle(segment.startAngle, radius);
                    const p2 = getCoordinatesForAngle(segment.endAngle, radius);
                    const p3 = getCoordinatesForAngle(segment.endAngle, innerRadius);
                    const p4 = getCoordinatesForAngle(segment.startAngle, innerRadius);

                    const d = `M ${p1.x} ${p1.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${p4.x} ${p4.y} Z`;

                    return (
                      <path
                        key={segment.category}
                        d={d}
                        fill={segment.color}
                        className='transition-all duration-300 cursor-pointer opacity-90 hover:opacity-100'
                        onMouseEnter={() => setHoveredCategory(segment.category)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      />
                    );
                  })}
                </svg>

                {/* Center Hole Readout */}
                <div className='absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none'>
                  {activeCategoryData ? (
                    <div className='animate-in fade-in zoom-in-95 duration-150'>
                      <span className='text-[10px] font-mono uppercase text-slate-400 block font-semibold'>
                        {activeCategoryData.category}
                      </span>
                      <span className='text-base font-bold font-mono text-slate-900 dark:text-white tabular-nums block'>
                        ${activeCategoryData.amount.toFixed(0)}
                      </span>
                      <span className='text-[10px] font-mono font-bold text-brand-500 block'>
                        {activeCategoryData.percentage}%
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className='text-[10px] font-mono uppercase text-slate-400 block font-semibold'>
                        Total Volume
                      </span>
                      <span className='text-lg font-extrabold font-mono text-slate-900 dark:text-white tabular-nums block'>
                        ${stats?.totalExpenses.toFixed(0) || 0}
                      </span>
                      <span className='text-[10px] text-slate-400 block'>
                        {stats?.transactionCount || 0} items
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Legend List */}
              <div className='flex-1 w-full space-y-2 max-h-52 overflow-y-auto pr-1'>
                {breakdown.map((item) => {
                  const isHovered = hoveredCategory === item.category;
                  const color = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Other;
                  return (
                    <div
                      key={item.category}
                      onMouseEnter={() => setHoveredCategory(item.category)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      className={`flex items-center justify-between p-2 rounded-xl text-xs transition-all cursor-pointer ${
                        isHovered
                          ? 'bg-slate-100 dark:bg-slate-800 shadow-sm'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-900/40'
                      }`}
                    >
                      <div className='flex items-center gap-2.5 truncate'>
                        <span
                          className='w-3 h-3 rounded-full flex-shrink-0'
                          style={{ backgroundColor: color }}
                        />
                        <span className='font-semibold text-slate-800 dark:text-slate-200 truncate'>
                          {item.category}
                        </span>
                      </div>
                      <div className='flex items-center gap-3 font-mono tabular-nums flex-shrink-0'>
                        <span className='font-bold text-slate-900 dark:text-white'>
                          ${item.amount.toFixed(2)}
                        </span>
                        <span className='text-slate-400 text-[11px] w-9 text-right'>
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6-Month Trend View */}
      {activeTab === 'trend' && (
        <div className='space-y-4'>
          {trend.length === 0 ? (
            <div className='py-12 text-center text-xs text-slate-400'>
              No historical trend data yet.
            </div>
          ) : (
            <div className='space-y-3 pt-2'>
              <div className='flex items-end justify-between h-40 gap-2 sm:gap-4 px-2'>
                {trend.map((t) => {
                  const heightPercent = maxTrendAmount > 0 ? (t.amount / maxTrendAmount) * 100 : 0;
                  return (
                    <div key={t.month} className='flex-1 flex flex-col items-center gap-2 group h-full justify-end'>
                      <span className='text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums'>
                        ${t.amount.toFixed(0)}
                      </span>
                      <div className='w-full bg-slate-100 dark:bg-obsidian-900 rounded-t-xl overflow-hidden h-full flex items-end'>
                        <div
                          style={{ height: `${Math.max(heightPercent, 4)}%` }}
                          className='w-full bg-gradient-to-t from-brand-600 to-teal-400 rounded-t-xl transition-all duration-500 group-hover:from-brand-500 group-hover:to-cyan-300'
                        />
                      </div>
                      <span className='text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-tighter truncate'>
                        {t.month.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className='flex justify-between text-[11px] text-slate-400 font-mono px-2 pt-2 border-t border-slate-200/50 dark:border-white/5'>
                <span>Peak: ${maxTrendAmount.toFixed(2)}</span>
                <span>Rolling 6 Months</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}