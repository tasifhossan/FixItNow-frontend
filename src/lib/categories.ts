import api from './api';

export interface Category {
  id: string;
  name: string;
  description: string | null;
  _count?: {
    services: number;
  };
}

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get('/categories');
  return response.data.data;
};

