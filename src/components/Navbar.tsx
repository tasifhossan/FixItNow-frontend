'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, isLoading, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-blue-100 shadow-[0_2px_16px_rgba(37,99,235,0.07)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 group">
            {/* Wrench icon mark */}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-sm group-hover:bg-blue-700 transition-colors duration-200">
              <svg className="h-4.5 w-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
            </div>
            <span className="text-xl font-extrabold text-slate-800 tracking-tight">
              FixIt<span className="text-blue-600">Now</span>
            </span>
          </Link>

          {/* ── Nav links ── */}
          <div className="hidden md:flex items-center gap-7">
            <Link
              href="/services"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200"
            >
              Services
            </Link>
            <Link
              href="/technicians"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200"
            >
              Technicians
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200"
            >
              How it Works
            </Link>
            {user && (
              <Link
                href={`/dashboard/${user.role.toLowerCase()}`}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* ── User actions ── */}
          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="h-8 w-16 animate-pulse rounded-lg bg-slate-100" />
                <div className="h-8 w-8 animate-pulse rounded-full bg-slate-100" />
              </div>
            ) : user ? (
              /* ── Logged-in view ── */
              <div className="flex items-center gap-3">
                {/* Avatar + name */}
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-sm ring-2 ring-blue-100">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-sm font-semibold text-slate-800 leading-tight">
                      {user.name}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 leading-none mt-0.5">
                      {user.role}
                    </span>
                  </div>
                </div>

                {/* Dashboard + Logout */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/${user.role.toLowerCase()}`}
                    className="hidden sm:inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-all duration-200"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              /* ── Guest view ── */
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200 active:scale-95"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white rounded-lg transition-all duration-200 font-bold text-sm active:scale-95 shadow-sm shadow-amber-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
