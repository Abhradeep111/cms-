import { api } from './api';
import type { PrivacyPolicyData } from '@/types/api';
import { fallbackPrivacyPolicyData } from '@/data/api-fallbacks';
import { readApiData, requireRecord, withApiFallback } from './api-fallback';

export async function getPrivacyPolicy(): Promise<PrivacyPolicyData | null> {
  return withApiFallback('Privacy policy', async () => {
    const response: unknown = await api.get('/platform/api/v1/privacy-policy');
    const data = readApiData<unknown>(response, 'Privacy policy');
    return data === null
      ? null
      : (requireRecord(data, 'Privacy policy') as unknown as PrivacyPolicyData);
  }, () => fallbackPrivacyPolicyData);
}
