'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  CheckCircle, 
  Star, 
  MapPin, 
  Calendar,
  Briefcase,
  User,
  Check
} from 'lucide-react';

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

export default function TechnicianDashboardPage() {
  
  // Local state for Mock Profile matching Figma screenshot (Mike Johnson)
  const [profile, setProfile] = useState({
    name: 'Mike Johnson',
    isAvailable: true,
    isVerified: true,
    averageRating: 4.9,
    hourlyRate: 65,
    bio: 'Professional home services technician with over 8 years of experience. Specialized in complex plumbing, pipe repairs, heating systems, and electrical installations.',
    skills: ['Plumbing', 'Electrical', 'HVAC'],
  });

  // Local state for Stats Counts matching Figma screenshot
  const [stats, setStats] = useState({
    pendingRequests: 12,
    activeJobs: 3,
    completedThisMonth: 24,
  });

  // Local state for Incoming Requests list matching Figma screenshot
  const [incomingRequests, setIncomingRequests] = useState([
    {
      id: 'req-1',
      customer: { name: 'Sarah Jenkins' },
      service: { name: 'Pipe Leak Fix' },
      scheduledDate: '2026-10-24T14:00:00Z',
      address: '123 Maple St.',
    },
    {
      id: 'req-2',
      customer: { name: 'David Chen' },
      service: { name: 'HVAC Inspection' },
      scheduledDate: '2026-10-25T09:00:00Z',
      address: '456 Oak Ave.',
    },
  ]);

  // Local state for Active Jobs list matching Figma screenshot
  const [ongoingJobs, setOngoingJobs] = useState([
    {
      id: 'job-1',
      service: { name: 'Water Heater Repair' },
      customer: { name: 'Robert Taylor' },
      scheduledDate: '2026-10-26T10:00:00Z',
      address: '789 Pine Blvd.',
      status: 'PAID', // Shows "Paid" status and "Start Job" button
    },
    {
      id: 'job-2',
      service: { name: 'Electrical Panel Upgrade' },
      customer: { name: 'Emily White' },
      scheduledDate: '2026-10-27T11:00:00Z',
      address: '321 Elm St.',
      status: 'IN_PROGRESS', // Shows "In Progress" status and "Mark Complete" button
    },
  ]);

  // Toggle availability state handler
  const handleToggleAvailability = () => {
    setProfile((prev) => ({
      ...prev,
      isAvailable: !prev.isAvailable,
    }));
  };

  // Accept/Decline request handler
  const handleRespondToBooking = (bookingId: string, action: 'ACCEPT' | 'DECLINE') => {
    const target = incomingRequests.find((r) => r.id === bookingId);
    if (!target) return;

    if (action === 'ACCEPT') {
      // Add to active jobs list with "ACCEPTED" status (acts as Paid / Accepted)
      setOngoingJobs((prev) => [
        ...prev,
        {
          id: target.id,
          service: target.service,
          customer: target.customer,
          scheduledDate: target.scheduledDate,
          address: target.address,
          status: 'ACCEPTED',
        },
      ]);
      // Update statistics
      setStats((prev) => ({
        ...prev,
        pendingRequests: Math.max(0, prev.pendingRequests - 1),
        activeJobs: prev.activeJobs + 1,
      }));
    } else {
      // Decline: just decrement pending requests count
      setStats((prev) => ({
        ...prev,
        pendingRequests: Math.max(0, prev.pendingRequests - 1),
      }));
    }

    // Remove from the list
    setIncomingRequests((prev) => prev.filter((r) => r.id !== bookingId));
  };

  // Start / Complete active job status handler
  const handleUpdateBookingStatus = (bookingId: string, newStatus: 'IN_PROGRESS' | 'COMPLETED') => {
    if (newStatus === 'IN_PROGRESS') {
      setOngoingJobs((prev) =>
        prev.map((job) => (job.id === bookingId ? { ...job, status: 'IN_PROGRESS' } : job))
      );
    } else if (newStatus === 'COMPLETED') {
      // Complete: remove from list and update stats
      setOngoingJobs((prev) => prev.filter((job) => job.id !== bookingId));
      setStats((prev) => ({
        ...prev,
        activeJobs: Math.max(0, prev.activeJobs - 1),
        completedThisMonth: prev.completedThisMonth + 1,
      }));
    }
  };

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      
      {/* ─── Top Header Section ─── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Welcome back, {profile.name}!
            {profile.isVerified && (
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
          <span className="text-xs font-bold text-slate-650 dark:text-slate-300">
            Available for new bookings
          </span>
          <button
            onClick={handleToggleAvailability}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none ${
              profile.isAvailable ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-250 ease-in-out ${
                profile.isAvailable ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* ─── Stats Cards Grid ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Stat Card 1: Pending Requests */}
        <div className="bg-white border border-slate-200/60 dark:border-slate-800/60 dark:bg-slate-900 rounded-3xl p-6 flex items-center justify-between gap-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Requests</h3>
            <p className="text-4.5xl font-black text-slate-900 dark:text-white leading-none">
              {stats.pendingRequests}
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
              {stats.activeJobs}
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
              {stats.completedThisMonth}
            </p>
          </div>
          <div className="p-3.5 bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 rounded-full group-hover:scale-110 transition-transform duration-300">
            <CheckCircle className="h-6 w-6" />
          </div>
        </div>

        {/* Stat Card 4: Average Rating */}
        <div className="bg-white border border-slate-200/60 dark:border-slate-800/60 dark:bg-slate-900 rounded-3xl p-6 flex items-center justify-between gap-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Rating</h3>
            <p className="text-4.5xl font-black text-slate-900 dark:text-white leading-none">
              {profile.averageRating.toFixed(1)}
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

          {incomingRequests.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-10 text-center text-xs text-slate-400 font-semibold shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
              No incoming request notifications at the moment.
            </div>
          ) : (
            <div className="space-y-4">
              {incomingRequests.map((request) => (
                <div 
                  key={request.id}
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-3xl p-5 hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)]"
                >
                  <div className="flex-1 space-y-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0 shadow-inner">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{request.customer.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{request.service.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-2 text-xs text-slate-500 font-semibold border-t border-slate-50 dark:border-slate-850 pt-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>{formatFigmaDateTime(request.scheduledDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>{request.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-stretch gap-2 shrink-0 w-full sm:w-auto self-stretch sm:self-center">
                    <button
                      onClick={() => handleRespondToBooking(request.id, 'ACCEPT')}
                      className="flex-1 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm text-center"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRespondToBooking(request.id, 'DECLINE')}
                      className="flex-1 px-5 py-2.5 border border-slate-200 dark:border-slate-850 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850 dark:text-slate-400 rounded-xl text-xs font-bold transition-colors text-center"
                    >
                      Decline
                    </button>
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

          {ongoingJobs.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-10 text-center text-xs text-slate-400 font-semibold shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
              You have no active or accepted jobs right now.
            </div>
          ) : (
            <div className="space-y-4">
              {ongoingJobs.map((job) => {
                const isAccepted = job.status === 'ACCEPTED' || job.status === 'PAID';
                const badgeLabel = job.status === 'PAID' ? 'Paid' : isAccepted ? 'Accepted' : 'In Progress';
                
                return (
                  <div 
                    key={job.id}
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-3xl p-5 hover:shadow-md transition-all duration-300 flex flex-row justify-between items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)]"
                  >
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate">{job.service.name}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold border capitalize ${
                          job.status === 'PAID'
                            ? 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/50'
                            : isAccepted
                            ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50'
                            : 'bg-green-50 text-green-700 border-green-100 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/50'
                        }`}>
                          {badgeLabel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium truncate">
                        Client: <span className="font-bold text-slate-700 dark:text-slate-300">{job.customer.name}</span> • {job.address}
                      </p>
                    </div>

                    {/* Button Actions */}
                    <div className="shrink-0">
                      {isAccepted ? (
                        <button
                          onClick={() => handleUpdateBookingStatus(job.id, 'IN_PROGRESS')}
                          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition-colors shadow-sm active:scale-95"
                        >
                          Start Job
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateBookingStatus(job.id, 'COMPLETED')}
                          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition-colors shadow-sm active:scale-95"
                        >
                          Mark Complete
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

    </div>
  );
}
