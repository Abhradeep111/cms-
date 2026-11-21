import api from '@/lib/api';
import type { DashboardStats } from '@/types/cms';

export async function getDashboardStats(): Promise<DashboardStats> {
  const res: any = await api.get('/api/v1/admin/dashboard');
  return res;
}
