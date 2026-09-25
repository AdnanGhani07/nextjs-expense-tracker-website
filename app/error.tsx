'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled dashboard error:', error);
  }, [error]);

  return (
    <div className='min-h-[70vh] flex items-center justify-center px-4'>
      <div className='max-w-md w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl border border-red-100 dark:border-red-900/30 text-center'>
        <div className='w-14 h-14 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-sm'>
          ⚠️
        </div>
        <h2 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2'>
          Something went wrong
        </h2>
        <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-6'>
          An unexpected error occurred while loading your financial records. Please try again or return home.
        </p>
        <div className='flex flex-col sm:flex-row gap-3 justify-center'>
          <button
            onClick={() => reset()}
            className='px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all'
          >
            Try Again
          </button>
          <Link
            href='/'
            className='px-5 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-semibold transition-all'
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
