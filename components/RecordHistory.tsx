'use client';

import { useEffect, useState, useTransition, useCallback } from 'react';
import { getExpenseRecords, ExpenseRecordItem } from '@/app/actions/getExpenseRecords';
import { deleteExpenseRecord } from '@/app/actions/deleteExpenseRecord';

const CATEGORIES = [
  'All',
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Healthcare',
  'Other',
];

const categoryIcons: Record<string, string> = {
  Food: '🍔',
  Transportation: '🚗',
  Entertainment: '🎬',
  Shopping: '🛍️',
  Bills: '📄',
  Healthcare: '🏥',
  Other: '📦',
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecords(searchQuery, selectedCategory);
  };

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

  return (
    <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg'>
            <span className='text-white text-lg'>📜</span>
          </div>
          <div>
            <h3 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
              Transaction History
            </h3>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              View, search, and manage your recent expenses
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className='flex gap-2 max-w-xs w-full'>
          <div className='relative flex-1'>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search expenses...'
              className='w-full px-3.5 py-2 pl-9 text-xs sm:text-sm bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all'
            />
            <span className='absolute left-3 top-2.5 text-gray-400 text-xs'>🔍</span>
            {searchQuery && (
              <button
                type='button'
                onClick={() => {
                  setSearchQuery('');
                  fetchRecords('', selectedCategory);
                }}
                className='absolute right-2.5 top-2.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              >
                ✕
              </button>
            )}
          </div>
          <button
            type='submit'
            className='px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors'
          >
            Filter
          </button>
        </form>
      </div>

      {/* Category Pills Filter */}
      <div className='flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none'>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-105'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {cat !== 'All' && <span className='mr-1'>{categoryIcons[cat] || '📦'}</span>}
            {cat}
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className='p-3 mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center justify-between'>
          <span>{error}</span>
          <button
            onClick={() => fetchRecords(searchQuery, selectedCategory)}
            className='underline text-xs font-bold hover:text-red-700'
          >
            Retry
          </button>
        </div>
      )}

      {/* List Content */}
      {isLoading ? (
        <div className='space-y-3 py-4'>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className='h-16 bg-gray-100 dark:bg-gray-700/40 rounded-xl animate-pulse flex items-center justify-between px-4'
            >
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-lg'></div>
                <div className='space-y-2'>
                  <div className='w-32 h-3.5 bg-gray-200 dark:bg-gray-600 rounded'></div>
                  <div className='w-20 h-2.5 bg-gray-200 dark:bg-gray-600 rounded'></div>
                </div>
              </div>
              <div className='w-16 h-4 bg-gray-200 dark:bg-gray-600 rounded'></div>
            </div>
          ))}
        </div>
      ) : records.length === 0 ? (
        <div className='py-12 text-center'>
          <div className='w-16 h-16 mx-auto mb-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl flex items-center justify-center text-3xl shadow-inner'>
            🌱
          </div>
          <h4 className='text-base font-semibold text-gray-800 dark:text-gray-200'>
            No expenses found
          </h4>
          <p className='text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto mt-1'>
            {searchQuery || selectedCategory !== 'All'
              ? 'Try adjusting your search query or category filters.'
              : 'Add your first expense record to start tracking your finances!'}
          </p>
        </div>
      ) : (
        <div className='divide-y divide-gray-100 dark:divide-gray-700/60 max-h-[460px] overflow-y-auto pr-1'>
          {records.map((record) => (
            <div
              key={record.id}
              className='py-3.5 flex items-center justify-between gap-3 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 px-2 rounded-xl transition-colors group'
            >
              <div className='flex items-center gap-3 min-w-0'>
                <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-lg flex-shrink-0 shadow-sm'>
                  {categoryIcons[record.category] || '📦'}
                </div>
                <div className='min-w-0'>
                  <h4 className='text-sm font-semibold text-gray-900 dark:text-gray-100 truncate'>
                    {record.text}
                  </h4>
                  <div className='flex items-center gap-2 mt-0.5 text-xs text-gray-500 dark:text-gray-400'>
                    <span className='px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-medium text-[11px]'>
                      {record.category}
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(record.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amount and Delete Action */}
              <div className='flex items-center gap-3 flex-shrink-0'>
                <span className='text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100'>
                  -${record.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>

                {confirmDeleteId === record.id ? (
                  <div className='flex items-center gap-1.5'>
                    <button
                      onClick={() => handleDelete(record.id)}
                      disabled={deletingId === record.id}
                      className='px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded-lg shadow-sm transition-all'
                    >
                      {deletingId === record.id ? '...' : 'Confirm'}
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className='px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-[11px] rounded-lg'
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(record.id)}
                    className='opacity-60 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-all'
                    title='Delete transaction'
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}