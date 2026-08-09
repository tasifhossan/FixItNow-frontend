'use client';

import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ShieldCheck, BarChart4, Wrench } from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-r from-red-650 to-indigo-650 p-6 md:p-8 text-white shadow-lg shadow-red-500/10">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Admin Dashboard: {user?.name}
        </h1>
        <p className="text-red-100 text-sm mt-1.5 max-w-xl">
          System Overview, category definitions, service mappings, and global platform actions.
        </p>
      </div>

      {/* Overview stats layout placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-slate-200/60 bg-white p-5 dark:border-slate-850 dark:bg-slate-900 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-650 dark:text-red-400">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Global Security</h3>
          </div>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            System logs, user blockage states, and technician verifications will be manageable in Phase 4.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200/60 bg-white p-5 dark:border-slate-850 dark:bg-slate-900 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-650 dark:text-red-400">
              <BarChart4 className="h-5 w-5" />
            </span>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Platform Metrics</h3>
          </div>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Dashboard metrics, booking distributions, and transaction analytics will display in Phase 4.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200/60 bg-white p-5 dark:border-slate-850 dark:bg-slate-900 shadow-sm flex items-center justify-center text-center">
          <div className="space-y-2">
            <Wrench className="mx-auto h-6 w-6 text-slate-400 dark:text-slate-505" />
            <p className="text-xs font-medium text-slate-400 dark:text-slate-505 max-w-[15rem]">
              Service pricing and category management drawers will be implemented here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
