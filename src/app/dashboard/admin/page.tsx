'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
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

// ─── Types ───────────────────────────────────────────────────────────────────

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

interface PendingTech {
  id: string;
  name: string;
  initials: string;
  skill: string;
  isVerified: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatRevenue(amount: number) {
  if (amount >= 1000000) return `৳${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `৳${(amount / 1000).toFixed(1)}K`;
  return `৳${amount.toLocaleString()}`;
}

function formatFigmaDate(dateStr: string) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function getStatusBadgeClasses(status: string) {
  switch (status) {
    case 'REQUESTED': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'ACCEPTED': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'IN_PROGRESS': return 'bg-green-50 text-green-700 border-green-200';
    case 'COMPLETED': return 'bg-slate-100 text-slate-600 border-slate-200';
    case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-200';
    case 'PAID': return 'bg-purple-50 text-purple-700 border-purple-200';
    default: return 'bg-slate-100 text-slate-600 border-slate-200';
  }
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse text-left">
      <div className="h-8 w-48 bg-slate-200 rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="h-[100px] bg-slate-200 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className={`h-[100px] bg-slate-200 rounded-2xl ${idx === 2 ? 'md:col-span-2' : ''}`} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 bg-slate-200 rounded-2xl" />
        <div className="h-80 bg-slate-200 rounded-2xl" />
      </div>
      <div className="h-64 bg-slate-200 rounded-2xl" />
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [pendingTechs, setPendingTechs] = useState<PendingTech[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load live API data
  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data.data);

      const bookingsRes = await api.get('/admin/bookings', { params: { limit: 5 } });
      setRecentBookings(bookingsRes.data.data.data || []);

      const techsRes = await api.get('/technicians', { params: { includeUnverified: true, limit: 100 } });
      const allTechs: Technician[] = techsRes.data.data.data || [];
      const unverified = allTechs.filter(tech => !tech.isVerified);
      setPendingTechs(
        unverified.slice(0, 5).map(tech => ({
          id: tech.id,
          name: tech.user?.name || 'Unknown',
          initials: (tech.user?.name || 'T').split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2),
          skill: tech.skills?.[0] || 'Technician',
          isVerified: false,
        }))
      );
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
      setErrorMsg('Failed to load live data. The backend server may not be running.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Handle verify for mock mode
  const handleVerifyTechnician = async (techId: string) => {
    setErrorMsg(null);
    try {
      await api.patch(`/technicians/${techId}/verify`);
      await loadDashboardData();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMsg(e.response?.data?.message || e.message || 'Failed to verify technician.');
    }
  };

  if (isLoading || !stats) {
    return <DashboardSkeleton />;
  }

  // Calculate percentages for Bookings by Status
  const totalBookingsCount = stats.totalBookings || 1;
  const getPercentage = (count: number) => Math.round((count / totalBookingsCount) * 100);

  const statusItems = [
    { label: 'Requested', color: 'bg-amber-400', count: stats.bookingsByStatus.REQUESTED },
    { label: 'Accepted', color: 'bg-blue-500', count: stats.bookingsByStatus.ACCEPTED },
    { label: 'Paid', color: 'bg-purple-500', count: stats.bookingsByStatus.PAID },
    { label: 'In Progress', color: 'bg-green-500', count: stats.bookingsByStatus.IN_PROGRESS },
    { label: 'Completed', color: 'bg-slate-400', count: stats.bookingsByStatus.COMPLETED },
    { label: 'Cancelled', color: 'bg-red-500', count: stats.bookingsByStatus.CANCELLED },
  ];

  return (
    <div className="space-y-6 text-left">

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
          <Info className="h-4 w-4 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ─── Row 1: 4 Stats Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Users */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="space-y-1">
            <h3 className="text-[11px] font-semibold text-slate-400 tracking-wide">Total Users</h3>
            <p className="text-3xl font-extrabold text-slate-800 leading-none">
              {stats.totalUsers.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Total Technicians */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="space-y-1">
            <h3 className="text-[11px] font-semibold text-slate-400 tracking-wide">Total Technicians</h3>
            <p className="text-3xl font-extrabold text-slate-800 leading-none">
              {stats.totalTechnicians.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <UserCheck className="h-5 w-5" />
          </div>
        </div>

        {/* Verified Techs */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="space-y-1">
            <h3 className="text-[11px] font-semibold text-slate-400 tracking-wide">Verified Techs</h3>
            <p className="text-3xl font-extrabold text-slate-800 leading-none">
              {stats.totalVerifiedTechnicians.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="space-y-1">
            <h3 className="text-[11px] font-semibold text-slate-400 tracking-wide">Total Revenue</h3>
            <p className="text-3xl font-extrabold text-amber-500 leading-none">
              {formatRevenue(stats.totalRevenue)}
            </p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
            <CreditCard className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* ─── Row 2: Categories, Services, System Health ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Categories */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="space-y-1">
            <h3 className="text-[11px] font-semibold text-slate-400 tracking-wide">Total Categories</h3>
            <p className="text-3xl font-extrabold text-slate-800 leading-none">
              {stats.totalCategories}
            </p>
          </div>
          <div className="p-3 bg-slate-100 text-slate-500 rounded-xl">
            <Layers className="h-5 w-5" />
          </div>
        </div>

        {/* Total Services */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="space-y-1">
            <h3 className="text-[11px] font-semibold text-slate-400 tracking-wide">Total Services</h3>
            <p className="text-3xl font-extrabold text-slate-800 leading-none">
              {stats.totalServices}
            </p>
          </div>
          <div className="p-3 bg-slate-100 text-slate-500 rounded-xl">
            <Briefcase className="h-5 w-5" />
          </div>
        </div>

        {/* System Health - spans 2 cols on lg */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm flex items-center justify-between lg:col-span-2 hover:shadow-md transition-shadow duration-300">
          <div className="space-y-0.5">
            <h3 className="font-bold text-slate-800 text-[15px]">System Health</h3>
            <p className="text-xs text-slate-400 font-medium">All core services operational.</p>
          </div>
          {/* Animated green ring with checkmark */}
          <div className="relative h-12 w-12 shrink-0">
            <svg className="h-12 w-12" viewBox="0 0 48 48">
              {/* Background circle */}
              <circle cx="24" cy="24" r="18" fill="none" stroke="#E2E8F0" strokeWidth="3" />
              {/* Animated progress ring */}
              <circle
                cx="24" cy="24" r="18"
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="113.1"
                strokeDashoffset="0"
                className="origin-center -rotate-90"
                style={{ transformOrigin: 'center' }}
              />
            </svg>
            {/* Green checkmark in center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Row 3: Bookings by Status + Pending Verifications ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bookings by Status */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
          <div className="pb-5 mb-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-[15px]">Bookings by Status</h3>
          </div>
          <div className="space-y-4">
            {statusItems.map((item) => (
              <div key={item.label} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${item.color} shrink-0`} />
                  <span className="text-sm font-medium text-slate-600">{item.label}</span>
                </div>
                <span className="text-sm font-bold text-slate-800">
                  {getPercentage(item.count)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Verifications */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="pb-5 mb-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-[15px]">Pending Verifications</h3>
            <Link 
              href="/dashboard/admin/technicians" 
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3 flex-1">
            {pendingTechs.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-sm text-slate-400 py-10">
                No technicians pending verification.
              </div>
            ) : (
              pendingTechs.map((tech) => (
                <div 
                  key={tech.id}
                  className="border border-slate-100 rounded-2xl px-5 py-4 flex items-center justify-between gap-4 hover:border-slate-200 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
                      {tech.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{tech.name}</p>
                      <p className="text-xs text-slate-400 font-medium">
                        {tech.skill}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/dashboard/admin/technicians"
                      className="px-4 py-2 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Review
                    </Link>
                    <button
                      onClick={() => handleVerifyTechnician(tech.id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-sm"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ─── Row 4: Recent Bookings Table ─── */}
      <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 text-[15px]">Recent Bookings</h2>
          <Link 
            href="/dashboard/admin/bookings"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Technician</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-sm text-slate-400">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {booking.customer?.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {booking.technician?.user?.name || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {booking.service?.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClasses(booking.status)}`}>
                        {booking.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      ৳{booking.totalAmount.toLocaleString()}
                    </td>
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
