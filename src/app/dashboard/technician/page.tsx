'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bell, 
  CheckCircle, 
  Star, 
  MapPin, 
  Calendar,
  Briefcase,
  User,
  Check,
  CreditCard
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getAssignedBookings, BookingAssignedItem } from '@/lib/bookings';
import { getMyTechnicianProfile, updateAvailability, getWorkingHours, TechnicianProfile } from '@/lib/technicianProfile';
import BookingActionButtons from '@/components/BookingActionButtons';

// Helper to format date exactly like Figma (e.g., Oct 24, 2:00 PM)
function formatFigmaDateTime(dateStr: string) {
  try {
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return `${formattedDate}, ${formattedTime}`;
  } catch {
    return dateStr;
  }
}

function OverviewSkeleton() {
  return (
    <div className="space-y-8 animate-pulse text-left max-w-5xl mx-auto">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-4 w-96 bg-slate-100 dark:bg-slate-850 rounded-lg" />
        </div>
        <div className="h-12 w-48 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="h-28 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6" />
        ))}
      </div>

      {/* Columns Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Array.from({ length: 2 }).map((_, colIdx) => (
          <div key={colIdx} className="space-y-5">
            <div className="h-6 w-40 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, cardIdx) => (
                <div key={cardIdx} className="h-32 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl p-5" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TechnicianDashboardPage() {
  const [profile, setProfile] = useState<TechnicianProfile | null>(null);
  const [bookings, setBookings] = useState<BookingAssignedItem[]>([]);
  const [workingHoursCount, setWorkingHoursCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      const [profileData, bookingsResponse, hoursData] = await Promise.all([
        getMyTechnicianProfile(),
        getAssignedBookings({ limit: 100 }),
        getWorkingHours().catch(() => [])
      ]);
      setProfile(profileData);
      setBookings(bookingsResponse.data);
      setWorkingHoursCount(hoursData.length);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleAvailability = async () => {
    if (!profile) return;
    const previousState = profile.isAvailable;
    const newState = !previousState;

    // Optimistic UI update
    setProfile(prev => prev ? { ...prev, isAvailable: newState } : null);

    try {
      await updateAvailability(newState);
      toast.success(newState ? 'Availability turned ON' : 'Availability turned OFF');
    } catch (error: unknown) {
      console.error(error);
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message || err.message || 'Failed to update availability status');
      // Rollback
      setProfile(prev => prev ? { ...prev, isAvailable: previousState } : null);
    }
  };

  if (isLoading) {
    return <OverviewSkeleton />;
  }

  // Calculate statistics
  const pendingRequests = bookings.filter(b => b.status === 'REQUESTED');
  const activeJobs = bookings.filter(b => ['ACCEPTED', 'PAID', 'IN_PROGRESS'].includes(b.status));

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const completedThisMonth = bookings.filter(b => {
    if (b.status !== 'COMPLETED') return false;
    const d = new Date(b.scheduledDate);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  // Compute total earnings from paid, in-progress, and completed jobs (money already paid or guaranteed)
  const totalEarnings = bookings
    .filter(b => ['PAID', 'IN_PROGRESS', 'COMPLETED'].includes(b.status))
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      
      {/* ─── Top Header Section ─── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Welcome back, {profile?.user?.name || 'Technician'}!
            {profile?.isVerified && (
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white shadow-sm shrink-0">
                <Check className="h-3.5 w-3.5 stroke-[3.5]" />
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Here is what&apos;s happening with your service business today.
          </p>
        </div>

        {/* Availability Toggle Container */}
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 px-5 py-3 rounded-2xl shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <span className="text-xs font-bold text-slate-655 dark:text-slate-300">
            Available for new bookings
          </span>
          <button
            onClick={handleToggleAvailability}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none ${
              profile?.isAvailable ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-250 ease-in-out ${
                profile?.isAvailable ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Missing-hours banner prompt */}
      {workingHoursCount !== null && workingHoursCount === 0 && (
        <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-left">
          <div className="flex items-start gap-4">
            <Calendar className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400">Set your working hours</h4>
              <p className="text-xs text-amber-700/85 dark:text-amber-300/80 font-semibold leading-relaxed">
                You haven&apos;t configured your weekly work schedule. Customers won&apos;t be able to book service appointments with you until you configure your available days and timeframes.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/technician/profile"
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-sm transition-all whitespace-nowrap active:scale-95 cursor-pointer shrink-0"
          >
            Configure Hours
          </Link>
        </div>
      )}

      {/* ─── Stats Cards Grid ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        
        {/* Stat Card 1: Pending Requests */}
        <div className="bg-white border border-slate-200/60 dark:border-slate-800/60 dark:bg-slate-900 rounded-3xl p-6 flex items-center justify-between gap-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Requests</h3>
            <p className="text-4.5xl font-black text-slate-900 dark:text-white leading-none">
              {pendingRequests.length}
            </p>
          </div>
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-full group-hover:scale-110 transition-transform duration-300">
            <Bell className="h-6 w-6" />
          </div>
        </div>

        {/* Stat Card 2: Active Jobs */}
        <div className="bg-white border border-slate-200/60 dark:border-slate-800/60 dark:bg-slate-900 rounded-3xl p-6 flex items-center justify-between gap-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Jobs</h3>
            <p className="text-4.5xl font-black text-slate-900 dark:text-white leading-none">
              {activeJobs.length}
            </p>
          </div>
          <div className="p-3.5 bg-blue-50 dark:bg-blue-950/20 text-blue-600 rounded-full group-hover:scale-110 transition-transform duration-300">
            <Briefcase className="h-6 w-6" />
          </div>
        </div>

        {/* Stat Card 3: Completed This Month */}
        <div className="bg-white border border-slate-200/60 dark:border-slate-800/60 dark:bg-slate-900 rounded-3xl p-6 flex items-center justify-between gap-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed This Month</h3>
            <p className="text-4.5xl font-black text-slate-900 dark:text-white leading-none">
              {completedThisMonth}
            </p>
          </div>
          <div className="p-3.5 bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 rounded-full group-hover:scale-110 transition-transform duration-300">
            <CheckCircle className="h-6 w-6" />
          </div>
        </div>

        {/* Stat Card 4: Total Earnings (Paid/Guaranteed) */}
        <div className="bg-white border border-slate-200/60 dark:border-slate-800/60 dark:bg-slate-900 rounded-3xl p-6 flex items-center justify-between gap-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Earnings</h3>
            <p className="text-4.5xl font-black text-slate-900 dark:text-white leading-none">
              ৳{totalEarnings.toLocaleString()}
            </p>
          </div>
          <div className="p-3.5 bg-green-50 dark:bg-green-950/20 text-green-600 rounded-full group-hover:scale-110 transition-transform duration-300">
            <CreditCard className="h-6 w-6" />
          </div>
        </div>

        {/* Stat Card 5: Average Rating */}
        <div className="bg-white border border-slate-200/60 dark:border-slate-800/60 dark:bg-slate-900 rounded-3xl p-6 flex items-center justify-between gap-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Rating</h3>
            <p className="text-4.5xl font-black text-slate-900 dark:text-white leading-none">
              {profile?.averageRating ? profile.averageRating.toFixed(1) : 'N/A'}
            </p>
          </div>
          <div className="p-3.5 bg-yellow-50 dark:bg-yellow-950/20 text-amber-500 rounded-full group-hover:scale-110 transition-transform duration-300">
            <Star className="h-6 w-6 fill-current" />
          </div>
        </div>

      </div>

      {/* ─── Two-Column Dashboard Content ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Incoming Requests */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Incoming Requests
            </h2>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-10 text-center text-xs text-slate-400 font-semibold shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
              No incoming request notifications at the moment.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div 
                  key={request.id}
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-3xl p-5 hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)]"
                >
                  <div className="flex-1 space-y-3.5 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 shadow-inner border border-slate-200/40">
                        {request.customer?.name ? request.customer.name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{request.customer?.name || 'Customer'}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 truncate">{request.service?.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-2 text-xs text-slate-500 font-semibold border-t border-slate-55 dark:border-slate-850 pt-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>{formatFigmaDateTime(request.scheduledDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 truncate">
                        <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="truncate">{request.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 w-full sm:w-48 self-stretch sm:self-center">
                    <BookingActionButtons
                      bookingId={request.id}
                      status={request.status}
                      onSuccess={fetchData}
                    />
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Active Jobs */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Active Jobs
            </h2>
          </div>

          {activeJobs.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-10 text-center text-xs text-slate-400 font-semibold shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
              You have no active or accepted jobs right now.
            </div>
          ) : (
            <div className="space-y-4">
              {activeJobs.map((job) => {
                const isAccepted = job.status === 'ACCEPTED';
                const isPaid = job.status === 'PAID';
                const badgeLabel = isPaid ? 'Paid' : isAccepted ? 'Accepted' : 'In Progress';
                
                return (
                  <div 
                    key={job.id}
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-3xl p-5 hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)]"
                  >
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate">{job.service?.name}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold border capitalize ${
                          isPaid
                            ? 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/50'
                            : isAccepted
                            ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50'
                            : 'bg-green-50 text-green-700 border-green-100 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/50'
                        }`}>
                          {badgeLabel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium truncate">
                        Client: <span className="font-bold text-slate-700 dark:text-slate-300">{job.customer?.name || 'Customer'}</span> • {job.address}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="w-full">
                      <BookingActionButtons
                        bookingId={job.id}
                        status={job.status}
                        onSuccess={fetchData}
                      />
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
