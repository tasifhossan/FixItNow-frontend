'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BookingModal from './BookingModal';

interface TechnicianBookingCTAProps {
  technicianId: string;
  services: Array<{ id: string; name: string; basePrice: number }>;
}

export default function TechnicianBookingCTA({
  technicianId,
  services,
}: TechnicianBookingCTAProps) {
  const { user, isLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // While session is being restored, render nothing to avoid flash
  if (isLoading) return null;

  // Not logged in — redirect to login
  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="w-full py-4 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-sm font-bold text-white shadow-md shadow-indigo-500/10 hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/20 active:scale-[0.99] transition-all duration-200"
      >
        <LogIn className="h-4 w-4" />
        Login to Book
      </Link>
    );
  }

  // Technician or Admin — no booking CTA
  if (user.role === 'TECHNICIAN' || user.role === 'ADMIN') {
    return null;
  }

  // Customer — no services listed yet
  if (services.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <button
          disabled
          className="w-full py-4 bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 rounded-lg text-sm font-bold cursor-not-allowed shadow-none border border-slate-300/10 transition-all flex items-center justify-center gap-1.5"
        >
          <Calendar className="h-5 w-5" />
          Book Appointment
        </button>
        <p className="text-center text-[11px] text-slate-400">
          This technician hasn&apos;t added any services yet.
        </p>
      </div>
    );
  }

  // Customer + services available — active booking button
  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full py-4 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-sm font-bold text-white shadow-md shadow-indigo-500/10 hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/20 active:scale-[0.99] transition-all duration-200"
      >
        <Calendar className="h-4 w-4" />
        Book Now
      </button>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        technicianId={technicianId}
        services={services}
      />
    </>
  );
}
