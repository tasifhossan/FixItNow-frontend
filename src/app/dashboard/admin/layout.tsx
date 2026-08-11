'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import RoleGuard from '../../../components/RoleGuard';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  FolderKanban, 
  ShieldAlert, 
  CalendarDays, 
  LogOut 
} from 'lucide-react';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isOverviewActive = pathname === '/dashboard/admin';
  const isUsersActive = pathname.startsWith('/dashboard/admin/users');
  const isTechsActive = pathname.startsWith('/dashboard/admin/technicians');
  const isCategoriesActive = pathname.startsWith('/dashboard/admin/categories');
  const isServicesActive = pathname.startsWith('/dashboard/admin/services');
  const isBookingsActive = pathname.startsWith('/dashboard/admin/bookings');

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <div className="flex-1 flex flex-col md:flex-row min-h-screen">
        
        {/* ─── Figma Styled Sidebar Panel ─── */}
        <aside className="w-full md:w-64 border-r border-slate-200/50 bg-white dark:border-slate-800/50 dark:bg-slate-900 transition-colors duration-300 md:sticky md:top-0 md:h-screen flex flex-col justify-between shrink-0">
          
          {/* Top section: Logo & Nav */}
          <div className="flex-1 flex flex-col">
            
            {/* Logo area */}
            <div className="px-6 py-6 border-b border-slate-100 dark:border-slate-850 flex flex-col gap-0.5">
              <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400 select-none">
                FixItNow
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Home Services
              </span>
            </div>

            {/* Navigation links */}
            <nav className="p-4 space-y-1">
              {/* Overview */}
              <Link
                href="/dashboard/admin"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isOverviewActive
                    ? 'text-blue-600 bg-blue-50/50 dark:text-blue-400 dark:bg-blue-950/20'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-slate-850/50'
                }`}
              >
                <LayoutDashboard className="h-5 w-5 shrink-0" />
                Overview
              </Link>

              {/* Users */}
              <Link
                href="/dashboard/admin/users"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isUsersActive
                    ? 'text-blue-600 bg-blue-50/50 dark:text-blue-400 dark:bg-blue-950/20'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-slate-850/50'
                }`}
              >
                <Users className="h-5 w-5 shrink-0" />
                Users
              </Link>

              {/* Technicians */}
              <Link
                href="/dashboard/admin/technicians"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isTechsActive
                    ? 'text-blue-600 bg-blue-50/50 dark:text-blue-400 dark:bg-blue-950/20'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-slate-850/50'
                }`}
              >
                <UserCheck className="h-5 w-5 shrink-0" />
                Technicians
              </Link>

              {/* Categories */}
              <Link
                href="/dashboard/admin/categories"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isCategoriesActive
                    ? 'text-blue-600 bg-blue-50/50 dark:text-blue-400 dark:bg-blue-950/20'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-slate-850/50'
                }`}
              >
                <FolderKanban className="h-5 w-5 shrink-0" />
                Categories
              </Link>

              {/* Services */}
              <Link
                href="/dashboard/admin/services"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isServicesActive
                    ? 'text-blue-600 bg-blue-50/50 dark:text-blue-400 dark:bg-blue-950/20'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-slate-850/50'
                }`}
              >
                <ShieldAlert className="h-5 w-5 shrink-0" />
                Services
              </Link>

              {/* Bookings */}
              <Link
                href="/dashboard/admin/bookings"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isBookingsActive
                    ? 'text-blue-600 bg-blue-50/50 dark:text-blue-400 dark:bg-blue-950/20'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-slate-850/50'
                }`}
              >
                <CalendarDays className="h-5 w-5 shrink-0" />
                Bookings
              </Link>
            </nav>
          </div>

          {/* Bottom section: Logout */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-850">
            <button
              onClick={() => logout()}
              className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-850/50 transition-all duration-200"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              Logout
            </button>
          </div>

        </aside>

        {/* ─── Content Area with Top Dashboard Header ─── */}
        <main className="flex-1 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 flex flex-col">
          
          {/* Dashboard Header Top Bar */}
          <header className="h-16 border-b border-slate-200/50 bg-white dark:bg-slate-900 px-6 md:px-8 flex items-center justify-between shrink-0 select-none">
            {/* Search Input Box */}
            <div className="flex items-center gap-2.5 px-3 py-2 border border-slate-200/80 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 dark:border-slate-800 w-full max-w-xs md:max-w-sm">
              <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input 
                type="text" 
                placeholder="Search services, pros, or bookings..." 
                className="w-full bg-transparent border-none text-xs focus:outline-none text-slate-700 dark:text-slate-200 font-semibold"
              />
            </div>

            {/* Right Side Icons & Avatar */}
            <div className="flex items-center gap-4">
              {/* Notification icon */}
              <button className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </button>

              {/* Help icon */}
              <button className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </button>

              {/* User Avatar dropdown */}
              <div className="h-9 border-l border-slate-200 dark:border-slate-800 pl-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-[10px] shrink-0 shadow-sm border border-slate-100">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <span className="hidden sm:inline text-xs font-bold text-slate-650 dark:text-slate-200">
                  {user?.name ? `${user.name.split(' ')[0]} ${user.name.split(' ')[1] ? user.name.split(' ')[1].charAt(0) + '.' : ''}` : 'Admin'}
                </span>
              </div>
            </div>
          </header>

          {/* Main content viewport */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto">
              {children}
            </div>
          </div>

        </main>
      </div>
    </RoleGuard>
  );
}
