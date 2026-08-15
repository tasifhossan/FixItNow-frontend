export const DHAKA_OFFSET_MS = 6 * 60 * 60 * 1000; // UTC+6

/**
 * Converts a customer's selected local slot date and time string into a UTC ISO string.
 * This shifts the date back by 6 hours to compute the correct UTC instant.
 */
export const toUTCDateFromDhaka = (dateString: string, slotTime: string): string => {
  const utcMs = Date.parse(`${dateString}T${slotTime}:00.000Z`) - DHAKA_OFFSET_MS;
  return new Date(utcMs).toISOString();
};
