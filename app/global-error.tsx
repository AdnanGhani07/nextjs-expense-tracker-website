'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang='en'>
      <body className='min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4 font-sans'>
        <div className='max-w-md w-full bg-gray-800 p-8 rounded-2xl border border-gray-700 text-center shadow-2xl'>
          <div className='text-3xl mb-3'>💥</div>
          <h2 className='text-xl font-bold mb-2'>Fatal Application Error</h2>
          <p className='text-xs text-gray-400 mb-6'>
            A critical error prevented the application from loading.
          </p>
          <button
            onClick={() => reset()}
            className='px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all'
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
