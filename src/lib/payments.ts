import api from './api';

// ─── PaymentStatus ─────────────────────────────────────────────────────────
// Source: backend/prisma/schema.prisma — enum PaymentStatus
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

// ─── Payment interface ──────────────────────────────────────────────────────
// Source: payment.service.ts → getPaymentStatus()
// Only these three fields are selected and returned — no id/transactionId/currency.
export interface Payment {
  status: PaymentStatus;
  amount: number;
  // JSON key is `paidAt` (DateTime? in Prisma → ISO string or null in JSON)
  paidAt: string | null;
}

// ─── initiatePayment ────────────────────────────────────────────────────────
// POST /payments/initiate  { bookingId }
// Backend service returns: sslcommerzResponse.GatewayPageURL  (a plain string)
// sendResponse wraps it as:  { success, message, data: "<url>" }
// We re-expose it under a camelCase key for consistency with the rest of the codebase.
export const initiatePayment = async (
  bookingId: string
): Promise<{ gatewayPageUrl: string }> => {
  // JSON key from backend: data  (a string — the raw SSLCommerz GatewayPageURL)
  const response = await api.post('/payments/initiate', { bookingId });
  return { gatewayPageUrl: response.data.data as string };
};

// ─── getPaymentStatus ───────────────────────────────────────────────────────
// GET /payments/:bookingId/status
// Returns { status, amount, paidAt } per the select in payment.service.ts
export const getPaymentStatus = async (bookingId: string): Promise<Payment> => {
  const response = await api.get(`/payments/${bookingId}/status`);
  return response.data.data as Payment;
};
