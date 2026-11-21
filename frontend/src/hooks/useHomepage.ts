'use client';

import { useQuery } from '@tanstack/react-query';
import { getHomepageArchitecturePillars, getHomepageArchitecturePillarsDirect, getHomepageBranding, getHomepageBrandingDirect, getHomepageCategories, getHomepageData, getHomepageFooter, getHomepageFooterDirect, getHomepageHeroStats, getHomepageHeroStatsDirect, getHomepageProductModules, getHomepageRoadmapPhases, getHomepageRoadmapPhasesDirect, getSectionContents, getSEOData } from '@/lib/homepage-api';
import { HomepageArchitecturePillar, HomepageBranding, HomepageCategory, HomepageData, HomepageFooter, HomepageHeroStat, HomepageProductModule, HomepageRoadmapPhase, SectionContent, SEOData } from '@/types/api';

export function useHomepageData() {
  return useQuery<HomepageData>({
    queryKey: ['homepage'],
    queryFn: getHomepageData,
  });
}

export function useSectionContents() {
  return useQuery<Record<string, SectionContent>>({
    queryKey: ['sections'],
    queryFn: getSectionContents,
  });
}

export function useSEOData() {
  return useQuery<SEOData | null>({
    queryKey: ['seo'],
    queryFn: getSEOData,
  });
}

export function useHomepageCategories() {
  return useQuery<HomepageCategory[]>({
    queryKey: ['homepage-categories'],
    queryFn: getHomepageCategories,
  });
}

export function useHomepageProductModules() {
  return useQuery<HomepageProductModule[]>({
    queryKey: ['homepage-product-modules'],
    queryFn: getHomepageProductModules,
  });
}

export function useHomepageHeroStats() {
  return useQuery<HomepageHeroStat[]>({
    queryKey: ['homepage-hero-stats'],
    queryFn: getHomepageHeroStats,
  });
}

export function useHomepageHeroStatsDirect() {
  return useQuery<HomepageHeroStat[]>({
    queryKey: ['homepage-hero-stats-direct'],
    queryFn: getHomepageHeroStatsDirect,
  });
}

export function useHomepageArchitecturePillars() {
  return useQuery<HomepageArchitecturePillar[]>({
    queryKey: ['homepage-architecture-pillars'],
    queryFn: getHomepageArchitecturePillars,
  });
}

export function useHomepageArchitecturePillarsDirect() {
  return useQuery<HomepageArchitecturePillar[]>({
    queryKey: ['homepage-architecture-pillars-direct'],
    queryFn: getHomepageArchitecturePillarsDirect,
  });
}

export function useHomepageRoadmapPhases() {
  return useQuery<HomepageRoadmapPhase[]>({
    queryKey: ['homepage-roadmap-phases'],
    queryFn: getHomepageRoadmapPhases,
  });
}

export function useHomepageRoadmapPhasesDirect() {
  return useQuery<HomepageRoadmapPhase[]>({
    queryKey: ['homepage-roadmap-phases-direct'],
    queryFn: getHomepageRoadmapPhasesDirect,
  });
}

export function useHomepageFooter() {
  return useQuery<HomepageFooter | null>({
    queryKey: ['homepage-footer'],
    queryFn: getHomepageFooter,
  });
}

export function useHomepageFooterDirect() {
  return useQuery<HomepageFooter>({
    queryKey: ['homepage-footer-direct'],
    queryFn: getHomepageFooterDirect,
  });
}

export function useHomepageBranding() {
  return useQuery<HomepageBranding | null>({
    queryKey: ['homepage-branding'],
    queryFn: getHomepageBranding,
  });
}

export function useHomepageBrandingDirect() {
  return useQuery<HomepageBranding>({
    queryKey: ['homepage-branding-direct'],
    queryFn: getHomepageBrandingDirect,
  });
}