'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Toaster } from 'react-hot-toast';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is already logged in, redirect them immediately to their dashboard
    if (!isLoading && user) {
      const dashboardPath = `/dashboard/${user.role.toLowerCase()}`;
      router.replace(dashboardPath);
    }
  }, [user, isLoading, router]);

  // While checking auth status, show a simple loading state to prevent form flashing
  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-h-[70vh] bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, don't render the form while redirecting is in progress
  if (user) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-h-[70vh] bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex-1 flex items-center justify-center min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      {/* Background blobs for premium depth */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-indigo-500/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-72 w-72 rounded-full bg-violet-500/5 blur-3xl" />

      {/* Auth Card wrapper */}
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-200/80 bg-white/80 p-8 shadow-xl shadow-slate-100/50 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-none">
        {children}
      </div>

      {/* Global toasting for auth flows */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'dark:bg-slate-800 dark:text-slate-100 dark:border dark:border-slate-700',
          duration: 4000,
          style: {
            fontSize: '0.875rem',
            fontWeight: '500',
            borderRadius: '0.75rem',
          },
        }}
      />
    </div>
  );
}
