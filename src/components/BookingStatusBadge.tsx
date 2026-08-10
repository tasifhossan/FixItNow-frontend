import React from 'react';
import { BookingStatus } from '../lib/bookings';

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

export default function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  let classes = '';
  let label = '';

  switch (status) {
    case 'REQUESTED':
      classes = 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50';
      label = 'Requested';
      break;
    case 'ACCEPTED':
      classes = 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/50';
      label = 'Accepted';
      break;
    case 'PAID':
      classes = 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900/50';
      label = 'Paid';
      break;
    case 'IN_PROGRESS':
      classes = 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/50';
      label = 'In Progress';
      break;
    case 'COMPLETED':
      classes = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
      label = 'Completed';
      break;
    case 'CANCELLED':
      // dark red background
      classes = 'bg-red-950/20 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-900/30 dark:border-red-900/50';
      label = 'Cancelled';
      break;
    case 'DECLINED':
      // red background
      classes = 'bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/40';
      label = 'Declined';
      break;
    default:
      classes = 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200';
      label = status;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${classes}`}>
      {label}
    </span>
  );
}
