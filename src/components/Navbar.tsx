'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, isLoading, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/70 backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-900/70 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo on the left */}
          <div className="flex items-center gap-2">
            <Link href="/" className="group flex items-center gap-1.5 text-xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent group-hover:from-indigo-500 group-hover:to-violet-500 transition-all duration-300">
                FixIt
              </span>
              <span className="text-slate-800 dark:text-slate-200">Now</span>
            </Link>
          </div>

          {/* Navigation links placeholder */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors duration-200"
            >
              Services
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors duration-200"
            >
              Technicians
            </Link>
            {user && (
              <Link
                href={`/dashboard/${user.role.toLowerCase()}`}
                className="text-sm font-semibold text-indigo-650 hover:text-indigo-550 dark:text-indigo-400 dark:hover:text-indigo-350 transition-colors duration-200"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* User actions on the right */}
          <div className="flex items-center gap-4">
            {isLoading ? (
              // Loading skeleton for auth state
              <div className="flex items-center gap-3">
                <div className="h-8 w-16 animate-pulse rounded-md bg-slate-200 dark:bg-slate-800"></div>
                <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800"></div>
              </div>
            ) : user ? (
              // Logged in user view
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2.5">
                  {/* User Avatar */}
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-sm font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  {/* Name and Role */}
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                      {user.name}
                    </span>
                    <span className="text-xxs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none mt-0.5">
                      {user.role}
                    </span>
                  </div>
                </div>

                {/* Dashboard & Logout Buttons */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/${user.role.toLowerCase()}`}
                    className="hidden sm:inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold text-indigo-650 hover:text-indigo-550 dark:text-indigo-400 dark:hover:text-indigo-350 transition-all duration-200"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="rounded-lg border border-slate-200 dark:border-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              // Guest view (login / register)
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="text-xs font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-850 transition-all duration-250"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/10 hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/20 active:scale-[0.98] transition-all duration-200"
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
