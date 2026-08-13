import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { respondToBooking, updateBookingStatus, BookingStatus } from '../lib/bookings';

interface BookingActionButtonsProps {
  bookingId: string;
  status: BookingStatus;
  onSuccess: () => void;
  className?: string;
}

export default function BookingActionButtons({
  bookingId,
  status,
  onSuccess,
  className = '',
}: BookingActionButtonsProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAction = async (
    actionPromise: () => Promise<unknown>,
    successMsg: string
  ) => {
    setIsLoading(true);
    try {
      await actionPromise();
      toast.success(successMsg);
      onSuccess();
    } catch (error: unknown) {
      console.error(error);
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message || err.message || 'An error occurred while updating the booking status');
    } finally {
      setIsLoading(false);
    }
  };

  const isRequested = status === 'REQUESTED';
  const isPaid = status === 'PAID';
  const isAccepted = status === 'ACCEPTED';
  const isInProgress = status === 'IN_PROGRESS';
  const isCompleted = status === 'COMPLETED';
  const isDeclined = status === 'DECLINED';
  const isCancelled = status === 'CANCELLED';

  if (isRequested) {
    return (
      <div className={`flex items-center gap-3 w-full ${className}`}>
        <button
          disabled={isLoading}
          onClick={() =>
            handleAction(
              () => respondToBooking(bookingId, 'ACCEPT'),
              'Booking request accepted!'
            )
          }
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors shadow-sm text-center cursor-pointer"
        >
          {isLoading ? 'Processing...' : 'Accept'}
        </button>
        <button
          disabled={isLoading}
          onClick={() =>
            handleAction(
              () => respondToBooking(bookingId, 'DECLINE'),
              'Booking request declined.'
            )
          }
          className="flex-1 py-3 border border-slate-200 dark:border-slate-850 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-50 dark:text-slate-400 font-bold rounded-xl text-xs transition-colors text-center cursor-pointer"
        >
          {isLoading ? 'Processing...' : 'Decline'}
        </button>
      </div>
    );
  }

  if (isPaid) {
    return (
      <div className={`w-full ${className}`}>
        <button
          disabled={isLoading}
          onClick={() =>
            handleAction(
              () => updateBookingStatus(bookingId, 'IN_PROGRESS'),
              'Job started!'
            )
          }
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors shadow-sm text-center cursor-pointer"
        >
          {isLoading ? 'Starting...' : 'Start Job'}
        </button>
      </div>
    );
  }

  if (isInProgress) {
    return (
      <div className={`w-full ${className}`}>
        <button
          disabled={isLoading}
          onClick={() =>
            handleAction(
              () => updateBookingStatus(bookingId, 'COMPLETED'),
              'Job marked as completed successfully!'
            )
          }
          className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors shadow-sm text-center cursor-pointer"
        >
          {isLoading ? 'Completing...' : 'Mark Complete'}
        </button>
      </div>
    );
  }

  if (isAccepted) {
    return (
      <div className={`w-full ${className}`}>
        <button
          disabled
          className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold rounded-xl text-xs text-center cursor-not-allowed border border-slate-200/20"
        >
          Awaiting Payment
        </button>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className={`w-full ${className}`}>
        <button
          disabled
          className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold rounded-xl text-xs text-center cursor-not-allowed"
        >
          Job Completed
        </button>
      </div>
    );
  }

  if (isDeclined) {
    return (
      <div className={`w-full ${className}`}>
        <button
          disabled
          className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold rounded-xl text-xs text-center cursor-not-allowed"
        >
          Job Declined
        </button>
      </div>
    );
  }

  if (isCancelled) {
    return (
      <div className={`w-full ${className}`}>
        <button
          disabled
          className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold rounded-xl text-xs text-center cursor-not-allowed"
        >
          Job Cancelled
        </button>
      </div>
    );
  }

  return null;
}
