'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Clock, AlertCircle, RefreshCw, ArrowRight, ListOrdered } from 'lucide-react';
import { getPaymentStatus, Payment } from '@/lib/payments';
import PaymentResultLayout from '@/components/PaymentResultLayout';

// ─── Inner component (needs useSearchParams, wrapped in Suspense below) ───────
function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  type PageState = 'loading' | 'paid' | 'pending' | 'error';

  const [pageState, setPageState] = useState<PageState>('loading');
  const [payment, setPayment] = useState<Payment | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const checkStatus = useCallback(async () => {
    if (!bookingId) {
      setPageState('error');
      setErrorMessage('No booking ID provided. Cannot confirm payment status.');
      return;
    }

    setIsChecking(true);
    try {
      const data = await getPaymentStatus(bookingId);
      setPayment(data);
      setPageState(data.status === 'PAID' ? 'paid' : 'pending');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMessage(
        e.response?.data?.message ||
          e.message ||
          'Could not retrieve payment status. Please check your bookings.'
      );
      setPageState('error');
    } finally {
      setIsChecking(false);
    }
  }, [bookingId]);

  // Run on mount
  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  // ── PAID ──────────────────────────────────────────────────────────────────
  if (pageState === 'paid' && payment) {
    return (
      <PaymentResultLayout>
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center ring-4 ring-emerald-100 dark:ring-emerald-900/40">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>

        {/* Heading */}
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Payment Successful</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your payment has been confirmed and your booking is now active.
          </p>
        </div>

        {/* Amount badge */}
        <div className="w-full bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl px-6 py-4 flex items-center justify-between border border-emerald-100 dark:border-emerald-900/50">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Amount Paid
          </span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            ৳{payment.amount.toLocaleString()}
          </span>
        </div>

        {/* CTA */}
        <Link
          href={`/dashboard/customer/bookings/${bookingId}`}
          className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold rounded-xl text-sm transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
        >
          View Booking Details <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/dashboard/customer/bookings"
          className="text-xs text-slate-400 hover:text-indigo-600 transition-colors font-medium flex items-center gap-1"
        >
          <ListOrdered className="w-3.5 h-3.5" /> Back to all bookings
        </Link>
      </PaymentResultLayout>
    );
  }

  // ── PENDING / STILL PROCESSING ────────────────────────────────────────────
  if (pageState === 'pending') {
    return (
      <PaymentResultLayout>
        <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center ring-4 ring-amber-100 dark:ring-amber-900/40">
          <Clock className="w-10 h-10 text-amber-500 animate-pulse" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Confirming Payment</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your payment is being processed. This may take a few moments to fully confirm.
          </p>
        </div>

        <button
          onClick={() => checkStatus()}
          disabled={isChecking}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold rounded-xl text-sm transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
          {isChecking ? 'Checking…' : 'Check Again'}
        </button>

        <Link
          href="/dashboard/customer/bookings"
          className="text-xs text-slate-400 hover:text-indigo-600 transition-colors font-medium flex items-center gap-1"
        >
          <ListOrdered className="w-3.5 h-3.5" /> Back to all bookings
        </Link>
      </PaymentResultLayout>
    );
  }

  // ── ERROR ─────────────────────────────────────────────────────────────────
  if (pageState === 'error') {
    return (
      <PaymentResultLayout>
        <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center ring-4 ring-red-100 dark:ring-red-900/40">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Something Went Wrong</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{errorMessage}</p>
        </div>

        <Link
          href="/dashboard/customer/bookings"
          className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl text-sm transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
        >
          <ListOrdered className="w-4 h-4" /> Go to My Bookings
        </Link>
      </PaymentResultLayout>
    );
  }

  // ── LOADING (initial fetch) ───────────────────────────────────────────────
  return (
    <PaymentResultLayout>
      <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center ring-4 ring-slate-200 dark:ring-slate-700 animate-pulse" />
      <div className="space-y-2 w-full">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-xl w-3/4 mx-auto animate-pulse" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800/60 rounded-xl w-1/2 mx-auto animate-pulse" />
      </div>
      <p className="text-xs text-slate-400 animate-pulse">Confirming your payment status…</p>
    </PaymentResultLayout>
  );
}

// ─── Page export (Suspense boundary required for useSearchParams) ─────────────
export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <p className="text-sm text-slate-400 animate-pulse">Loading…</p>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
