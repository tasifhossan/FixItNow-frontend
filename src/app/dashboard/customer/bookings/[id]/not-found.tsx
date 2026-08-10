import React from 'react';
import Link from 'next/link';
import { AlertCircle, ChevronLeft } from 'lucide-react';

export default function BookingNotFound() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[50vh]">
      <div className="max-w-md w-full glass-card p-8 rounded-2xl border border-white/40 shadow-xl text-center flex flex-col items-center gap-5 bg-white/20 dark:bg-slate-900/20">
        <div className="w-16 h-16 rounded-full bg-red-150/10 dark:bg-red-950 flex items-center justify-center text-red-500">
          <AlertCircle className="h-9 w-9" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Booking Not Found</h1>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            The booking record you are trying to view does not exist or has been removed.
          </p>
        </div>
        <Link
          href="/dashboard/customer/bookings"
          className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-lg text-xs hover:from-indigo-500 hover:to-violet-500 active:scale-95 transition-all shadow-md flex items-center justify-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" /> Back to My Bookings
        </Link>
      </div>
    </div>
  );
}
