'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

interface RoleGuardProps {
  allowedRoles: Array<'CUSTOMER' | 'TECHNICIAN' | 'ADMIN'>;
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Redirection to login if not authenticated
        router.replace('/auth/login');
      } else if (!allowedRoles.includes(user.role)) {
        // Redirection to root home if authenticated but unauthorized
        router.replace('/');
      }
    }
  }, [user, isLoading, allowedRoles, router]);

  // Spinner design matching the layout loading state
  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] px-4 bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative flex h-10 w-10">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-10 w-10 bg-indigo-600"></span>
          </div>
          <p className="text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400 animate-pulse">
            Verifying access permissions...
          </p>
        </div>
      </div>
    );
  }

  // Brief redirection block
  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] px-4 bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-650 border-t-transparent" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Unauthorized. Redirecting...
          </p>
        </div>
      </div>
    );
  }

  // Renders the dashboard shell content when authenticated
  return <>{children}</>;
};

export default RoleGuard;
