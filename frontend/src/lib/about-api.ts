import { api } from './api';
import type { AboutUsData } from '@/types/api';
import { fallbackAboutUsData } from '@/data/api-fallbacks';
import { readApiData, requireRecord, withApiFallback } from './api-fallback';

export async function getAboutUsData(): Promise<AboutUsData | null> {
  return withApiFallback('About page content', async () => {
    try {
      const response: unknown = await api.get('/platform/api/v1/about-us');
      const data = readApiData<unknown>(response, 'About page content');
      return data === null
        ? null
        : (requireRecord(data, 'About page content') as AboutUsData);
    } catch {
      const res: unknown = await api.get('/platform/api/v1/about');
      const data = readApiData<unknown>(res, 'About page content fallback');
      return data === null
        ? null
        : (requireRecord(data, 'About page content fallback') as AboutUsData);
    }
  }, () => fallbackAboutUsData);
}

