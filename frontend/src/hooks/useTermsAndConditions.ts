'use client';

import { useQuery } from '@tanstack/react-query';
import { getTermsAndConditions } from '@/lib/terms-api';
import type { TermsAndConditionsData } from '@/types/api';

export function useTermsAndConditions() {
  return useQuery<TermsAndConditionsData | null>({
    queryKey: ['terms-and-conditions'],
    queryFn: getTermsAndConditions,
  });
}

