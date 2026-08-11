'use client';

import React from 'react';
import Link from 'next/link';
import { Ban, ListOrdered } from 'lucide-react';
import PaymentResultLayout from '@/components/PaymentResultLayout';

/**
 * Payment cancelled callback page.
 *
 * The backend's cancel callback redirects here as:
 *   ${frontendUrl}/payment/cancelled
 * No bookingId is forwarded in the query string. This is a neutral,
 * non-error state — the user chose to cancel the payment on SSLCommerz's
 * hosted page. The booking status remains ACCEPTED so they can retry from
 * the booking detail page.
 */
export default function PaymentCancelledPage() {
  return (
    <PaymentResultLayout>
      {/* Icon — neutral indigo, not red */}
      <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center ring-4 ring-slate-200 dark:ring-slate-700/50">
        <Ban className="w-10 h-10 text-slate-400 dark:text-slate-500" />
      </div>

      {/* Heading */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Payment Cancelled</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          You cancelled the payment. No charge was made. Your booking is still
          active — you can pay whenever you&apos;re ready.
        </p>
      </div>

      {/* Neutral info box */}
      <div className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-2xl px-5 py-4 text-xs text-slate-500 dark:text-slate-400 text-left leading-relaxed">
        To complete your payment, open your booking and click{' '}
        <span className="font-semibold text-slate-700 dark:text-slate-300">&ldquo;Pay Now&rdquo;</span>{' '}
        again at any time.
      </div>

      {/* CTA */}
      <Link
        href="/dashboard/customer/bookings"
        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl text-sm transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
      >
        <ListOrdered className="w-4 h-4" /> Return to My Bookings
      </Link>
    </PaymentResultLayout>
  );
}
