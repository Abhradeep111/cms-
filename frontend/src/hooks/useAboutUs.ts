'use client';

import { useQuery } from '@tanstack/react-query';
import { getAboutUsData } from '@/lib/about-api';
import type { AboutUsData } from '@/types/api';

export function useAboutUs() {
  return useQuery<AboutUsData | null>({
    queryKey: ['about-us'],
    queryFn: getAboutUsData,
  });
}

