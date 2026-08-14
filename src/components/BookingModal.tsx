'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { X, Calendar, MapPin, Wrench, FileText } from 'lucide-react';
import { createBooking } from '../lib/bookings';

// ─── Props ────────────────────────────────────────────────────────────────────
interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  technicianId: string;
  services: Array<{ id: string; name: string; basePrice: number }>;
}

// ─── Zod schema ──────────────────────────────────────────────────────────────
// Matches CreateBookingPayload from lib/bookings.ts minus technicianId (from props)
const bookingSchema = z.object({
  serviceId: z.string().min(1, 'Please select a service'),
  scheduledDate: z
    .string()
    .min(1, 'Please select a date and time')
    .refine((val) => new Date(val) > new Date(), {
      message: 'Scheduled date must be in the future',
    }),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

// ─── Shared input class builder (matches register/login style) ───────────────
const inputClass = (hasError: boolean) =>
  `w-full rounded-lg border bg-white/80 py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 ${
    hasError
      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
      : 'border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
  }`;

const selectClass = (hasError: boolean) =>
  `w-full rounded-lg border bg-white/80 py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 ${
    hasError
      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
      : 'border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
  }`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function BookingModal({
  isOpen,
  onClose,
  technicianId,
  services,
}: BookingModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceId: '',
      scheduledDate: '',
      address: '',
      notes: '',
    },
  });

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Prevent background scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const onSubmit = async (data: BookingFormValues) => {
    try {
      await createBooking({
        technicianId,
        serviceId: data.serviceId,
        // datetime-local gives a local-time string without timezone; convert to ISO before sending
        scheduledDate: new Date(data.scheduledDate).toISOString(),
        address: data.address,
        notes: data.notes,
      });

      toast.success('Booking request sent!');
      reset();
      onClose();
      router.push('/dashboard/customer/bookings');
    } catch (error: unknown) {
      // Match the error-extraction pattern from the auth pages (register/login)
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to create booking. Please try again.';
      toast.error(errorMessage);
      // Do not close or reset — let the user fix the input and retry
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) handleClose();
  };

  if (!isOpen) return null;

  // Minimum datetime string for the native picker (now + 1 min)
  const minDateTime = new Date(Date.now() + 60_000)
    .toISOString()
    .slice(0, 16);

  return (
    /* Fixed overlay */
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(4px)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      {/* Modal card */}
      <div
        className="glass-card relative w-full max-w-md rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2
              id="booking-modal-title"
              className="text-lg font-bold tracking-tight text-slate-900"
            >
              Book Appointment
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Fill in the details and we&apos;ll confirm your booking.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close booking modal"
            className="ml-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

          {/* Service select */}
          <div>
            <label
              htmlFor="bm-serviceId"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5"
            >
              Service
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                <Wrench className="h-4 w-4" />
              </span>
              <select
                id="bm-serviceId"
                {...register('serviceId')}
                className={selectClass(!!errors.serviceId)}
              >
                <option value="">Select a service…</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — ৳{s.basePrice.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
            {errors.serviceId && (
              <p className="mt-1 text-xs font-medium text-red-500">
                {errors.serviceId.message}
              </p>
            )}
          </div>

          {/* Scheduled date/time */}
          <div>
            <label
              htmlFor="bm-scheduledDate"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5"
            >
              Scheduled Date &amp; Time
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                <Calendar className="h-4 w-4" />
              </span>
              <input
                id="bm-scheduledDate"
                type="datetime-local"
                min={minDateTime}
                {...register('scheduledDate')}
                className={inputClass(!!errors.scheduledDate)}
              />
            </div>
            {errors.scheduledDate && (
              <p className="mt-1 text-xs font-medium text-red-500">
                {errors.scheduledDate.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="bm-address"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5"
            >
              Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                <MapPin className="h-4 w-4" />
              </span>
              <input
                id="bm-address"
                type="text"
                placeholder="House 12, Road 5, Dhaka"
                {...register('address')}
                className={inputClass(!!errors.address)}
              />
            </div>
            {errors.address && (
              <p className="mt-1 text-xs font-medium text-red-500">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Notes (optional) */}
          <div>
            <label
              htmlFor="bm-notes"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5"
            >
              Notes <span className="normal-case font-normal text-slate-400">(optional)</span>
            </label>
            <div className="relative">
              <span className="absolute top-2.5 left-0 flex items-start pl-3 text-slate-400 pointer-events-none">
                <FileText className="h-4 w-4" />
              </span>
              <textarea
                id="bm-notes"
                rows={3}
                placeholder="Describe the problem or any special instructions…"
                {...register('notes')}
                className="w-full rounded-lg border border-slate-200 bg-white/80 py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 w-full flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/10 hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/20 active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              'Confirm Booking'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
