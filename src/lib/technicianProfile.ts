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

/**
 * GET /technicians/me/profile
 * Retrieves the authenticated technician's own profile details.
 */
export const getMyTechnicianProfile = async (): Promise<TechnicianProfile> => {
  const response = await api.get('/technicians/me/profile');
  return response.data.data;
};

export interface WorkingHours {
  id?: string;
  technicianProfileId?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

/**
 * GET /technicians/me/working-hours
 * Retrieves the technician's configured working hours.
 */
export const getWorkingHours = async (): Promise<WorkingHours[]> => {
  const response = await api.get('/technicians/me/working-hours');
  return response.data.data;
};

/**
 * PUT /technicians/me/working-hours
 * Updates the technician's configured working hours.
 */
export const updateWorkingHours = async (
  workingHours: { dayOfWeek: number; startTime: string; endTime: string }[]
): Promise<WorkingHours[]> => {
  const response = await api.put('/technicians/me/working-hours', workingHours);
  return response.data.data;
};

