'use client';

import { useEffect, useState, useTransition, useCallback } from 'react';
import { getExpenseRecords, ExpenseRecordItem } from '@/app/actions/getExpenseRecords';
import { deleteExpenseRecord } from '@/app/actions/deleteExpenseRecord';

const CATEGORIES = [
  'All',
  'Food',
  'Transportation',
  'Bills',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Other',
];

const categoryStyles: Record<string, { icon: string; bg: string; text: string }> = {
  Food: { icon: '🍔', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', text: 'text-amber-600 dark:text-amber-400' },
  Transportation: { icon: '🚗', bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', text: 'text-blue-600 dark:text-blue-400' },
  Bills: { icon: '💡', bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400', text: 'text-rose-600 dark:text-rose-400' },
  Shopping: { icon: '🛍️', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400', text: 'text-purple-600 dark:text-purple-400' },
  Entertainment: { icon: '🎬', bg: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400', text: 'text-fuchsia-600 dark:text-fuchsia-400' },
  Healthcare: { icon: '🏥', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', text: 'text-emerald-600 dark:text-emerald-400' },
  Other: { icon: '📦', bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400', text: 'text-slate-600 dark:text-slate-400' },
};

export default function RecordHistory() {
  const [records, setRecords] = useState<ExpenseRecordItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const fetchRecords = useCallback(async (query: string, category: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getExpenseRecords(query, category);
      if (res.error) {
        setError(res.error);
      } else if (res.records) {
        setRecords(res.records);
      }
    } catch {
      setError('Failed to load transaction history.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRecords(searchQuery, selectedCategory);
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchRecords, searchQuery, selectedCategory]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setConfirmDeleteId(null);
    try {
      const res = await deleteExpenseRecord(id);
      if (res.error) {
        alert(`Failed to delete: ${res.error}`);
      } else {
        startTransition(() => {
          setRecords((prev) => prev.filter((r) => r.id !== id));
        });
      }
    } catch {
      alert('Network error while deleting transaction');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className='glass-card rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden transition-all duration-300'>
      
      {/* Header & Controls */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-white/5'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-glow-indigo'>
            <span className='text-lg'>📜</span>
          </div>
          <div>
            <h2 className='text-xl font-bold text-slate-900 dark:text-white leading-tight'>
              Transaction Ledger
            </h2>
            <p className='text-xs text-slate-500 dark:text-slate-400'>
              Audit and filter your spending history
            </p>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className='relative w-full sm:w-72'>
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search description or category...'
            className='w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all'
          />
          <span className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs'>
            🔍
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs'
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className='flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold'>
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-brand-500 text-slate-950 font-bold shadow-glow-sm'
                  : 'bg-slate-100 dark:bg-obsidian-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-white/5 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Ledger Body */}
      {error && (
        <div className='p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs border border-rose-200 dark:border-rose-900'>
          {error}
        </div>
      )}

      {isLoading ? (
        <div className='space-y-2.5'>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className='p-4 rounded-2xl bg-slate-100/60 dark:bg-obsidian-900/60 border border-slate-200/50 dark:border-white/5 animate-pulse h-16 flex items-center justify-between'
            >
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl' />
                <div className='space-y-1.5'>
                  <div className='w-36 h-3 bg-slate-200 dark:bg-slate-800 rounded' />
                  <div className='w-20 h-2.5 bg-slate-200 dark:bg-slate-800 rounded' />
                </div>
              </div>
              <div className='w-20 h-4 bg-slate-200 dark:bg-slate-800 rounded' />
            </div>
          ))}
        </div>
      ) : records.length === 0 ? (
        <div className='py-12 text-center space-y-2'>
          <span className='text-3xl block'>📭</span>
          <p className='text-sm font-semibold text-slate-700 dark:text-slate-300'>
            No transactions found
          </p>
          <p className='text-xs text-slate-400'>
            {searchQuery || selectedCategory !== 'All'
              ? 'Try adjusting your search filters above.'
              : 'Log your first expense in the form above to build your ledger.'}
          </p>
        </div>
      ) : (
        <div className='space-y-2.5'>
          {records.map((record) => {
            const catStyle = categoryStyles[record.category] || categoryStyles.Other;
            const isDeleting = deletingId === record.id;
            const isConfirming = confirmDeleteId === record.id;

            return (
              <div
                key={record.id}
                className='p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 dark:bg-obsidian-900/80 border border-slate-200/80 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-all flex items-center justify-between gap-4 group'
              >
                {/* Left: Icon & Details */}
                <div className='flex items-center gap-3 min-w-0'>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${catStyle.bg}`}>
                    <span>{catStyle.icon}</span>
                  </div>

                  <div className='min-w-0'>
                    <div className='text-sm font-semibold text-slate-900 dark:text-white truncate'>
                      {record.text}
                    </div>
                    <div className='flex items-center gap-2 text-[11px] text-slate-400'>
                      <span className='font-medium'>{formatDate(record.date)}</span>
                      <span>•</span>
                      <span className={`font-semibold ${catStyle.text}`}>{record.category}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className='flex items-center gap-3 sm:gap-4 flex-shrink-0'>
                  <span className='font-mono font-bold text-sm sm:text-base text-slate-900 dark:text-white tabular-nums'>
                    -${record.amount.toFixed(2)}
                  </span>

                  {isConfirming ? (
                    <div className='flex items-center gap-1.5 animate-in fade-in duration-150'>
                      <button
                        onClick={() => handleDelete(record.id)}
                        disabled={isDeleting}
                        className='px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-500 hover:bg-rose-600 text-white transition-all'
                      >
                        {isDeleting ? 'Deleting...' : 'Confirm'}
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className='px-2 py-1 rounded-lg text-[10px] text-slate-400 hover:text-slate-200'
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(record.id)}
                      className='opacity-40 group-hover:opacity-100 hover:text-rose-500 transition-opacity p-1 text-xs'
                      title='Delete receipt'
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}