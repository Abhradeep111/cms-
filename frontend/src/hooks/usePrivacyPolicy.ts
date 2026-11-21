'use client';

import { useQuery } from '@tanstack/react-query';
import { getPrivacyPolicy } from '@/lib/privacy-api';
import { PrivacyPolicyData } from '@/types/api';

export function usePrivacyPolicy() {
  return useQuery<PrivacyPolicyData | null>({
    queryKey: ['privacy-policy'],
    queryFn: getPrivacyPolicy,
  });
}
