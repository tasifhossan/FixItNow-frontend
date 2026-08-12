'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface MockBooking {
  id: string;
  customer: { name: string; avatarText: string; avatarBg: string };
  service: { name: string };
  scheduledDate: string;
  address: string;
  status: 'REQUESTED' | 'ACCEPTED' | 'PAID' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'DECLINED';
}

export default function TechnicianBookingsPage() {
  
  // Local state for bookings matching Figma mockup
  const [bookings, setBookings] = useState<MockBooking[]>([
    {
      id: 'book-1',
      customer: { name: 'Sarah Jenkins', avatarText: 'SJ', avatarBg: 'bg-blue-50 text-blue-700' },
      service: { name: 'Pipe Leak Repair' },
      scheduledDate: 'Oct 24, 2023 • 10:00 AM',
      address: '123 Maple Street, Apt 4B Seattle, WA 98101',
      status: 'REQUESTED',
    },
    {
      id: 'book-2',
      customer: { name: 'Michael Ross', avatarText: 'MR', avatarBg: 'bg-blue-100 text-blue-700' },
      service: { name: 'HVAC Maintenance' },
      scheduledDate: 'Oct 25, 2023 • 2:00 PM',
      address: '456 Oak Avenue Bellevue, WA 98004',
      status: 'PAID',
    },
    {
      id: 'book-3',
      customer: { name: 'Emma Larson', avatarText: 'EL', avatarBg: 'bg-amber-100 text-amber-800' },
      service: { name: 'Electrical Wiring' },
      scheduledDate: 'Oct 23, 2023 • 8:00 AM',
      address: '789 Pine Road, Suite 200 Redmond, WA 98052',
      status: 'IN_PROGRESS',
    },
  ]);

  const [selectedTab, setSelectedTab] = useState<'All' | 'Requested' | 'Accepted' | 'Paid' | 'In Progress' | 'Completed' | 'Cancelled' | 'Declined'>('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Tab mapping
  const tabs = [
    { label: 'All', value: 'All' },
    { label: 'Requested', value: 'Requested' },
    { label: 'Accepted', value: 'Accepted' },
    { label: 'Paid', value: 'Paid' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' },
    { label: 'Declined', value: 'Declined' }
  ];

  // Actions
  const handleAccept = (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'ACCEPTED' } : b));
    toast.success('Booking request accepted!');
  };

  const handleDecline = (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'DECLINED' } : b));
    toast.success('Booking request declined.');
  };

  const handleStartJob = (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'IN_PROGRESS' } : b));
    toast.success('Job started!');
  };

  const handleCompleteJob = (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'COMPLETED' } : b));
    toast.success('Job marked as completed successfully!');
  };

  // Filter logic
  const filteredBookings = bookings.filter(b => {
    if (selectedTab === 'All') return true;
    
    // Normalize string casing/mapping for filters
    const statusMap: Record<string, string> = {
      'REQUESTED': 'Requested',
      'ACCEPTED': 'Accepted',
      'PAID': 'Paid',
      'IN_PROGRESS': 'In Progress',
      'COMPLETED': 'Completed',
      'CANCELLED': 'Cancelled',
      'DECLINED': 'Declined'
    };
    
    return statusMap[b.status] === selectedTab;
  });

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      
      {/* ─── Page Title Header ─── */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Bookings</h1>
        <p className="text-sm text-slate-500 font-medium mt-1.5">
          Manage your assigned service requests.
        </p>
      </div>

      {/* ─── Filter Tabs ─── */}
      <div className="flex flex-wrap gap-2 pb-1 border-b border-slate-100 dark:border-slate-850">
        {tabs.map((tab) => {
          const isActive = selectedTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setSelectedTab(tab.value as typeof selectedTab)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-850 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ─── Bookings Card Grid ─── */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-16 text-center text-xs font-semibold text-slate-400">
          No bookings match the selected status filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => {
            const isRequested = booking.status === 'REQUESTED';
            const isPaid = booking.status === 'PAID';
            const isAccepted = booking.status === 'ACCEPTED';
            const isInProgress = booking.status === 'IN_PROGRESS';
            const isCompleted = booking.status === 'COMPLETED';
            const isDeclined = booking.status === 'DECLINED';
            
            return (
              <div 
                key={booking.id}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between hover:shadow-md transition-shadow duration-300 min-h-[340px]"
              >
                {/* Header Profile Row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-full ${booking.customer.avatarBg} flex items-center justify-center font-bold text-xs shrink-0 shadow-inner border border-slate-200/40`}>
                      {booking.customer.avatarText}
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-sm leading-snug">
                        {booking.customer.name}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                        {booking.service.name}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                      isRequested
                        ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50'
                        : isPaid
                        ? 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/50'
                        : isAccepted
                        ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50'
                        : isInProgress
                        ? 'bg-green-55 text-green-700 border-green-100 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/50'
                        : isCompleted
                        ? 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-350 dark:border-slate-700/55'
                        : 'bg-red-50 text-red-700 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50'
                    }`}>
                      {booking.status === 'IN_PROGRESS' ? 'In Progress' : booking.status.toLowerCase()}
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="border-t border-b border-slate-50 dark:border-slate-850 py-4 my-4 space-y-3 text-xs text-slate-500 font-semibold leading-relaxed">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>{booking.scheduledDate}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{booking.address}</span>
                  </div>
                </div>

                {/* Card CTA Actions */}
                <div className="flex items-center gap-3 w-full">
                  {isRequested && (
                    <>
                      <button
                        onClick={() => handleAccept(booking.id)}
                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm text-center"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDecline(booking.id)}
                        className="flex-1 py-3 border border-slate-200 dark:border-slate-850 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850 dark:text-slate-400 font-bold rounded-xl text-xs transition-colors text-center"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {(isPaid || isAccepted) && (
                    <button
                      onClick={() => handleStartJob(booking.id)}
                      className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition-colors shadow-sm text-center"
                    >
                      Start Job
                    </button>
                  )}

                  {isInProgress && (
                    <button
                      onClick={() => handleCompleteJob(booking.id)}
                      className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm text-center"
                    >
                      Mark Complete
                    </button>
                  )}

                  {isCompleted && (
                    <button
                      disabled
                      className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold rounded-xl text-xs text-center cursor-not-allowed"
                    >
                      Job Completed
                    </button>
                  )}

                  {isDeclined && (
                    <button
                      disabled
                      className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold rounded-xl text-xs text-center cursor-not-allowed"
                    >
                      Job Declined
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Pagination Footer ─── */}
      <div className="pt-6 flex items-center justify-center gap-2">
        <button 
          onClick={() => { if (currentPage > 1) setCurrentPage(currentPage - 1); }}
          className="p-2 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" />
        </button>
        
        <button 
          onClick={() => setCurrentPage(1)}
          className={`h-9 w-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
            currentPage === 1 ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400'
          }`}
        >
          1
        </button>
        
        <button 
          onClick={() => setCurrentPage(2)}
          className={`h-9 w-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
            currentPage === 2 ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400'
          }`}
        >
          2
        </button>

        <button 
          onClick={() => setCurrentPage(3)}
          className={`h-9 w-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
            currentPage === 3 ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400'
          }`}
        >
          3
        </button>

        <span className="text-slate-400 font-bold select-none px-1">...</span>

        <button 
          onClick={() => setCurrentPage(8)}
          className={`h-9 w-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
            currentPage === 8 ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400'
          }`}
        >
          8
        </button>

        <button 
          onClick={() => { if (currentPage < 8) setCurrentPage(currentPage + 1); }}
          className="p-2 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ChevronRight className="h-4 w-4 shrink-0" />
        </button>
      </div>

    </div>
  );
}
