'use client';

import React, { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CustomerDashboardErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Customer dashboard error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] p-8 text-center bg-slate-50/50 dark:bg-slate-950/20 rounded-3xl border border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-md space-y-5">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Customer Dashboard Error</h2>
          <p className="text-xs text-slate-400 font-medium">
            An error occurred while loading this dashboard page. The customer navigation layout remains fully active.
          </p>
        </div>
        {error.message && (
          <div className="text-[11px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 text-slate-500 p-3 rounded-xl font-mono text-left break-all max-h-24 overflow-y-auto">
            {error.message}
          </div>
        )}
        <button
          onClick={() => reset()}
          className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-[0.98] transition-all duration-200"
        >
          Retry Load
        </button>
      </div>
    </div>
  );
}
