'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  UserCheck, 
  ShieldCheck, 
  CreditCard, 
  Briefcase, 
  CheckCircle2, 
  Info,
  Layers
} from 'lucide-react';
import api from '@/lib/api';
import { Technician } from '@/lib/technicians';

interface AdminStats {
  totalUsers: number;
  totalCustomers: number;
  totalTechnicians: number;
  totalBookings: number;
  bookingsByStatus: {
    REQUESTED: number;
    ACCEPTED: number;
    DECLINED: number;
    PAID: number;
    IN_PROGRESS: number;
    COMPLETED: number;
    CANCELLED: number;
  };
  totalRevenue: number;
  totalVerifiedTechnicians: number;
  totalCategories: number;
  totalServices: number;
}

interface RecentBooking {
  id: string;
  customer: { name: string };
  technician: { user: { name: string } };
  service: { name: string };
  status: string;
  totalAmount: number;
  scheduledDate: string;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse text-left">
      <div className="h-8 w-48 bg-slate-200 rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="h-24 bg-slate-200 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="h-80 bg-slate-200 rounded-3xl" />
        <div className="lg:col-span-2 h-80 bg-slate-200 rounded-3xl" />
      </div>
    </div>
  );
}

// Helper to format revenue (e.g. 2400000 -> 2.4M, 1500 -> 1.5K)
function formatRevenue(amount: number) {
  if (amount >= 1000000) {
    return `৳${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `৳${(amount / 1000).toFixed(1)}K`;
  }
  return `৳${amount.toLocaleString()}`;
}

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

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [pendingTechs, setPendingTechs] = useState<Technician[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchAdminData = async () => {
    try {
      // 1. Fetch dashboard stats
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data.data);

      // 2. Fetch recent bookings with complete amount & scheduled date
      const bookingsRes = await api.get('/admin/bookings', {
        params: { limit: 5 }
      });
      setRecentBookings(bookingsRes.data.data.data || []);

      // 3. Fetch technicians and filter for unverified ones
      const techsRes = await api.get('/technicians', {
        params: { includeUnverified: true, limit: 100 }
      });
      const allTechs: Technician[] = techsRes.data.data.data || [];
      const unverified = allTechs.filter(tech => !tech.isVerified);
      setPendingTechs(unverified.slice(0, 5)); // show top 5 pending
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerifyTechnician = async (techId: string) => {
    setErrorMsg(null);
    try {
      await api.patch(`/technicians/${techId}/verify`);
      await fetchAdminData(); // refresh data
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMsg(e.response?.data?.message || e.message || 'Failed to verify technician.');
    }
  };

  if (isLoading || !stats) {
    return <DashboardSkeleton />;
  }

  // Calculate percentages for Bookings by Status
  const totalBookingsCount = stats.totalBookings || 1; // avoid division by zero
  const getPercentage = (count: number) => {
    return Math.round((count / totalBookingsCount) * 100);
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* ─── Header ─── */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Admin Dashboard</h1>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
          <Info className="h-4.5 w-4.5 shrink-0 text-red-650" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ─── Overview Stats Cards Grid ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Users */}
        <div className="bg-white border border-slate-200/60 dark:border-slate-800 dark:bg-slate-900 rounded-2xl p-6 flex items-center justify-between gap-5 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Users</h3>
            <p className="text-3xl font-extrabold text-slate-850 dark:text-white leading-none">
              {stats.totalUsers.toLocaleString()}
            </p>
          </div>
          <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl">
            <Users className="h-5.5 w-5.5" />
          </div>
        </div>

        {/* Total Technicians */}
        <div className="bg-white border border-slate-200/60 dark:border-slate-800 dark:bg-slate-900 rounded-2xl p-6 flex items-center justify-between gap-5 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Technicians</h3>
            <p className="text-3xl font-extrabold text-slate-850 dark:text-white leading-none">
              {stats.totalTechnicians.toLocaleString()}
            </p>
          </div>
          <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl">
            <UserCheck className="h-5.5 w-5.5" />
          </div>
        </div>

        {/* Verified Techs */}
        <div className="bg-white border border-slate-200/60 dark:border-slate-800 dark:bg-slate-900 rounded-2xl p-6 flex items-center justify-between gap-5 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verified Techs</h3>
            <p className="text-3xl font-extrabold text-slate-850 dark:text-white leading-none">
              {stats.totalVerifiedTechnicians.toLocaleString()}
            </p>
          </div>
          <div className="p-3.5 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 rounded-2xl">
            <ShieldCheck className="h-5.5 w-5.5" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white border border-slate-200/60 dark:border-slate-800 dark:bg-slate-900 rounded-2xl p-6 flex items-center justify-between gap-5 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Revenue</h3>
            <p className="text-3xl font-extrabold text-amber-500 leading-none">
              {formatRevenue(stats.totalRevenue)}
            </p>
          </div>
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-2xl">
            <CreditCard className="h-5.5 w-5.5" />
          </div>
        </div>

      </div>

      {/* Row 2: Categories, Services, System Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        {/* Total Categories */}
        <div className="bg-white border border-slate-200/60 dark:border-slate-800 dark:bg-slate-900 rounded-2xl p-6 flex items-center justify-between gap-5 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Categories</h3>
            <p className="text-3xl font-extrabold text-slate-850 dark:text-white leading-none">
              {stats.totalCategories}
            </p>
          </div>
          <div className="p-3.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl">
            <Layers className="h-5.5 w-5.5" />
          </div>
        </div>

        {/* Total Services */}
        <div className="bg-white border border-slate-200/60 dark:border-slate-800 dark:bg-slate-900 rounded-2xl p-6 flex items-center justify-between gap-5 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Services</h3>
            <p className="text-3xl font-extrabold text-slate-850 dark:text-white leading-none">
              {stats.totalServices}
            </p>
          </div>
          <div className="p-3.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl">
            <Briefcase className="h-5.5 w-5.5" />
          </div>
        </div>

        {/* System Health Card (Double Width) */}
        <div className="bg-white border border-slate-200/60 dark:border-slate-800 dark:bg-slate-900 rounded-2xl p-6 shadow-sm flex items-center justify-between gap-5 md:col-span-2">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">System Health</h3>
            <p className="text-xs text-slate-450 font-medium">All core services operational.</p>
          </div>
          <div className="text-green-500 shrink-0">
            <CheckCircle2 className="h-10 w-10 text-green-500" strokeWidth={1.5} />
          </div>
        </div>

      </div>

      {/* ─── Middle Section: Bookings by Status & Pending Verifications ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Bookings by Status (1/3 Width) */}
        <div className="bg-white border border-slate-200/70 dark:border-slate-800 dark:bg-slate-900 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-50 pb-5">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Bookings by Status</h3>
          </div>
          <div className="space-y-4">
            
            {/* Status Rows */}
            {[
              { label: 'Requested', color: 'bg-amber-500', count: stats.bookingsByStatus.REQUESTED },
              { label: 'Accepted', color: 'bg-blue-500', count: stats.bookingsByStatus.ACCEPTED },
              { label: 'Paid', color: 'bg-purple-500', count: stats.bookingsByStatus.PAID },
              { label: 'In Progress', color: 'bg-green-500', count: stats.bookingsByStatus.IN_PROGRESS },
              { label: 'Completed', color: 'bg-slate-400', count: stats.bookingsByStatus.COMPLETED },
              { label: 'Cancelled', color: 'bg-red-500', count: stats.bookingsByStatus.CANCELLED },
            ].map((status) => (
              <div key={status.label} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${status.color}`} />
                  <span className="font-semibold text-slate-600 dark:text-slate-300">{status.label}</span>
                </div>
                <span className="font-extrabold text-slate-850 dark:text-white">
                  {getPercentage(status.count)}%
                </span>
              </div>
            ))}

          </div>
        </div>

        {/* Pending Verifications (2/3 Width) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/70 dark:border-slate-800 dark:bg-slate-900 rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-6">
          <div className="border-b border-slate-50 pb-5 flex justify-between items-center">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Pending Verifications</h3>
            <Link 
              href="/dashboard/admin/technicians" 
              className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4 flex-1">
            {pendingTechs.length === 0 ? (
              <div className="text-center text-xs text-slate-400 py-10">
                No technicians pending verification.
              </div>
            ) : (
              <div className="space-y-3.5">
                {pendingTechs.map((tech) => (
                  <div 
                    key={tech.id}
                    className="border border-slate-100 rounded-2xl px-5 py-4 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0 shadow-inner">
                        {tech.user?.name ? tech.user.name.charAt(0).toUpperCase() : 'T'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-850 dark:text-white">{tech.user?.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 capitalize">
                          {tech.skills[0] || 'Technician'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/admin/technicians`}
                        className="px-4 py-2 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors"
                      >
                        Review
                      </Link>
                      <button
                        onClick={() => handleVerifyTechnician(tech.id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ─── Bottom Section: Recent Bookings Table ─── */}
      <div className="bg-white border border-slate-200/70 dark:border-slate-850 dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Recent Bookings</h2>
          <Link 
            href="/dashboard/admin/bookings"
            className="text-xs font-bold text-blue-600 hover:text-blue-750 transition-colors"
          >
            View All
          </Link>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Technician</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40 text-xs">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-xs text-slate-400">
                    No bookings found in the system.
                  </td>
                </tr>
              ) : (
                recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors">
                    
                    {/* Customer */}
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">
                      {booking.customer?.name}
                    </td>

                    {/* Technician */}
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {booking.technician?.user?.name || 'Unassigned'}
                    </td>

                    {/* Service */}
                    <td className="px-6 py-4 text-slate-650 dark:text-slate-350">
                      {booking.service?.name}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        booking.status === 'REQUESTED' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        booking.status === 'ACCEPTED' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        booking.status === 'IN_PROGRESS' ? 'bg-green-50 text-green-700 border-green-100' :
                        booking.status === 'COMPLETED' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                        'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        {booking.status}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 font-black text-slate-800">
                      ৳{booking.totalAmount.toLocaleString()}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {formatFigmaDate(booking.scheduledDate)}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
