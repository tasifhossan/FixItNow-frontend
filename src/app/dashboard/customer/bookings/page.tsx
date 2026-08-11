'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, MapPin, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { getMyBookings, BookingListItem } from '../../../../lib/bookings';
import { PaginationMeta } from '../../../../lib/services';
import BookingStatusBadge from '../../../../components/BookingStatusBadge';

// Helper to format date exactly like Figma (e.g., Oct 24, 2023 at 10:00 AM)
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
    return `${formattedDate} at ${formattedTime}`;
  } catch {
    return dateStr;
  }
}

// Loading state skeletons matching Figma loading state design
function BookingCardSkeleton() {
  return (
    <div className="space-y-6 text-left">
      {/* Pill Skeletons */}
      <div className="flex gap-2.5 pb-2 overflow-x-auto scrollbar-none">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="h-8 w-24 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />
        ))}
      </div>

      {/* Card Skeletons */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div 
            key={idx} 
            className="bg-white border border-slate-100 rounded-3xl p-6 animate-pulse flex items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4 flex-1">
              {/* Circle Avatar */}
              <div className="w-12 h-12 rounded-full bg-slate-200 shrink-0" />
              {/* Text lines */}
              <div className="space-y-2 flex-1">
                <div className="h-4 w-40 bg-slate-200 rounded" />
                <div className="h-3 w-48 bg-slate-100 rounded" />
                <div className="h-3 w-32 bg-slate-100 rounded" />
              </div>
            </div>
            {/* Badge / Button */}
            <div className="h-8 w-24 bg-slate-200 rounded-full" />
          </div>
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
          limit: 4, // 4 bookings per page matching mockup list size
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

  const isTotallyEmpty = bookings.length === 0 && currentStatus === '' && currentPage === 1 && !isLoading;

  return (
    <div className="space-y-6 text-left">
      
      {/* ─── Title Header ─── */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-905 dark:text-white tracking-tight">My Bookings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Track and manage your service requests.
        </p>
      </div>

      {isLoading ? (
        <BookingCardSkeleton />
      ) : (
        <>
          {/* ─── Filter Pills ─── */}
          <div className="flex items-center w-full overflow-x-auto pb-2 scrollbar-none">
            <div className="flex gap-2.5 min-w-max">
              {STATUS_FILTERS.map((filter) => {
                const isActive = currentStatus === filter.value;
                return (
                  <button
                    key={filter.label}
                    onClick={() => handleFilterChange(filter.value)}
                    className={`px-4 py-2.5 rounded-full text-xs font-bold border transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                        : 'bg-white border-slate-200/80 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─── Main Content / List display ─── */}
          {isTotallyEmpty || bookings.length === 0 ? (
            /* ── Empty State Container ── */
            <div className="bg-white border border-slate-200/70 rounded-3xl p-10 flex flex-col items-center justify-center text-center gap-6 shadow-sm min-h-[420px]">
              <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                {/* Custom calendar-x SVG icon */}
                <svg className="w-10 h-10 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <line x1="10" y1="14" x2="14" y2="18" />
                  <line x1="14" y1="14" x2="10" y2="18" />
                </svg>
              </div>
              <div className="space-y-2 max-w-md">
                <h2 className="text-lg font-bold text-slate-800">No bookings found</h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  You haven&apos;t booked anything yet. Get started by browsing our trusted professionals and booking your first service.
                </p>
              </div>
              <Link
                href="/services"
                className="px-6 py-3 bg-[#78350F] hover:bg-[#632a0a] text-white font-bold rounded-xl text-xs transition-all shadow-sm active:scale-95"
              >
                Browse Services
              </Link>
            </div>
          ) : (
            /* ── Bookings Cards List ── */
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white border border-slate-200/80 rounded-3xl p-6 hover:shadow-md transition-shadow duration-300 flex flex-col gap-5 text-left"
                >
                  {/* Top Row: Tech info + price */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3.5">
                      {/* Technician Avatar */}
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-700 font-bold text-xs shadow-sm">
                        {booking.technician?.user?.name ? (
                          booking.technician.user.name.charAt(0).toUpperCase()
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="text-base font-bold text-slate-800 dark:text-white leading-tight">
                          {booking.technician?.user?.name || 'Assigned Pro'}
                        </h3>
                        <p className="text-xs text-slate-400 capitalize font-medium">
                          {booking.technician?.skills[0] || 'Technician'} • {booking.service?.name}
                        </p>
                      </div>
                    </div>
                    {/* Status Badge + Price */}
                    <div className="flex items-center gap-3.5 shrink-0">
                      <BookingStatusBadge status={booking.status} />
                      <span className="text-lg font-black text-slate-800">
                        ৳{booking.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Row: Date, Address + View Details */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-slate-50 pt-4 gap-3.5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-2 text-xs text-slate-500 font-semibold">
                      {/* Date */}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>{formatFigmaDateTime(booking.scheduledDate)}</span>
                      </div>
                      {/* Address */}
                      <div className="flex items-center gap-2 truncate max-w-xs md:max-w-sm">
                        <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="truncate">{booking.address}</span>
                      </div>
                    </div>
                    
                    {/* Link */}
                    <Link
                      href={`/dashboard/customer/bookings/${booking.id}`}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-0.5 shrink-0 self-end sm:self-auto"
                    >
                      View Details <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                </div>
              ))}

              {/* ─── Pagination Controls ─── */}
              {meta && meta.total > meta.limit && (
                <div className="flex justify-center items-center gap-2 mt-8 pt-4">
                  {/* Previous button */}
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="p-2 border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-all"
                  >
                    <ChevronLeft className="h-4.5 w-4.5" />
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: Math.ceil(meta.total / meta.limit) }).map((_, idx) => {
                    const pageNum = idx + 1;
                    const isPageActive = currentPage === pageNum;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`h-9 w-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
                          isPageActive
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'border border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {/* Next button */}
                  <button
                    disabled={currentPage >= Math.ceil(meta.total / meta.limit)}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="p-2 border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-all"
                  >
                    <ChevronRight className="h-4.5 w-4.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function CustomerBookingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-slate-400 animate-pulse">Loading Bookings…</p>
      </div>
    }>
      <CustomerBookingsContent />
    </Suspense>
  );
}
