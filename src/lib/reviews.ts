import api from './api';
import { PaginationMeta } from './services';

export interface Review {
  id: string;
  reviewerId: string;
  technicianId: string;
  bookingId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  reviewer?: {
    name: string;
  };
}

export interface GetReviewsParams {
  page?: number | string;
  limit?: number | string;
}

export const getTechnicianReviews = async (
  technicianId: string,
  params: GetReviewsParams = {}
): Promise<{ meta: PaginationMeta; data: Review[] }> => {
  const response = await api.get(`/reviews/technician/${technicianId}`, { params });
  return response.data.data;
};
