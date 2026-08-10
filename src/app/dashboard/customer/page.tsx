'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, ArrowRight, ClipboardCheck, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getMyBookings, BookingListItem } from '@/lib/bookings';
import BookingStatusBadge from '@/components/BookingStatusBadge';

// Helper to format booking date
function formatBookingDate(dateStr: string) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

// Skeletons for dashboard loading
function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse text-left">
      <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>
      <div className="space-y-4">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>
    </div>
  );
}

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [recentBookings, setRecentBookings] = useState<BookingListItem[]>([]);
  const [stats, setStats] = useState({ active: 0, completed: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch up to 100 bookings to compute accurate stats and show the top 5
        const response = await getMyBookings({ page: 1, limit: 100 });
        const allBookings = response.data;
        const total = response.meta.total;

        // Calculate counts client-side
        let activeCount = 0;
        let completedCount = 0;

        allBookings.forEach((b) => {
          if (['REQUESTED', 'ACCEPTED', 'PAID', 'IN_PROGRESS'].includes(b.status)) {
            activeCount++;
          } else if (b.status === 'COMPLETED') {
            completedCount++;
          }
        });

        setStats({
          active: activeCount,
          completed: completedCount,
          total,
        });

        // Show the top 5 most recent
        setRecentBookings(allBookings.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6 text-left">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 md:p-8 text-white shadow-lg shadow-indigo-500/10">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-indigo-100 text-sm mt-1.5 max-w-xl">
          Manage your bookings, browse services, and track repairs from your customer dashboard panel.
        </p>
      </div>

      {/* Overview stats layout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Stat 1: Total Bookings */}
        <div className="rounded-xl border border-slate-250/20 bg-white dark:border-slate-850 dark:bg-slate-900 p-5 shadow-sm flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Bookings</h3>
            <p className="text-3xl font-black text-slate-800 dark:text-white">{stats.total}</p>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Calendar className="h-6 w-6" />
          </div>
        </div>

        {/* Stat 2: Active Bookings */}
        <div className="rounded-xl border border-slate-250/20 bg-white dark:border-slate-850 dark:bg-slate-900 p-5 shadow-sm flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Status</h3>
            <p className="text-3xl font-black text-indigo-650 dark:text-indigo-400">{stats.active}</p>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Sparkles className="h-6 w-6" />
          </div>
        </div>

        {/* Stat 3: Completed Bookings */}
        <div className="rounded-xl border border-slate-250/20 bg-white dark:border-slate-850 dark:bg-slate-900 p-5 shadow-sm flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed</h3>
            <p className="text-3xl font-black text-green-600 dark:text-green-400">{stats.completed}</p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 rounded-xl">
            <ClipboardCheck className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Recent Bookings Area */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Recent Bookings</h2>
          {stats.total > 0 && (
            <Link
              href="/dashboard/customer/bookings"
              className="text-xs font-bold text-indigo-650 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-305 flex items-center gap-1 transition-colors"
            >
              View All Bookings <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {stats.total === 0 ? (
          <div className="glass-card p-12 rounded-2xl text-center border border-white/40 flex flex-col items-center justify-center gap-4 bg-white/20 dark:bg-slate-900/20">
            <Calendar className="h-12 w-12 text-indigo-500/50" />
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">No Bookings Yet</h3>
              <p className="text-sm text-slate-405 max-w-sm mx-auto mt-1 leading-relaxed">
                You haven&apos;t requested any maintenance or repairs yet. Browse our professional services to get started!
              </p>
            </div>
            <Link
              href="/services"
              className="mt-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-lg text-sm shadow-md hover:from-indigo-500 hover:to-violet-500 active:scale-95 transition-all flex items-center gap-2"
            >
              Browse Services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="glass-card p-6 rounded-2xl border border-white/40 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 bg-white/20 dark:bg-slate-900/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left"
              >
                {/* Main booking meta */}
                <div className="space-y-2.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-base font-bold text-slate-800 dark:text-white truncate">
                      {booking.service?.name}
                    </h3>
                    <BookingStatusBadge status={booking.status} />
                  </div>
                  
                  {/* Tech info & Date */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-y-1.5 gap-x-4 text-xs text-slate-500 dark:text-slate-405 font-medium">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">Technician:</span>
                      <span className="text-slate-700 dark:text-slate-300 font-bold">
                        {booking.technician?.user?.name}
                      </span>
                    </div>
                    <div className="hidden sm:block text-slate-300">|</div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                      <span>{formatBookingDate(booking.scheduledDate)}</span>
                    </div>
                  </div>

                  {/* Details snippet */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-y-1.5 gap-x-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 truncate max-w-sm">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{booking.address}</span>
                    </div>
                  </div>
                </div>

                {/* Price & Action button */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center w-full md:w-auto border-t md:border-none border-slate-100 dark:border-slate-800/80 pt-4 md:pt-0 shrink-0 gap-3">
                  <div className="text-left md:text-right">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total Amount</p>
                    <p className="text-lg font-black text-secondary-container mt-0.5">৳{booking.totalAmount}</p>
                  </div>
                  <Link
                    href={`/dashboard/customer/bookings/${booking.id}`}
                    className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-650 hover:border-indigo-500 dark:hover:text-indigo-400 dark:hover:border-indigo-500 rounded-xl text-xs font-bold transition-all flex items-center gap-1 hover:shadow-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
