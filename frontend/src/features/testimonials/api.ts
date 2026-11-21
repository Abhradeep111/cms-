import api from '@/lib/api';
import type { Testimonial } from '@/types/cms';

export interface TestimonialListResult {
  items: Testimonial[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export async function listTestimonials(params?: {
  search?: string;
  status?: string;
  page?: number;
  page_size?: number;
}): Promise<TestimonialListResult> {
  const res: any = await api.get('/api/v1/admin/testimonials', { params });
  return res;
}

export async function createTestimonial(data: Partial<Testimonial>): Promise<Testimonial> {
  const res: any = await api.post('/api/v1/admin/testimonials', data);
  return res;
}

export async function updateTestimonial(id: string, data: Partial<Testimonial>): Promise<Testimonial> {
  const res: any = await api.put(`/api/v1/admin/testimonials/${id}`, data);
  return res;
}

export async function deleteTestimonial(id: string): Promise<void> {
  await api.delete(`/api/v1/admin/testimonials/${id}`);
}
