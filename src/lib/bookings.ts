import api from './api';
import { PaginationMeta } from './services';

// ─── Status enum ──────────────────────────────────────────────────────────────
// Values come directly from the Prisma schema BookingStatus enum
export type BookingStatus =
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'PAID'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

// ─── Nested shapes ────────────────────────────────────────────────────────────
// Matches the `userSelect` projection used throughout booking.service.ts
export interface BookingUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

// Matches prisma.service shape (no relations included in booking includes)
export interface BookingService {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  basePrice: number;
}

// Matches TechnicianProfile with { user: { select: userSelect } }
export interface BookingTechnician {
  id: string;
  userId: string;
  bio: string | null;
  hourlyRate: number | null;
  isVerified: boolean;
  isAvailable: boolean;
  skills: string[];
  user: BookingUser;
}

// Payment shape — included in getBookingById / cancel / respond / updateStatus
export interface BookingPayment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: string;
  transactionId: string | null;
  createdAt: string;
  updatedAt: string;
}

// Review shape — included in getBookingById / cancel / respond / updateStatus
export interface BookingReview {
  id: string;
  bookingId: string;
  customerId: string;
  technicianId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Core Booking interfaces ──────────────────────────────────────────────────
interface BookingBase {
  id: string;
  status: BookingStatus;
  scheduledDate: string;
  address: string;
  notes: string | null;
  totalAmount: number;
  customerId: string;
  technicianId: string;
  serviceId: string;
  createdAt: string;
  updatedAt: string;
}

// createBooking response includes: service + technician(user)
export interface BookingCreate extends BookingBase {
  service: BookingService;
  technician: BookingTechnician;
}

// getMyBookings (customer) includes: service + technician(user)
export interface BookingListItem extends BookingBase {
  service: BookingService;
  technician: BookingTechnician;
}

// getAssignedBookings (technician) includes: service + customer
export interface BookingAssignedItem extends BookingBase {
  service: BookingService;
  customer: BookingUser;
}

// getBookingById / cancel / respond / updateStatus — all relations
export interface Booking extends BookingBase {
  service: BookingService;
  technician: BookingTechnician;
  customer: BookingUser;
  payment: BookingPayment | null;
  review: BookingReview | null;
}

// ─── Request payload ──────────────────────────────────────────────────────────
export interface CreateBookingPayload {
  technicianId: string;
  serviceId: string;
  /** ISO datetime string — must be in the future */
  scheduledDate: string;
  /** min 5 characters */
  address: string;
  notes?: string;
}

// ─── API functions ────────────────────────────────────────────────────────────

/**
 * POST /bookings
 * Creates a new booking (CUSTOMER only).
 */
export const createBooking = async (
  payload: CreateBookingPayload
): Promise<BookingCreate> => {
  const response = await api.post('/bookings', payload);
  return response.data.data;
};

/**
 * GET /bookings/my-bookings
 * Paginated list of bookings for the authenticated customer.
 */
export const getMyBookings = async (
  params: { status?: string; page?: number; limit?: number } = {}
): Promise<{ data: BookingListItem[]; meta: PaginationMeta }> => {
  const response = await api.get('/bookings/my-bookings', { params });
  return response.data.data;
};

/**
 * GET /bookings/assigned-to-me
 * Paginated list of bookings assigned to the authenticated technician.
 */
export const getAssignedBookings = async (
  params: { status?: string; page?: number; limit?: number } = {}
): Promise<{ data: BookingAssignedItem[]; meta: PaginationMeta }> => {
  const response = await api.get('/bookings/assigned-to-me', { params });
  return response.data.data;
};

/**
 * GET /bookings/:id
 * Single booking — auth required; caller must own the booking or be admin.
 */
export const getBookingById = async (id: string): Promise<Booking> => {
  const response = await api.get(`/bookings/${id}`);
  return response.data.data;
};

/**
 * PATCH /bookings/:id/cancel
 * Cancels a REQUESTED or ACCEPTED booking (CUSTOMER or ADMIN only).
 */
export const cancelBooking = async (id: string): Promise<Booking> => {
  const response = await api.patch(`/bookings/${id}/cancel`);
  return response.data.data;
};
