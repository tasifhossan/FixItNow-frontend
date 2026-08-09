'use client';

import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { User, Shield, Info } from 'lucide-react';

export default function CustomerDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 md:p-8 text-white shadow-lg shadow-indigo-500/10">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-indigo-100 text-sm mt-1.5 max-w-xl">
          Manage your bookings, browse services, and track repairs from your customer dashboard panel.
        </p>
      </div>

      {/* Overview stats layout placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-slate-200/60 bg-white p-5 dark:border-slate-850 dark:bg-slate-900 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <User className="h-5 w-5" />
            </span>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Profile Details</h3>
          </div>
          <div className="mt-4 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Phone:</strong> {user?.phone}</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/60 bg-white p-5 dark:border-slate-850 dark:bg-slate-900 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <Shield className="h-5 w-5" />
            </span>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Security &amp; Role</h3>
          </div>
          <div className="mt-4 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
            <p><strong>Role:</strong> {user?.role}</p>
            <p><strong>Status:</strong> {user?.isBlocked ? 'Suspended' : 'Active'}</p>
            <p><strong>Joined:</strong> {user ? new Date(user.createdAt).toLocaleDateString() : ''}</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/60 bg-white p-5 dark:border-slate-850 dark:bg-slate-900 shadow-sm flex items-center justify-center text-center">
          <div className="space-y-2">
            <Info className="mx-auto h-6 w-6 text-slate-400 dark:text-slate-505" />
            <p className="text-xs font-medium text-slate-400 dark:text-slate-505 max-w-[15rem]">
              Full booking logs and search options will be added in Phase 2.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
