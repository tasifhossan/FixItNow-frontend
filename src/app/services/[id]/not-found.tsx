import React from 'react';
import Link from 'next/link';
import { AlertCircle, ChevronLeft } from 'lucide-react';

export default function ServiceNotFound() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-subtle flex items-center justify-center">
      <div className="max-w-md w-full glass-card p-8 rounded-2xl border border-white/40 shadow-xl text-center flex flex-col items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center text-red-500">
          <AlertCircle className="h-9 w-9" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Service Not Found</h1>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            The service profile you are looking for does not exist or may have been removed from our catalog list.
          </p>
        </div>
        <Link
          href="/services"
          className="w-full py-3 bg-primary text-white font-bold rounded-lg text-xs hover:bg-primary/95 active:scale-95 transition-all shadow-md flex items-center justify-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Services Catalog
        </Link>
      </div>
    </div>
  );
}
