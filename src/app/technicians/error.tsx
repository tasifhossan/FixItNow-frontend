'use client';

import React, { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function TechniciansErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Technicians catalog error:', error);
  }, [error]);

  return (
    <div className="max-w-xl mx-auto my-16 p-8 text-center bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-200/50">
      <div className="space-y-5">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Technicians Catalog Error</h2>
          <p className="text-xs text-slate-400 font-medium">
            Could not fetch or load the technician profile catalog. Please try again.
          </p>
        </div>
        <button
          onClick={() => reset()}
          className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-705 active:scale-[0.98] transition-all duration-200"
        >
          Retry Loading Catalog
        </button>
      </div>
    </div>
  );
}
