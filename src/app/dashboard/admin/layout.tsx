'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import RoleGuard from '../../../components/RoleGuard';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  Briefcase, 
  CalendarDays, 
  LogOut,
  ChevronDown
} from 'lucide-react';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const getHeaderTitle = () => {
    if (pathname === '/dashboard/admin') return 'Admin Dashboard';
    if (pathname.startsWith('/dashboard/admin/users')) return 'Users';
    if (pathname.startsWith('/dashboard/admin/technicians')) return 'Technicians';
    if (pathname.startsWith('/dashboard/admin/services')) return 'Services';
    if (pathname.startsWith('/dashboard/admin/bookings')) return 'Bookings';
    return 'Admin Dashboard';
  };

  const navItems = [
    { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard, isActive: pathname === '/dashboard/admin' },
    { href: '/dashboard/admin/users', label: 'Users', icon: Users, isActive: pathname.startsWith('/dashboard/admin/users') },
    { href: '/dashboard/admin/technicians', label: 'Technicians', icon: Wrench, isActive: pathname.startsWith('/dashboard/admin/technicians') },
    { href: '/dashboard/admin/services', label: 'Services', icon: Briefcase, isActive: pathname.startsWith('/dashboard/admin/services') || pathname.startsWith('/dashboard/admin/categories') },
    { href: '/dashboard/admin/bookings', label: 'Bookings', icon: CalendarDays, isActive: pathname.startsWith('/dashboard/admin/bookings') },
  ];

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <div className="flex-1 flex flex-col md:flex-row min-h-screen">
        
        {/* ─── Figma Sidebar ─── */}
        <aside className="w-full md:w-56 border-r border-slate-200/60 bg-white md:sticky md:top-0 md:h-screen flex flex-col justify-between shrink-0">
          
          {/* Top: Logo + Nav */}
          <div className="flex-1 flex flex-col">
            
            {/* Logo */}
            <div className="px-5 py-5 border-b border-slate-100">
              <span className="text-xl font-extrabold text-blue-600 select-none tracking-tight">
                FixItNow
              </span>
            </div>

            {/* Navigation */}
            <nav className="px-2 py-4 space-y-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex items-center gap-3 px-4 py-2.5 rounded-r-lg text-sm font-medium transition-all duration-200 ${
                      item.isActive
                        ? 'text-blue-600 bg-blue-50/60 border-l-[3px] border-blue-600 pl-[13px]'
                        : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50 border-l-[3px] border-transparent pl-[13px]'
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom: Logout */}
          <div className="px-2 py-4 border-t border-slate-100">
            <button
              onClick={() => logout()}
              className="flex w-full items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50/50 transition-all duration-200 border-l-[3px] border-transparent pl-[13px]"
            >
              <LogOut className="h-[18px] w-[18px] shrink-0" />
              Logout
            </button>
          </div>

        </aside>

        {/* ─── Content Area ─── */}
        <main className="flex-1 bg-[#F8FAFC] flex flex-col">
          
          {/* Top Header Bar */}
          <header className="h-16 border-b border-slate-200/60 bg-white px-6 md:px-8 flex items-center justify-between shrink-0 select-none">
            {/* Header Title */}
            <h1 className="text-base font-bold text-slate-800 tracking-tight">
              {getHeaderTitle()}
            </h1>

            {/* Right: Bell + User Profile */}
            <div className="flex items-center gap-4">
              {/* Notification bell */}
              <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors relative">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-2.5 cursor-pointer group">
                <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <span className="hidden sm:inline text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                  {user?.name || 'Admin User'}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto">
            <div className="max-w-[1100px] mx-auto">
              {children}
            </div>
          </div>

        </main>
      </div>
    </RoleGuard>
  );
}
