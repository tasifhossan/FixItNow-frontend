'use client';

import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ShieldCheck, BadgePercent, CheckSquare } from 'lucide-react';

export default function TechnicianDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-6 md:p-8 text-white shadow-lg shadow-violet-500/10">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Technician Hub: {user?.name}
        </h1>
        <p className="text-violet-100 text-sm mt-1.5 max-w-xl">
          View assigned bookings, configure hourly rates, and toggle service availability here.
        </p>
      </div>

      {/* Overview stats layout placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-slate-200/60 bg-white p-5 dark:border-slate-850 dark:bg-slate-900 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-violet-50 dark:bg-violet-950/40 text-violet-650 dark:text-violet-400">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Verification Status</h3>
          </div>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Your technician profile is pending admin approval. You will show up in public catalogs once verified.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200/60 bg-white p-5 dark:border-slate-850 dark:bg-slate-900 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-violet-50 dark:bg-violet-950/40 text-violet-650 dark:text-violet-400">
              <BadgePercent className="h-5 w-5" />
            </span>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Earnings &amp; Rates</h3>
          </div>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Hourly rates and billing statements will be adjustable in Phase 3.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200/60 bg-white p-5 dark:border-slate-850 dark:bg-slate-900 shadow-sm flex items-center justify-center text-center">
          <div className="space-y-2">
            <CheckSquare className="mx-auto h-6 w-6 text-slate-400 dark:text-slate-505" />
            <p className="text-xs font-medium text-slate-400 dark:text-slate-505 max-w-[15rem]">
              Assigned jobs and customer messages will list here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
