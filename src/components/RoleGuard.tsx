'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

interface RoleGuardProps {
  allowedRoles: Array<'CUSTOMER' | 'TECHNICIAN' | 'ADMIN'>;
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      // Redirection to login if not authenticated
      router.replace('/auth/login');
    }
  }, [user, isLoading, router]);

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

  if (!user) {
    return null;
  }

  // Renders the dashboard shell content when authenticated
  return <>{children}</>;
};

export default RoleGuard;
