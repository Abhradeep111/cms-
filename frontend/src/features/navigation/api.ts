import api from '@/lib/api';
import type { NavigationItem } from '@/types/cms';

export async function listNavigation(): Promise<NavigationItem[]> {
  const res: any = await api.get('/api/v1/admin/navigation');
  return res;
}

export async function createNavigationItem(data: Partial<NavigationItem>): Promise<NavigationItem> {
  const res: any = await api.post('/api/v1/admin/navigation', data);
  return res;
}

export async function updateNavigationItem(id: string, data: Partial<NavigationItem>): Promise<NavigationItem> {
  const res: any = await api.put(`/api/v1/admin/navigation/${id}`, data);
  return res;
}

export async function deleteNavigationItem(id: string): Promise<void> {
  await api.delete(`/api/v1/admin/navigation/${id}`);
}
