'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import RoleGuard from '../../../components/RoleGuard';
import { LayoutDashboard, CalendarDays } from 'lucide-react';

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isOverviewActive = pathname === '/dashboard/customer';
  const isBookingsActive = pathname.startsWith('/dashboard/customer/bookings');

  return (
    <RoleGuard allowedRoles={['CUSTOMER']}>
      <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
        {/* Sidebar Panel */}
        <aside className="w-full md:w-64 border-r border-slate-200/50 bg-white dark:border-slate-800/50 dark:bg-slate-900 transition-colors duration-300 md:sticky md:top-16 md:h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-6 py-6 border-b border-slate-100 dark:border-slate-850">
            <h2 className="text-md font-bold text-slate-800 dark:text-white">Customer Panel</h2>
            <p className="text-3xs uppercase tracking-wider text-slate-400 mt-0.5">Control Center</p>
          </div>
          <nav className="p-4 space-y-1">
            <Link
              href="/dashboard/customer"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isOverviewActive
                  ? 'text-indigo-650 bg-indigo-50/50 dark:text-indigo-400 dark:bg-indigo-950/20'
                  : 'text-slate-600 hover:text-indigo-650 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-slate-850/50'
              }`}
            >
              <LayoutDashboard className="h-4.5 w-4.5" />
              Overview
            </Link>
            <Link
              href="/dashboard/customer/bookings"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isBookingsActive
                  ? 'text-indigo-650 bg-indigo-50/50 dark:text-indigo-400 dark:bg-indigo-950/20'
                  : 'text-slate-600 hover:text-indigo-650 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-slate-850/50'
              }`}
            >
              <CalendarDays className="h-4.5 w-4.5" />
              Bookings
            </Link>
          </nav>
        </aside>


        {/* Content Area */}
        <main className="flex-1 p-6 md:p-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </RoleGuard>
  );
}
