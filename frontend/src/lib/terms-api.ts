import { api } from './api';
import type { TermsAndConditionsData } from '@/types/api';
import { fallbackTermsAndConditionsData } from '@/data/api-fallbacks';
import { readApiData, requireRecord, withApiFallback } from './api-fallback';

export async function getTermsAndConditions(): Promise<TermsAndConditionsData | null> {
  return withApiFallback('Terms and conditions', async () => {
    try {
      const response: unknown = await api.get(
        '/platform/api/v1/terms-and-conditions',
      );
      const data = readApiData<unknown>(response, 'Terms and conditions');
      return data === null
        ? null
        : (requireRecord(data, 'Terms and conditions') as unknown as TermsAndConditionsData);
    } catch {
      const response: unknown = await api.get('/platform/api/v1/terms');
      const data = readApiData<unknown>(response, 'Terms and conditions fallback');
      return data === null
        ? null
        : (requireRecord(data, 'Terms and conditions fallback') as unknown as TermsAndConditionsData);
    }
  }, () => fallbackTermsAndConditionsData);
}

