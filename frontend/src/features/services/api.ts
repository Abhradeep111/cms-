import api from '@/lib/api';
import type { Service } from '@/types/cms';

export interface ServiceListResult {
  items: Service[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export async function listServices(params?: {
  search?: string;
  status?: string;
  page?: number;
  page_size?: number;
}): Promise<ServiceListResult> {
  const res: any = await api.get('/api/v1/admin/services', { params });
  return res;
}

export async function getService(id: string): Promise<Service> {
  const res: any = await api.get(`/api/v1/admin/services/${id}`);
  return res;
}

export async function createService(data: Partial<Service>): Promise<Service> {
  const res: any = await api.post('/api/v1/admin/services', data);
  return res;
}

export async function updateService(id: string, data: Partial<Service>): Promise<Service> {
  const res: any = await api.put(`/api/v1/admin/services/${id}`, data);
  return res;
}

export async function deleteService(id: string): Promise<void> {
  await api.delete(`/api/v1/admin/services/${id}`);
}
