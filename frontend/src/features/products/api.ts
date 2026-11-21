import api from '@/lib/api';
import type { Product } from '@/types/cms';

export interface ProductListResult {
  items: Product[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export async function listProducts(params?: {
  search?: string;
  status?: string;
  is_featured?: boolean;
  page?: number;
  page_size?: number;
}): Promise<ProductListResult> {
  const res: any = await api.get('/api/v1/admin/products', { params });
  return res;
}

export async function getProduct(id: string): Promise<Product> {
  const res: any = await api.get(`/api/v1/admin/products/${id}`);
  return res;
}

export async function createProduct(data: Partial<Product>): Promise<Product> {
  const res: any = await api.post('/api/v1/admin/products', data);
  return res;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  const res: any = await api.put(`/api/v1/admin/products/${id}`, data);
  return res;
}

export async function updateProductStatus(id: string, status: string): Promise<Product> {
  const res: any = await api.patch(`/api/v1/admin/products/${id}/status`, { status });
  return res;
}

export async function reorderProducts(items: Array<{ id: string; display_order: number }>): Promise<void> {
  await api.post('/api/v1/admin/products/reorder', items);
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/api/v1/admin/products/${id}`);
}
