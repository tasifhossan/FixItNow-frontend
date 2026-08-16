import React from 'react';

export default function TechnicianDetailLoading() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse text-left">
      {/* Header skeleton */}
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>

      {/* Main layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/40 bg-white/20 dark:bg-slate-900/20 flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
            <div className="space-y-3 flex-1 w-full">
              <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-4 w-1/4 bg-slate-100 dark:bg-slate-800 rounded" />
              <div className="h-16 w-full bg-slate-100 dark:bg-slate-800 rounded-xl" />
            </div>
          </div>

          {/* Reviews tab skeleton */}
          <div className="space-y-4">
            <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-32 w-full bg-slate-100 dark:bg-slate-800 border border-white/40 rounded-xl" />
          </div>
        </div>

        {/* Booking slot column */}
        <div>
          <div className="glass-card p-6 rounded-2xl border border-white/40 bg-white/20 dark:bg-slate-900/20 h-96" />
        </div>
      </div>
    </div>
  );
}
