import api from './api';
import { Technician } from './technicians';

export type TechnicianProfile = Technician;

/**
 * PATCH /technicians/me/profile
 * Updates the technician profile (bio, skills, hourlyRate).
 */
export const updateTechnicianProfile = async (payload: {
  bio?: string;
  skills?: string[];
  hourlyRate?: number;
}): Promise<TechnicianProfile> => {
  const response = await api.patch('/technicians/me/profile', payload);
  return response.data.data;
};

/**
 * PATCH /technicians/me/availability
 * Toggles the technician's availability status.
 */
export const updateAvailability = async (
  isAvailable: boolean
): Promise<TechnicianProfile> => {
  const response = await api.patch('/technicians/me/availability', { isAvailable });
  return response.data.data;
};

/**
 * POST /technicians/me/services
 * Assigns one or more services to the technician profile.
 */
export const assignServices = async (
  serviceIds: string[]
): Promise<TechnicianProfile> => {
  const response = await api.post('/technicians/me/services', { serviceIds });
  return response.data.data;
};

/**
 * DELETE /technicians/me/services/:serviceId
 * Removes an assigned service from the technician profile.
 */
export const removeService = async (serviceId: string): Promise<void> => {
  await api.delete(`/technicians/me/services/${serviceId}`);
};
