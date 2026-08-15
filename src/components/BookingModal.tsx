'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { X, Calendar, MapPin, Wrench, FileText } from 'lucide-react';
import { createBooking } from '../lib/bookings';
import { getAvailableSlots } from '../lib/technicians';
import { toUTCDateFromDhaka } from '../lib/date';

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

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
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

  const handleClose = useCallback(() => {
    reset();
    setSelectedDate('');
    setAvailableSlots([]);
    setSelectedSlot('');
    onClose();
  }, [reset, onClose]);

  const fetchSlots = async (dateStr: string) => {
    if (!dateStr) {
      setAvailableSlots([]);
      return;
    }
    setIsLoadingSlots(true);
    try {
      const slots = await getAvailableSlots(technicianId, dateStr);
      setAvailableSlots(slots);
    } catch (err: unknown) {
      console.error(err);
      toast.error('Failed to load available slots');
    } finally {
      setIsLoadingSlots(false);
    }
  };

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, handleClose]);

  // Reset states on open/close
  useEffect(() => {
    if (isOpen) {
      reset();
      setSelectedDate('');
      setAvailableSlots([]);
      setSelectedSlot('');
    }
  }, [isOpen, reset]);

  // Prevent background scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSelectedDate(val);
    setSelectedSlot('');
    setValue('scheduledDate', '', { shouldValidate: true });
    fetchSlots(val);
  };

  const onSubmit = async (data: BookingFormValues) => {
    try {
      await createBooking({
        technicianId,
        serviceId: data.serviceId,
        scheduledDate: data.scheduledDate,
        address: data.address,
        notes: data.notes,
      });

      toast.success('Booking request sent!');
      handleClose();
      router.push('/dashboard/customer/bookings');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to create booking. Please try again.';
      toast.error(errorMessage);
      
      // Refresh the slots to reflect any new bookings
      if (selectedDate) {
        fetchSlots(selectedDate);
      }
    }
  };

  // handleClose has been moved up with useCallback

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) handleClose();
  };

  if (!isOpen) return null;



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
              Scheduled Date
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                <Calendar className="h-4 w-4" />
              </span>
              <input
                id="bm-scheduledDate"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={handleDateChange}
                className={inputClass(!!errors.scheduledDate)}
              />
            </div>
            {errors.scheduledDate && (
              <p className="mt-1 text-xs font-medium text-red-500">
                {errors.scheduledDate.message}
              </p>
            )}

            {selectedDate && (
              <div className="mt-4 space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Select Time Slot (UTC)
                </label>
                {isLoadingSlots ? (
                  <div className="flex items-center gap-2 py-2 text-xs font-semibold text-slate-500">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
                    Loading available slots...
                  </div>
                ) : availableSlots.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => {
                            setSelectedSlot(slot);
                            setValue('scheduledDate', toUTCDateFromDhaka(selectedDate, slot), { shouldValidate: true });
                          }}
                          className={`px-2 py-2 text-xs font-bold rounded-xl transition-all border text-center ${
                            isSelected
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-xs font-semibold text-amber-600 dark:text-amber-500 py-2 px-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-xl leading-relaxed">
                    No available slots on this day.
                  </div>
                )}
              </div>
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
