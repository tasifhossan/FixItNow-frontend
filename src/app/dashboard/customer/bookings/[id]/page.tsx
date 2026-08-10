'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter, notFound } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ChevronLeft, Calendar, MapPin, Wrench, FileText, Star, CreditCard, MessageSquare, Shield } from 'lucide-react';
import { getBookingById, cancelBooking, Booking } from '@/lib/bookings';
import BookingStatusBadge from '@/components/BookingStatusBadge';
import ReviewForm from '@/components/ReviewForm';
import { Review } from '@/lib/reviews';

interface BookingDetailPageProps {
  params: Promise<{ id: string }>;
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
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export default function BookingDetailPage({ params }: BookingDetailPageProps) {
  const router = useRouter();
  const { id } = use(params);

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }
    setIsCancelling(true);
    try {
      const updatedBooking = await cancelBooking(id);
      setBooking(updatedBooking);
      toast.success('Booking cancelled');
    } catch (error: unknown) {
      console.error('Failed to cancel booking:', error);
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to cancel booking. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReviewSuccess = (newReview: Review) => {
    setBooking(prev => prev ? { ...prev, review: newReview } : null);
    setShowReviewForm(false);
  };

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await getBookingById(id);
        setBooking(data);
      } catch (err: unknown) {
        console.error('Error fetching booking details:', err);
        const status = (err as { response?: { status?: number } }).response?.status;
        if (status === 403) {
          toast.error('You do not have permission to view this booking');
          router.push('/dashboard/customer/bookings');
        } else if (status === 404) {
          notFound();
        } else {
          toast.error('Failed to load booking. Please try again.');
          router.push('/dashboard/customer/bookings');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [id, router]);

  const handleBack = () => {
    // Navigate back if history exists, otherwise go to bookings list page
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/dashboard/customer/bookings');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 text-left animate-pulse py-6">
        <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded mb-4" />
        <div className="glass-card p-6 rounded-2xl border border-white/40 h-48 bg-white/20 dark:bg-slate-900/20" />
      </div>
    );
  }

  if (!booking) return null;

  const showCancelButton = booking.status === 'REQUESTED' || booking.status === 'ACCEPTED';
  const showPayButton = booking.status === 'ACCEPTED';
  const showReviewButton = booking.status === 'COMPLETED' && !booking.review;

  const renderPaymentInfo = () => {
    if (booking.payment) {
      return (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Payment Status:</span>
            <span className="font-bold text-green-600 uppercase text-[10px] bg-green-150/10 px-2 py-0.5 rounded border border-green-200">
              {booking.payment.status}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Amount Paid:</span>
            <span className="font-bold text-slate-700 dark:text-slate-200">
              ৳{booking.payment.amount}
            </span>
          </div>
          {booking.payment.transactionId && (
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Txn ID:</span>
              <span className="font-mono text-slate-600 dark:text-slate-400 text-3xs truncate max-w-[12rem]">
                {booking.payment.transactionId}
              </span>
            </div>
          )}
        </div>
      );
    }

    // Show "Not yet paid" if status is ACCEPTED or later (i.e. not REQUESTED)
    const displayUnpaid = booking.status !== 'REQUESTED';

    if (displayUnpaid) {
      return (
        <div className="text-xs font-semibold text-amber-600 dark:text-amber-500 bg-amber-150/10 px-3 py-2 rounded-lg border border-amber-200/50 flex items-center gap-1.5 justify-center">
          <CreditCard className="h-4 w-4" />
          <span>Not yet paid</span>
        </div>
      );
    }

    return (
      <p className="text-3xs text-slate-400 italic text-center">
        Payment expected once technician accepts the request.
      </p>
    );
  };

  return (
    <div className="space-y-6 text-left py-6">
      {/* Back Header Link */}
      <button
        onClick={handleBack}
        className="inline-flex items-center gap-1 text-xs font-bold text-slate-505 hover:text-indigo-600 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" /> Back to Bookings List
      </button>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left 2 Columns: Core details & Technician */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Booking Details Card */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/40 bg-white/20 dark:bg-slate-900/20 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-5">
              <div>
                <p className="text-4xs uppercase tracking-wider text-slate-400 font-bold">Booking Reference</p>
                <p className="text-xs font-mono font-bold text-slate-650 dark:text-slate-350 mt-1">{booking.id}</p>
              </div>
              <BookingStatusBadge status={booking.status} />
            </div>

            {/* Service details */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0 mt-0.5">
                  <Wrench className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">{booking.service?.name}</h2>
                  <p className="text-xs text-slate-405 uppercase font-semibold mt-0.5">Base Price: ৳{booking.service?.basePrice}</p>
                </div>
              </div>
              {booking.service?.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pl-11">
                  {booking.service.description}
                </p>
              )}
            </div>

            {/* Appointment Meta: Date, Location, Notes */}
            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-5 space-y-4">
              <div className="flex items-start gap-3">
                <span className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0 mt-0.5">
                  <Calendar className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-3xs uppercase tracking-wider text-slate-400 font-bold">Scheduled Time</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white mt-0.5">
                    {formatBookingDate(booking.scheduledDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0 mt-0.5">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-3xs uppercase tracking-wider text-slate-400 font-bold">Service Location</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                    {booking.address}
                  </p>
                </div>
              </div>

              {booking.notes && (
                <div className="flex items-start gap-3">
                  <span className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0 mt-0.5">
                    <FileText className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-3xs uppercase tracking-wider text-slate-400 font-bold">Customer Notes</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 whitespace-pre-line leading-relaxed">
                      {booking.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Technician Profile Snapshot Card */}
          <div className="glass-card p-6 rounded-2xl border border-white/40 bg-white/20 dark:bg-slate-900/20 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Assigned Professional</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/50 shrink-0">
                  <img
                    alt={booking.technician?.user?.name}
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida/AP1WRLu55IfUGrQFjTmMKBT0DLAr96dINwJeTKRRYQ6CrtGr3XvAFxhf38UYmvp25ns4MIif-EDYDOJr5keMlS7AfjOUaX5kPJSGQhOIVHpClyQF5OOiiFSpUnrxGQcAWJBKjnr0F30kfROyMsEN3piy-t0ELwccyOOfW6Mjn1ap4vpd6Hx1yGrNd6kCEb1fTznSodOTkpDA08sW2SB1r3cIhhqCGhFiAXDEHgxKgUeSn43iXMRtYOp2wT0hwGw"
                  />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-800 dark:text-white">
                    {booking.technician?.user?.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">Verified Partner Professional</p>
                </div>
              </div>
              <Link
                href={`/technicians/${booking.technician?.id}`}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-650 hover:border-indigo-500 rounded-xl text-xs font-bold transition-all shrink-0"
              >
                View Full Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Invoice Summary & Action Buttons */}
        <div className="space-y-6">
          
          {/* Summary / Cost & Payments Card */}
          <div className="glass-card p-6 rounded-2xl border border-white/40 bg-white/20 dark:bg-slate-900/20 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="h-4 w-4 text-indigo-500" /> Billing Details
            </h3>
            
            <div className="space-y-2 border-b border-slate-100 dark:border-slate-800/80 pb-4 text-xs font-medium text-slate-500">
              <div className="flex justify-between">
                <span>Base Service Price</span>
                <span className="text-slate-750 dark:text-slate-250">৳{booking.service?.basePrice}</span>
              </div>
              {booking.technician?.hourlyRate !== null && booking.technician?.hourlyRate !== 0 && (
                <div className="flex justify-between">
                  <span>Professional Hourly Rate</span>
                  <span className="text-slate-750 dark:text-slate-250">৳{booking.technician?.hourlyRate}/hr</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-sm font-bold text-slate-800 dark:text-white">Total Amount</span>
              <span className="text-xl font-black text-secondary-container">৳{booking.totalAmount}</span>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4">
              {renderPaymentInfo()}
            </div>
          </div>

          {/* Feedback & Review display (if review exists) */}
          {booking.review && (
            <div className="glass-card p-6 rounded-2xl border border-white/40 bg-white/20 dark:bg-slate-900/20 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-indigo-500" /> Your Review
              </h3>
              <div className="flex items-center gap-0.5 text-secondary-container">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4.5 w-4.5 ${
                      i < booking.review!.rating ? 'fill-secondary-container text-secondary-container' : 'text-slate-200 dark:text-slate-800'
                    }`}
                  />
                ))}
              </div>
              {booking.review.comment && (
                <p className="text-xs text-slate-600 dark:text-slate-400 italic leading-relaxed pt-1">
                  &quot;{booking.review.comment}&quot;
                </p>
              )}
            </div>
          )}

          {/* Action Buttons Panel */}
          {(showCancelButton || showPayButton || showReviewButton || showReviewForm) && (
            <div className="glass-card p-6 rounded-2xl border border-white/40 bg-white/20 dark:bg-slate-900/20 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-indigo-500" /> Actions
              </h3>
              
              <div className="flex flex-col gap-2.5">
                {/* Pay Now Button (Inert placeholder; payment integration is a later phase) */}
                {showPayButton && (
                  <button
                    disabled
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-xl text-xs cursor-not-allowed opacity-50 shadow-none transition-all flex items-center justify-center gap-1.5"
                  >
                    <CreditCard className="h-4 w-4" />
                    Pay Now
                  </button>
                )}

                {/* Leave Review Button & Inline Form */}
                {showReviewButton && (
                  showReviewForm ? (
                    <ReviewForm bookingId={booking.id} onSuccess={handleReviewSuccess} />
                  ) : (
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl text-xs shadow-md hover:from-indigo-500 hover:to-violet-500 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
                    >
                      <Star className="h-4 w-4" />
                      Leave a Review
                    </button>
                  )
                )}

                {/* Cancel Booking Button */}
                {showCancelButton && !showReviewForm && (
                  <button
                    onClick={handleCancel}
                    disabled={isCancelling}
                    className="w-full py-3 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-650 hover:text-red-700 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
