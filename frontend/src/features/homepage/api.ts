import api from '@/lib/api';
import type { HomepageSection } from '@/types/cms';

export async function getAdminHomepageSections(): Promise<HomepageSection[]> {
  const res: any = await api.get('/api/v1/admin/homepage');
  return res;
}

export async function getAdminHomepageSection(sectionKey: string): Promise<HomepageSection> {
  const res: any = await api.get(`/api/v1/admin/homepage/${sectionKey}`);
  return res;
}

export async function updateAdminHomepageSection(
  sectionKey: string,
  data: Partial<HomepageSection>,
): Promise<HomepageSection> {
  const res: any = await api.put(`/api/v1/admin/homepage/${sectionKey}`, data);
  return res;
}
