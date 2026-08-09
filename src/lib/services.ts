import api from './api';
import { Category } from './categories';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  basePrice: number;
  category?: Category;
}

export interface GetServicesParams {
  categoryId?: string;
  searchTerm?: string;
  page?: number | string;
  limit?: number | string;
}

export const getServices = async (
  params: GetServicesParams = {}
): Promise<{ meta: PaginationMeta; data: Service[] }> => {
  const response = await api.get('/services', { params });
  return response.data.data;
};

export const getServiceById = async (id: string): Promise<Service> => {
  const response = await api.get(`/services/${id}`);
  return response.data.data;
};
