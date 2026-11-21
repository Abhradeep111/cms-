import api from '@/lib/api';
import type { SEOMetadata } from '@/types/cms';

export async function listAllSeo(): Promise<SEOMetadata[]> {
  const res: any = await api.get('/api/v1/admin/seo');
  return res;
}

export async function getSeo(pageKey: string): Promise<SEOMetadata> {
  const res: any = await api.get(`/api/v1/admin/seo/${pageKey}`);
  return res;
}

export async function updateSeo(pageKey: string, data: Partial<SEOMetadata>): Promise<SEOMetadata> {
  const res: any = await api.put(`/api/v1/admin/seo/${pageKey}`, data);
  return res;
}
