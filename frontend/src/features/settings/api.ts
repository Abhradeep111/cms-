import api from '@/lib/api';
import type { SiteSettings } from '@/types/cms';

export async function getGeneralSettings(): Promise<SiteSettings['general']> {
  const res: any = await api.get('/api/v1/admin/settings');
  return res.data;
}

export async function updateGeneralSettings(data: Partial<SiteSettings['general']>): Promise<void> {
  await api.put('/api/v1/admin/settings', data);
}

export async function getContactSettings(): Promise<SiteSettings['contact']> {
  const res: any = await api.get('/api/v1/admin/contact');
  return res.data;
}

export async function updateContactSettings(data: Partial<SiteSettings['contact']>): Promise<void> {
  await api.put('/api/v1/admin/contact', data);
}

export async function getFooterSettings(): Promise<SiteSettings['footer']> {
  const res: any = await api.get('/api/v1/admin/footer');
  return res.data;
}

export async function updateFooterSettings(data: Partial<SiteSettings['footer']>): Promise<void> {
  await api.put('/api/v1/admin/footer', data);
}
