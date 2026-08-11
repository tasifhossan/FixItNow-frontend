'use client';

import React from 'react';
import Link from 'next/link';
import { XCircle, ListOrdered } from 'lucide-react';
import PaymentResultLayout from '@/components/PaymentResultLayout';

/**
 * Payment failed callback page.
 *
 * The backend's fail callback redirects here as:
 *   ${frontendUrl}/payment/failed
 * No bookingId is forwarded in the query string (only tran_id comes in the
 * POST body, which the backend processes server-side before redirecting).
 * Therefore there is no client-side retry flow here — users must return to
 * their bookings list and retry from the booking detail page.
 */
export default function PaymentFailedPage() {
  return (
    <PaymentResultLayout>
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center ring-4 ring-red-100 dark:ring-red-900/40">
        <XCircle className="w-10 h-10 text-red-500" />
      </div>

      {/* Heading */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Payment Failed</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Your payment could not be processed. No amount has been charged.
          You can try again from your booking details page.
        </p>
      </div>

      {/* Tip */}
      <div className="w-full bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 rounded-2xl px-5 py-4 text-xs text-slate-500 dark:text-slate-400 text-left space-y-1">
        <p className="font-semibold text-red-600 dark:text-red-400">What you can do:</p>
        <ul className="list-disc list-inside space-y-0.5 leading-relaxed">
          <li>Go to your bookings list and open the relevant booking.</li>
          <li>Click &ldquo;Pay Now&rdquo; to start a new payment session.</li>
          <li>If the problem persists, contact your bank or try a different card.</li>
        </ul>
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
