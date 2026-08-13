'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  MapPin, 
  Phone, 
  ChevronLeft,
  Map,
  User
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getBookingById, Booking } from '@/lib/bookings';
import BookingActionButtons from '@/components/BookingActionButtons';

interface BookingDetailPageProps {
  params: Promise<{ id: string }>;
}

function DetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse text-left max-w-5xl mx-auto">
      {/* Back button and title */}
      <div className="space-y-4">
        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="flex justify-between items-center">
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
        </div>
      </div>

      {/* Main card skeleton */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl h-96" />
    </div>
  );
}

// Helper to format booking date
function formatBookingDate(dateStr: string) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function TechnicianBookingDetailsPage({ params }: BookingDetailPageProps) {
  const router = useRouter();
  const { id } = use(params);

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchBookingData = React.useCallback(async () => {
    try {
      const data = await getBookingById(id);
      setBooking(data);
    } catch (error: unknown) {
      console.error(error);
      const err = error as { response?: { status?: number } };
      const status = err.response?.status;
      if (status === 403) {
        toast.error('You do not have permission to view this booking');
        router.push('/dashboard/technician/bookings');
      } else if (status === 404) {
        toast.error('Booking not found');
        router.push('/dashboard/technician/bookings');
      } else {
        toast.error('Failed to load booking details');
      }
    } finally {
      setIsLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchBookingData();
  }, [fetchBookingData]);

  const handleCall = () => {
    if (booking?.customer?.phone) {
      toast.success(`Calling ${booking.customer.name} at ${booking.customer.phone}...`);
    } else {
      toast.error('Customer phone number is not available');
    }
  };

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (!booking) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-slate-500 font-semibold">Booking not found.</p>
        <Link 
          href="/dashboard/technician/bookings"
          className="text-xs text-blue-600 font-bold hover:underline mt-4 inline-block"
        >
          Back to Bookings
        </Link>
      </div>
    );
  }

  const isInProgress = booking.status === 'IN_PROGRESS';
  const paymentStatus = booking.payment?.status || (booking.status === 'COMPLETED' || booking.status === 'IN_PROGRESS' ? 'Paid' : 'Pending');

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      
      {/* ─── Back Button & Header ─── */}
      <div className="space-y-4">
        <Link 
          href="/dashboard/technician/bookings"
          className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-bold transition-colors"
        >
          <ChevronLeft className="h-4.5 w-4.5 shrink-0" />
          <span>Back to Bookings</span>
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Booking Details - #{booking.id}
          </h1>

          {/* Dynamic Status Badge */}
          <div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${
              isInProgress 
                ? 'bg-green-55 text-green-700 border-green-105 dark:bg-green-950/20 dark:text-green-450'
                : booking.status === 'COMPLETED'
                ? 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-350'
                : 'bg-amber-50 text-amber-705 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400'
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isInProgress ? 'bg-green-600' : 'bg-slate-500'}`} />
              {booking.status === 'IN_PROGRESS' ? 'In Progress' : booking.status.toLowerCase()}
            </span>
          </div>
        </div>
      </div>

      {/* ─── Main Two-Column Card Widget ─── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-850">
          
          {/* Left Column (3/5 Width): Customer info & Service details */}
          <div className="lg:col-span-3 p-6 sm:p-8 space-y-8">
            
            {/* Customer Information section */}
            <div className="space-y-4.5">
              <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Customer Information
              </h2>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl p-5 border border-slate-100/50 dark:border-slate-850/50">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 flex items-center justify-center font-black text-sm shrink-0 border border-slate-100 dark:border-slate-800">
                    {booking.customer?.name ? booking.customer.name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base truncate">
                      {booking.customer?.name || 'Customer'}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 truncate">
                      <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{booking.customer?.phone || 'No phone number'}</span>
                    </p>
                  </div>
                </div>

                {booking.customer?.phone && (
                  <button
                    onClick={handleCall}
                    className="px-4 py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-655 dark:text-slate-300 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 active:scale-95"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Call</span>
                  </button>
                )}
              </div>
            </div>

            {/* Service Details section */}
            <div className="space-y-6">
              <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-2">
                Service Details
              </h2>
              
              <div className="space-y-1.5 text-left">
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Service Type
                </div>
                <p className="font-extrabold text-slate-900 dark:text-white text-base">
                  {booking.service?.name}
                </p>
              </div>

              {booking.notes && (
                <div className="space-y-2 text-left">
                  <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Customer Notes
                  </div>
                  <div className="p-4 bg-slate-50/40 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-850 rounded-2xl">
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium italic leading-relaxed">
                      &ldquo;{booking.notes}&rdquo;
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column (2/5 Width): Schedule, Location, Payment & Complete */}
          <div className="lg:col-span-2 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            
            {/* Upper details group */}
            <div className="space-y-6">
              
              {/* Schedule Block */}
              <div className="space-y-3 text-left">
                <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Schedule
                </h3>
                <div className="flex gap-3 text-xs text-slate-700 dark:text-slate-200 font-semibold leading-relaxed">
                  <Calendar className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-800 dark:text-white">{formatBookingDate(booking.scheduledDate)}</p>
                    <p className="text-slate-450 dark:text-slate-500">
                      {new Date(booking.scheduledDate).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location Block */}
              <div className="space-y-3.5 text-left">
                <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Location
                </h3>
                <div className="flex gap-3 text-xs text-slate-700 dark:text-slate-200 font-semibold leading-relaxed">
                  <MapPin className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-800 dark:text-white">{booking.address}</p>
                  </div>
                </div>

                {/* Map Mockup Frame */}
                <div className="relative h-28 rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800 bg-slate-100 dark:bg-slate-850 flex items-center justify-center shadow-inner group">
                  {/* Mock Map Vector Graphics */}
                  <div className="absolute inset-0 opacity-40 dark:opacity-20 flex flex-col justify-around">
                    <div className="h-0.5 w-full bg-slate-350/50 rotate-[15deg]" />
                    <div className="h-0.5 w-full bg-slate-350/50 -rotate-[30deg]" />
                    <div className="w-0.5 h-full bg-slate-350/50 translate-x-[40%]" />
                    <div className="w-0.5 h-full bg-slate-350/50 translate-x-[75%]" />
                  </div>
                  
                  {/* Pin Circle */}
                  <div className="relative w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 shadow-md">
                    <MapPin className="h-4.5 w-4.5 shrink-0" />
                  </div>
                  
                  {/* View Map Overlay */}
                  <div 
                    onClick={() => toast.success('Map view dialog triggered (mock)')}
                    className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-250 cursor-pointer text-white text-[10px] font-bold tracking-wider uppercase gap-1.5"
                  >
                    <Map className="h-3.5 w-3.5 shrink-0" />
                    <span>View Map</span>
                  </div>
                  
                  <div className="absolute bottom-2 right-2 bg-white/90 dark:bg-slate-900/95 px-2 py-0.5 rounded text-[8px] font-bold text-slate-500 shadow-sm border border-slate-100 dark:border-slate-800">
                    Google Maps
                  </div>
                </div>
              </div>

              {/* Payment Box */}
              <div className="space-y-3 text-left">
                <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Payment
                </h3>
                <div className="flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-850 rounded-2xl p-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-200">
                    <span className="font-bold">Total:</span>
                    <span className="text-slate-900 dark:text-white font-extrabold text-base">
                      ৳{booking.totalAmount.toLocaleString()}
                    </span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${
                    paymentStatus.toLowerCase() === 'pending'
                      ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50'
                      : 'bg-green-50 text-green-700 border-green-100 dark:bg-green-950/20 dark:text-green-400'
                  }`}>
                    {paymentStatus}
                  </span>
                </div>
              </div>

            </div>

            {/* Complete Job Button / Reusable actions */}
            <div className="pt-6">
              <BookingActionButtons
                bookingId={booking.id}
                status={booking.status}
                onSuccess={fetchBookingData}
              />
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
