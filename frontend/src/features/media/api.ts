import api from '@/lib/api';
import type { MediaAsset } from '@/types/cms';

export interface MediaListResult {
  items: MediaAsset[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export async function listMedia(params?: {
  search?: string;
  page?: number;
  page_size?: number;
}): Promise<MediaListResult> {
  const res: any = await api.get('/api/v1/admin/media', { params });
  return res;
}

export async function uploadMedia(file: File, altText?: string): Promise<MediaAsset> {
  const formData = new FormData();
  formData.append('file', file);
  if (altText) {
    formData.append('alt_text', altText);
  }

  const res: any = await api.post('/api/v1/admin/media', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res;
}

export async function deleteMedia(id: string): Promise<void> {
  await api.delete(`/api/v1/admin/media/${id}`);
}
