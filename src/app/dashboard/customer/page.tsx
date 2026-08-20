'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Wrench, 
  Check, 
  Star, 
  FileText, 
  Search, 
  Plus, 
  CreditCard,
  User
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getMyBookings, BookingListItem } from '@/lib/bookings';
import BookingStatusBadge from '@/components/BookingStatusBadge';

// Helper to format date exactly like Figma (e.g., Oct 24, 2023)
function formatFigmaDate(dateStr: string) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

// Skeletons for dashboard loading
function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse text-left">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-4 w-96 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
      <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
    </div>
  );
}

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [recentBookings, setRecentBookings] = useState<BookingListItem[]>([]);
  const [stats, setStats] = useState({ active: 0, completed: 0, total: 0, totalSpent: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch bookings to compute stats and display recent entries
        const response = await getMyBookings({ page: 1, limit: 100 });
        const allBookings = response.data;
        const total = response.meta.total;

        let activeCount = 0;
        let completedCount = 0;
        let spentSum = 0;

        allBookings.forEach((b) => {
          if (['REQUESTED', 'ACCEPTED', 'PAID', 'IN_PROGRESS'].includes(b.status)) {
            activeCount++;
          } else if (b.status === 'COMPLETED') {
            completedCount++;
          }

          // Sum paid amount for paid/completed bookings
          if (['PAID', 'COMPLETED'].includes(b.status)) {
            spentSum += b.totalAmount;
          }
        });

        setStats({
          active: activeCount,
          completed: completedCount,
          total,
          totalSpent: spentSum,
        });

        // Show the top 5 most recent bookings
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

  const isEmptyState = stats.total === 0;

  return (
    <div className="space-y-8 text-left">
      
      {/* ─── Header / Greeting Section ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          {isEmptyState ? (
            <>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Overview</h1>
              <p className="text-sm text-slate-500">
                Welcome back, {user?.name.split(' ')[0]}. Here is what&apos;s happening today.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Welcome back, {user?.name.split(' ')[0]}!
              </h1>
              <p className="text-sm text-slate-500">
                Here is what&apos;s happening with your home services today.
              </p>
            </>
          )}
        </div>
        {!isEmptyState && (
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-xl text-sm transition-all shadow-md active:scale-95 shrink-0"
          >
            <Plus className="h-4.5 w-4.5" /> Book a New Service
          </Link>
        )}
      </div>

      {/* ─── Stats Cards Grid ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Stat Card 1: Active Bookings */}
        <div className="bg-white border border-slate-200/60 dark:border-slate-800 dark:bg-slate-900 rounded-2xl p-6 flex items-center gap-5 shadow-sm">
          <div className={`p-4.5 rounded-full flex items-center justify-center shrink-0 ${
            isEmptyState 
              ? 'bg-slate-100 text-slate-400 dark:bg-slate-800' 
              : 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
          }`}>
            {isEmptyState ? <FileText className="h-6 w-6" /> : <Wrench className="h-6 w-6" />}
          </div>
          <div className="space-y-0.5">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Bookings</h3>
            <p className="text-3xl font-extrabold text-slate-850 dark:text-white leading-none">
              {stats.active}
            </p>
          </div>
        </div>

        {/* Stat Card 2: Completed Jobs */}
        <div className="bg-white border border-slate-200/60 dark:border-slate-800 dark:bg-slate-900 rounded-2xl p-6 flex items-center gap-5 shadow-sm">
          <div className={`p-4.5 rounded-full flex items-center justify-center shrink-0 ${
            isEmptyState 
              ? 'bg-slate-100 text-slate-400 dark:bg-slate-800' 
              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
          }`}>
            {isEmptyState ? <FileText className="h-6 w-6" /> : <Check className="h-6 w-6" />}
          </div>
          <div className="space-y-0.5">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed Jobs</h3>
            <p className="text-3xl font-extrabold text-slate-850 dark:text-white leading-none">
              {stats.completed}
            </p>
          </div>
        </div>

        {/* Stat Card 3: Saved Pros (Empty State) or Total Spent (Populated State) */}
        {isEmptyState ? (
          <div className="bg-white border border-slate-200/60 dark:border-slate-800 dark:bg-slate-900 rounded-2xl p-6 flex items-center gap-5 shadow-sm">
            <div className="p-4.5 bg-slate-100 text-slate-400 dark:bg-slate-800 rounded-full flex items-center justify-center shrink-0">
              <Star className="h-6 w-6" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Saved Pros</h3>
              <p className="text-3xl font-extrabold text-slate-850 dark:text-white leading-none">
                0
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200/60 dark:border-slate-800 dark:bg-slate-900 rounded-2xl p-6 flex items-center gap-5 shadow-sm">
            <div className="p-4.5 bg-slate-100 text-slate-600 dark:bg-slate-800 rounded-full flex items-center justify-center shrink-0">
              <CreditCard className="h-6 w-6" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Spent</h3>
              <p className="text-3xl font-extrabold text-slate-850 dark:text-white leading-none">
                ৳{stats.totalSpent.toLocaleString()}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* ─── Main Content Container ─── */}
      <div>
        {isEmptyState ? (
          /* ── Empty State Card ── */
          <div className="bg-white border border-slate-200/70 dark:border-slate-800 dark:bg-slate-900 rounded-3xl p-10 flex flex-col items-center justify-center text-center gap-6 shadow-sm min-h-[420px]">
            <div className="relative w-64 h-48 select-none">
              <Image 
                alt="You haven't booked anything yet" 
                src="/empty_state_illustration.png"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="space-y-2 max-w-lg">
              <h2 className="text-xl font-bold text-slate-850 dark:text-white">
                You haven&apos;t booked anything yet.
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ready to get things fixed? Browse our network of trusted professionals for your next home project, repair, or routine maintenance.
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-xl text-sm transition-all shadow-md active:scale-95"
            >
              <Search className="h-4 w-4" /> Browse Services
            </Link>
          </div>
        ) : (
          /* ── Recent Bookings Table Card ── */
          <div className="bg-white border border-slate-200/70 dark:border-slate-850 dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Recent Bookings</h2>
              <Link 
                href="/dashboard/customer/bookings"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                View All
              </Link>
            </div>

            {/* Responsive Table Wrapper */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Provider</th>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40 text-xs">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors">
                      
                      {/* Provider info column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-100 flex items-center justify-center">
                            {booking.technician?.user?.profilePhoto ? (
                              <Image
                                src={booking.technician.user.profilePhoto}
                                alt={booking.technician.user.name || 'Technician'}
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-[10px]">
                                {booking.technician?.user?.name ? (
                                  booking.technician.user.name.charAt(0).toUpperCase()
                                ) : (
                                  <User className="h-4 w-4" />
                                )}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 dark:text-white">
                              {booking.technician?.user?.name || 'Assigned Pro'}
                            </p>
                            <p className="text-[10px] text-slate-400 capitalize">
                              {booking.technician?.skills[0] || 'Technician'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Service column */}
                      <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                        {booking.service?.name}
                      </td>

                      {/* Date column */}
                      <td className="px-6 py-4 text-slate-500 font-medium">
                        {formatFigmaDate(booking.scheduledDate)}
                      </td>

                      {/* Status badge column */}
                      <td className="px-6 py-4">
                        <BookingStatusBadge status={booking.status} />
                      </td>

                      {/* Action details column */}
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/dashboard/customer/bookings/${booking.id}`}
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          View Details
                        </Link>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
