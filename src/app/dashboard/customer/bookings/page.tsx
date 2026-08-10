'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { getMyBookings, BookingListItem } from '../../../../lib/bookings';
import { PaginationMeta } from '../../../../lib/services';
import BookingStatusBadge from '../../../../components/BookingStatusBadge';

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

// Card skeleton for loading state
function BookingCardSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div 
          key={idx} 
          className="glass-card p-6 rounded-2xl border border-white/40 animate-pulse flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/20 dark:bg-slate-900/20"
        >
          <div className="flex-1 space-y-3 w-full">
            <div className="flex items-center gap-3">
              <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
            </div>
            <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
          <div className="h-10 w-28 bg-slate-200 dark:bg-slate-800 rounded-lg self-end md:self-center" />
        </div>
      ))}
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
  { label: 'Declined', value: 'DECLINED' },
] as const;

function CustomerBookingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse state from URL search params
  const currentStatus = searchParams.get('status') || '';
  const currentPage = Number(searchParams.get('page')) || 1;

  // Local state
  const [bookings, setBookings] = useState<BookingListItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch bookings on query parameter change
  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const response = await getMyBookings({
          status: currentStatus || undefined,
          page: currentPage,
          limit: 5, // 5 bookings per page for better UI space
        });
        setBookings(response.data);
        setMeta(response.meta);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [currentStatus, currentPage]);

  const updateQueryParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`/dashboard/customer/bookings?${params.toString()}`);
  };

  const handleFilterChange = (statusVal: string) => {
    updateQueryParams({ status: statusVal, page: '1' });
  };

  const handlePageChange = (newPage: number) => {
    updateQueryParams({ page: String(newPage) });
  };

  // Determine if there is any bookings whatsoever (unfiltered)
  const isTotallyEmpty = bookings.length === 0 && currentStatus === '' && currentPage === 1 && !isLoading;

  return (
    <div className="space-y-6 text-left">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">My Bookings</h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Track the status of your requested, accepted, or active service appointments.
        </p>
      </div>

      {/* Filter Tabs / Chips */}
      <div className="flex items-center w-full overflow-x-auto pb-2 scrollbar-none">
        <div className="flex gap-2 min-w-max">
          {STATUS_FILTERS.map((filter) => {
            const isActive = currentStatus === filter.value;
            return (
              <button
                key={filter.label}
                onClick={() => handleFilterChange(filter.value)}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 border-indigo-600 text-white shadow-md shadow-indigo-500/10'
                    : 'bg-white/40 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bookings List Display */}
      {isLoading ? (
        <BookingCardSkeleton />
      ) : isTotallyEmpty ? (
        <div className="glass-card p-12 rounded-2xl text-center border border-white/40 flex flex-col items-center justify-center gap-4 bg-white/20 dark:bg-slate-900/20">
          <Calendar className="h-12 w-12 text-indigo-500/50" />
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">No Bookings Yet</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
              You haven&apos;t booked any home services yet. Browse our directory and hire verified service professionals.
            </p>
          </div>
          <Link
            href="/services"
            className="mt-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-lg text-sm shadow-md hover:from-indigo-500 hover:to-violet-500 active:scale-95 transition-all flex items-center gap-2"
          >
            Browse Services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : bookings.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center border border-white/40 flex flex-col items-center justify-center gap-4 bg-white/20 dark:bg-slate-900/20">
          <Calendar className="h-12 w-12 text-slate-300" />
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">No Bookings Found</h3>
            <p className="text-sm text-slate-400 mt-1">
              There are no bookings matching the selected status filter.
            </p>
          </div>
          <button
            onClick={() => handleFilterChange('')}
            className="mt-2 px-5 py-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            Clear Filter
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
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

          {/* Pagination controls */}
          {meta && meta.total > meta.limit && (
            <div className="flex items-center justify-between border-t border-slate-250/20 dark:border-slate-800 pt-6 mt-6">
              <button
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-100/50 dark:hover:bg-slate-800/50 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1.5"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
              <span className="text-xs font-semibold text-slate-500">
                Page {meta.page} of {Math.ceil(meta.total / meta.limit)}
              </span>
              <button
                disabled={currentPage >= Math.ceil(meta.total / meta.limit)}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-100/50 dark:hover:bg-slate-800/50 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1.5"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CustomerBookingsPage() {
  return (
    <Suspense fallback={<BookingCardSkeleton />}>
      <CustomerBookingsContent />
    </Suspense>
  );
}
