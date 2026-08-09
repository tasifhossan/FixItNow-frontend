'use client';

import React, { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error('Unhandled app boundary error:', error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[50vh] px-4 py-16 text-center bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white/80 p-8 shadow-xl backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80 text-center space-y-6">
        {/* Error icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400">
          <svg
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Something went wrong</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            An unexpected error occurred while rendering this page.
          </p>
        </div>

        {/* Diagnostic info (optional) */}
        {error.message && (
          <div className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-450 p-3 rounded-lg font-mono text-left break-all max-h-24 overflow-y-auto">
            {error.message}
          </div>
        )}

        {/* Reset button */}
        <button
          onClick={() => reset()}
          className="w-full rounded-lg bg-indigo-650 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/10 hover:bg-indigo-550 hover:shadow-indigo-500/20 active:scale-[0.98] transition-all duration-200"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
