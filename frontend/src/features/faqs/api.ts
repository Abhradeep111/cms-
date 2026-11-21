import api from '@/lib/api';
import type { FAQ } from '@/types/cms';

export interface FAQListResult {
  items: FAQ[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export async function listFaqs(params?: {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  page_size?: number;
}): Promise<FAQListResult> {
  const res: any = await api.get('/api/v1/admin/faqs', { params });
  return res;
}

export async function createFaq(data: Partial<FAQ>): Promise<FAQ> {
  const res: any = await api.post('/api/v1/admin/faqs', data);
  return res;
}

export async function updateFaq(id: string, data: Partial<FAQ>): Promise<FAQ> {
  const res: any = await api.put(`/api/v1/admin/faqs/${id}`, data);
  return res;
}

export async function deleteFaq(id: string): Promise<void> {
  await api.delete(`/api/v1/admin/faqs/${id}`);
}

export { listFaqs as listFAQs, createFaq as createFAQ, updateFaq as updateFAQ, deleteFaq as deleteFAQ };
