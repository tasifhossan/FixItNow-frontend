import api from './api';
import { Service, PaginationMeta } from './services';

export interface UserProfileSummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'CUSTOMER' | 'TECHNICIAN' | 'ADMIN';
  isBlocked: boolean;
  createdAt: string;
}

export interface Technician {
  id: string;
  userId: string;
  bio: string | null;
  skills: string[];
  hourlyRate: number;
  isVerified: boolean;
  isAvailable: boolean;
  averageRating: number;
  totalReviews: number;
  user?: UserProfileSummary;
  services?: Service[];
}

export interface GetTechniciansParams {
  minRating?: number | string;
  isAvailable?: boolean | string;
  searchTerm?: string;
  page?: number | string;
  limit?: number | string;
}

export const getTechnicians = async (
  params: GetTechniciansParams = {}
): Promise<{ meta: PaginationMeta; data: Technician[] }> => {
  const response = await api.get('/technicians', { params });
  return response.data.data;
};

export const getTechnicianById = async (id: string): Promise<Technician> => {
  const response = await api.get(`/technicians/${id}`);
  return response.data.data;
};

/**
 * GET /technicians/:id/available-slots?date=YYYY-MM-DD
 * Retrieves available booking slots for a technician on a specific date.
 */
export const getAvailableSlots = async (
  id: string,
  date: string
): Promise<string[]> => {
  const response = await api.get(`/technicians/${id}/available-slots`, {
    params: { date }
  });
  return response.data.data;
};
