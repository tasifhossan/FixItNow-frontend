'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Wrench, 
  CheckCircle, 
  Star, 
  MapPin, 
  Calendar,
  Info,
  Clock
} from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Technician } from '@/lib/technicians';
import { BookingAssignedItem } from '@/lib/bookings';

// Helper to format date exactly like Figma (e.g., Oct 24, 10:00 AM)
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

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse text-left">
      <div className="flex justify-between items-center">
        <div className="h-8 w-64 bg-slate-200 rounded-lg" />
        <div className="h-8 w-40 bg-slate-200 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="h-24 bg-slate-200 rounded-2xl" />
        <div className="h-24 bg-slate-200 rounded-2xl" />
        <div className="h-24 bg-slate-200 rounded-2xl" />
        <div className="h-24 bg-slate-200 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-96 bg-slate-200 rounded-3xl" />
        <div className="h-96 bg-slate-200 rounded-3xl" />
      </div>
    </div>
  );
}

export default function TechnicianDashboardPage() {
  const { user } = useAuth();
  
  // Local state
  const [profile, setProfile] = useState<Technician | null>(null);
  const [bookings, setBookings] = useState<BookingAssignedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      // Fetch technician profile info
      const profileRes = await api.get('/technicians/me/profile');
      setProfile(profileRes.data.data);

      // Fetch bookings assigned to me (limit=100 for stats compilation)
      const bookingsRes = await api.get('/bookings/assigned-to-me', {
        params: { limit: 100 }
      });
      setBookings(bookingsRes.data.data.data || bookingsRes.data.data || []);
    } catch (err) {
      console.error('Failed to load technician dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handlers
  const handleToggleAvailability = async () => {
    if (!profile) return;
    const newIsAvailable = !profile.isAvailable;
    
    // Optimistic state updates
    setProfile({
      ...profile,
      isAvailable: newIsAvailable
    });

    try {
      await api.patch('/technicians/me/availability', {
        isAvailable: newIsAvailable
      });
    } catch (err) {
      console.error('Failed to toggle availability:', err);
      // Revert on error
      setProfile({
        ...profile,
        isAvailable: !newIsAvailable
      });
    }
  };

  const handleRespondToBooking = async (bookingId: string, action: 'ACCEPT' | 'DECLINE') => {
    setActionError(null);
    try {
      await api.patch(`/bookings/${bookingId}/respond`, { action });
      await fetchDashboardData(); // Re-fetch counts and lists
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setActionError(e.response?.data?.message || e.message || 'Failed to respond to booking.');
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: 'IN_PROGRESS' | 'COMPLETED') => {
    setActionError(null);
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status });
      await fetchDashboardData(); // Re-fetch counts and lists
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setActionError(e.response?.data?.message || e.message || 'Failed to update booking status.');
    }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Calculate counts client-side for stats cards
  const pendingRequests = bookings.filter((b) => b.status === 'REQUESTED');
  const activeJobs = bookings.filter((b) => ['ACCEPTED', 'IN_PROGRESS', 'PAID'].includes(b.status));
  const completedJobs = bookings.filter((b) => b.status === 'COMPLETED');

  // Filter lists for main columns
  const incomingRequests = bookings.filter((b) => b.status === 'REQUESTED');
  const ongoingJobs = bookings.filter((b) => ['ACCEPTED', 'IN_PROGRESS'].includes(b.status));

  return (
    <div className="space-y-8 text-left">
      
      {/* ─── Unverified Alert Banner ─── */}
      {profile && !profile.isVerified && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4.5 flex items-start gap-3 text-xs text-amber-800 shadow-sm leading-relaxed">
          <Info className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <span className="font-bold">Verification Pending:</span> Your technician profile is awaiting admin approval. You will appear in public service catalogs and search listings once verified.
          </div>
        </div>
      )}

      {/* ─── Top Header Section ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Welcome, {user?.name.split(' ')[0] || 'Technician'}
            {profile?.isVerified && (
              <svg className="h-6 w-6 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            )}
          </h1>
          <p className="text-sm text-slate-500">
            Here&apos;s what&apos;s happening with your services today.
          </p>
        </div>

        {/* Availability Toggle Container */}
        <div className="flex items-center gap-3.5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 px-5 py-3 rounded-2xl shrink-0 shadow-sm">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-350">
            Available for new bookings
          </span>
          <button
            onClick={handleToggleAvailability}
            className={`relative inline-flex h-6.5 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              profile?.isAvailable ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5.5 w-5.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                profile?.isAvailable ? 'translate-x-5.5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* ─── Stats Cards Grid ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Stat Card 1: Pending Requests */}
        <div className="bg-white border border-slate-200/60 dark:border-slate-800 dark:bg-slate-900 rounded-2xl p-6 flex items-center justify-between gap-5 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Requests</h3>
            <p className="text-3xl font-extrabold text-slate-850 dark:text-white leading-none">
              {pendingRequests.length}
            </p>
          </div>
          <div className="p-3.5 bg-amber-55/60 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-2xl">
            <Bell className="h-5.5 w-5.5" />
          </div>
        </div>

        {/* Stat Card 2: Active Jobs */}
        <div className="bg-white border border-slate-200/60 dark:border-slate-800 dark:bg-slate-900 rounded-2xl p-6 flex items-center justify-between gap-5 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Jobs</h3>
            <p className="text-3xl font-extrabold text-slate-850 dark:text-white leading-none">
              {activeJobs.length}
            </p>
          </div>
          <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl">
            <Wrench className="h-5.5 w-5.5" />
          </div>
        </div>

        {/* Stat Card 3: Completed Jobs */}
        <div className="bg-white border border-slate-200/60 dark:border-slate-800 dark:bg-slate-900 rounded-2xl p-6 flex items-center justify-between gap-5 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed (Month)</h3>
            <p className="text-3xl font-extrabold text-slate-850 dark:text-white leading-none">
              {completedJobs.length}
            </p>
          </div>
          <div className="p-3.5 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 rounded-2xl">
            <CheckCircle className="h-5.5 w-5.5" />
          </div>
        </div>

        {/* Stat Card 4: Avg Rating */}
        <div className="bg-white border border-slate-200/60 dark:border-slate-800 dark:bg-slate-900 rounded-2xl p-6 flex items-center justify-between gap-5 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Rating</h3>
            <p className="text-3xl font-extrabold text-slate-850 dark:text-white leading-none">
              {profile?.averageRating ? `${profile.averageRating.toFixed(1)} ` : '0.0 '}
              <span className="text-xs text-slate-400 font-semibold">/ 5.0</span>
            </p>
          </div>
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-2xl">
            <Star className="h-5.5 w-5.5 fill-current" />
          </div>
        </div>

      </div>

      {/* Action alert display */}
      {actionError && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
          <Info className="h-4.5 w-4.5 shrink-0 text-red-650" />
          <span>{actionError}</span>
        </div>
      )}

      {/* ─── Two-Column Dashboard Content ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Requests and Jobs (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Incoming Requests Card List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                🔔 Incoming Requests
              </h2>
              {incomingRequests.length > 0 && (
                <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
                  {incomingRequests.length} New
                </span>
              )}
            </div>

            {incomingRequests.length === 0 ? (
              <div className="bg-white border border-slate-200/60 dark:border-slate-800 dark:bg-slate-900 rounded-3xl p-8 text-center text-xs text-slate-400">
                No incoming request notifications at the moment.
              </div>
            ) : (
              <div className="space-y-4">
                {incomingRequests.map((request) => (
                  <div 
                    key={request.id}
                    className="bg-white border border-slate-200/80 rounded-3xl p-5 hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div className="flex-1 space-y-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 border border-slate-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0 shadow-inner">
                          {request.customer?.name?.charAt(0).toUpperCase() || 'C'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-850 dark:text-white">{request.customer?.name}</p>
                          <p className="text-[10px] font-bold text-blue-600 capitalize">{request.service?.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-2 text-xs text-slate-500 font-semibold border-t border-slate-50 pt-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                          <span>{formatFigmaDateTime(request.scheduledDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 truncate max-w-xs sm:max-w-sm">
                          <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                          <span className="truncate">{request.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                      <button
                        onClick={() => handleRespondToBooking(request.id, 'ACCEPT')}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRespondToBooking(request.id, 'DECLINE')}
                        className="px-4 py-2.5 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors"
                      >
                        Decline
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Jobs Card List */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              🔧 Active Jobs
            </h2>

            {ongoingJobs.length === 0 ? (
              <div className="bg-white border border-slate-200/60 dark:border-slate-800 dark:bg-slate-900 rounded-3xl p-8 text-center text-xs text-slate-400">
                You have no active or accepted jobs right now.
              </div>
            ) : (
              <div className="space-y-4">
                {ongoingJobs.map((job) => {
                  const isAccepted = job.status === 'ACCEPTED';
                  return (
                    <div 
                      key={job.id}
                      className="bg-white border border-slate-200/80 rounded-3xl p-5 hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2.5">
                          <h3 className="font-bold text-slate-850 dark:text-white">{job.service?.name}</h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            isAccepted
                              ? 'bg-blue-50 text-blue-700 border-blue-100'
                              : 'bg-green-50 text-green-700 border-green-100'
                          }`}>
                            {isAccepted ? 'Accepted' : 'In Progress'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-450 font-medium">
                          Client: <span className="font-bold text-slate-600">{job.customer?.name}</span> • {formatFigmaDateTime(job.scheduledDate)}
                        </p>
                      </div>

                      {/* CTA Trigger */}
                      <div className="shrink-0 self-end md:self-center">
                        {isAccepted ? (
                          <button
                            onClick={() => handleUpdateBookingStatus(job.id, 'IN_PROGRESS')}
                            className="px-4.5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
                          >
                            Start Job
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateBookingStatus(job.id, 'COMPLETED')}
                            className="px-4.5 py-2.5 bg-green-600 hover:bg-green-750 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
                          >
                            Complete Job
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Profile Snapshot (1/3 width) */}
        <div>
          <div className="bg-white border border-slate-200/70 dark:border-slate-800 dark:bg-slate-900 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="border-b border-slate-50 pb-5">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Profile Snapshot</h3>
            </div>

            {/* Avatar & Rate Row */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shadow-inner shrink-0 border border-slate-100">
                {user?.name?.charAt(0).toUpperCase() || 'T'}
              </div>
              <div className="space-y-1 min-w-0">
                <p className="font-bold text-slate-850 dark:text-white text-base truncate">{user?.name}</p>
                <div className="flex items-center gap-1.5 text-xs text-blue-600 font-bold">
                  <Clock className="h-4 w-4 shrink-0 text-blue-500" />
                  <span>৳{profile?.hourlyRate || '0'}/hr</span>
                </div>
              </div>
            </div>

            {/* Bio Description */}
            <div className="space-y-1.5 text-xs leading-relaxed">
              <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Bio Description</p>
              <p className="text-slate-500">
                {profile?.bio || 'No profile bio description added yet. Edit your details inside Profile & Skills.'}
              </p>
            </div>

            {/* Skills Badges */}
            <div className="space-y-3 pt-2">
              <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Skills</p>
              {profile?.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span 
                      key={skill}
                      className="px-3.5 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100 capitalize"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No skills listed.</p>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
