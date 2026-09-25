import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='min-h-[75vh] flex items-center justify-center px-4'>
      <div className='max-w-md w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 text-center'>
        <div className='w-16 h-16 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 text-white rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg'>
          🔍
        </div>
        <h1 className='text-3xl font-black bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent mb-2'>
          404
        </h1>
        <h2 className='text-lg font-bold text-gray-900 dark:text-gray-100 mb-2'>
          Page Not Found
        </h2>
        <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-6'>
          Sorry, the page you are looking for does not exist or may have been moved.
        </p>
        <Link
          href='/'
          className='inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 hover:from-emerald-700 hover:via-green-600 text-white rounded-xl text-xs font-bold shadow-lg transition-all'
        >
          <span>← Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
