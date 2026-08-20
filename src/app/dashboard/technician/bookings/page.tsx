'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, MapPin, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { getAssignedBookings, BookingAssignedItem } from '@/lib/bookings';
import { PaginationMeta } from '@/lib/services';
import BookingActionButtons from '@/components/BookingActionButtons';

// Helper to format date exactly like Figma (e.g., Oct 24, 2023 • 10:00 AM)
function formatFigmaDateTime(dateStr: string) {
  try {
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return `${formattedDate} • ${formattedTime}`;
  } catch {
    return dateStr;
  }
}

// Loading state skeletons matching Figma loading state design
function BookingsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse text-left max-w-5xl mx-auto">
      {/* Title skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-4 w-80 bg-slate-100 dark:bg-slate-850 rounded-lg" />
      </div>

      {/* Filter pills skeleton */}
      <div className="flex gap-2.5 pb-1 overflow-x-auto scrollbar-none">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="h-8 w-24 bg-slate-100 dark:bg-slate-800 rounded-full shrink-0" />
        ))}
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="bg-slate-100 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl p-6 min-h-[340px]" />
        ))}
      </div>
    </div>
  );
}

const STATUS_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Requested', value: 'REQUESTED' },
  { label: 'Accepted', value: 'ACCEPTED' },
  { label: 'Paid', value: 'PAID' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
  { label: 'Declined', value: 'DECLINED' }
] as const;

function TechnicianBookingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse state from URL search params
  const currentStatus = searchParams.get('status') || '';
  const currentPage = Number(searchParams.get('page')) || 1;

  // Local state
  const [bookings, setBookings] = useState<BookingAssignedItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch bookings on query parameter change
  const fetchBookings = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAssignedBookings({
        status: currentStatus || undefined,
        page: currentPage,
        limit: 6, // 6 bookings per page for a 3-column layout
      });
      setBookings(response.data);
      setMeta(response.meta);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentStatus, currentPage]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateQueryParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`/dashboard/technician/bookings?${params.toString()}`);
  };

  const handleFilterChange = (statusVal: string) => {
    updateQueryParams({ status: statusVal, page: '1' });
  };

  const handlePageChange = (newPage: number) => {
    updateQueryParams({ page: String(newPage) });
  };

  if (isLoading) {
    return <BookingsSkeleton />;
  }

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
        {STATUS_FILTERS.map((tab) => {
          const isActive = currentStatus === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => handleFilterChange(tab.value)}
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
      {bookings.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-16 text-center text-xs font-semibold text-slate-400">
          No bookings match the selected status filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => {
            const isRequested = booking.status === 'REQUESTED';
            const isPaid = booking.status === 'PAID';
            const isAccepted = booking.status === 'ACCEPTED';
            const isInProgress = booking.status === 'IN_PROGRESS';
            const isCompleted = booking.status === 'COMPLETED';
            
            return (
              <div 
                key={booking.id}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between hover:shadow-md transition-shadow duration-300 min-h-[340px]"
              >
                {/* Header Profile Row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-755 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 shadow-inner border border-slate-200/40">
                      {booking.customer?.name ? booking.customer.name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-sm leading-snug truncate">
                        {booking.customer?.name || 'Customer'}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider truncate">
                        {booking.service?.name}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0">
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
                        ? 'bg-slate-100 text-slate-705 border-slate-200 dark:bg-slate-800 dark:text-slate-350 dark:border-slate-700/55'
                        : 'bg-red-50 text-red-700 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50'
                    }`}>
                      {booking.status === 'IN_PROGRESS' ? 'In Progress' : booking.status.toLowerCase()}
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="border-t border-b border-slate-50 dark:border-slate-850 py-4 my-4 space-y-3 text-xs text-slate-505 font-semibold leading-relaxed min-w-0">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>{formatFigmaDateTime(booking.scheduledDate)}</span>
                  </div>
                  <div className="flex items-start gap-2 truncate">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <span className="truncate">{booking.address}</span>
                  </div>
                </div>

                {/* Card CTA Actions */}
                <div className="w-full">
                  <BookingActionButtons
                    bookingId={booking.id}
                    status={booking.status}
                    onSuccess={fetchBookings}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Pagination Footer ─── */}
      {meta && meta.total > meta.limit && (
        <div className="pt-6 flex items-center justify-center gap-2">
          <button 
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="p-2 border border-slate-200 dark:border-slate-850 hover:bg-slate-55 dark:hover:bg-slate-850 rounded-lg text-slate-400 hover:text-slate-600 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="h-4.5 w-4.5 shrink-0" />
          </button>
          
          {Array.from({ length: Math.ceil(meta.total / meta.limit) }).map((_, idx) => {
            const pageNum = idx + 1;
            const isPageActive = currentPage === pageNum;
            return (
              <button 
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`h-9 w-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                  isPageActive 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'border border-slate-200 dark:border-slate-850 hover:bg-slate-55 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button 
            disabled={currentPage >= Math.ceil(meta.total / meta.limit)}
            onClick={() => handlePageChange(currentPage + 1)}
            className="p-2 border border-slate-200 dark:border-slate-850 hover:bg-slate-55 dark:hover:bg-slate-850 rounded-lg text-slate-400 hover:text-slate-655 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ChevronRight className="h-4.5 w-4.5 shrink-0" />
          </button>
        </div>
      )}

    </div>
  );
}

export default function TechnicianBookingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-slate-400 animate-pulse">Loading Bookings…</p>
      </div>
    }>
      <TechnicianBookingsContent />
    </Suspense>
  );
}
