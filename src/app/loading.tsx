import React from 'react';

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[50vh] px-4 bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center space-y-4">
        {/* Modern styled spinner */}
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 bg-indigo-600"></span>
        </div>
        <p className="text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400 animate-pulse">
          Loading FixItNow...
        </p>
      </div>
    </div>
  );
}
