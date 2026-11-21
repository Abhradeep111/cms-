import { api } from './api';
import type {
  HomepageArchitecturePillar,
  HomepageBranding,
  HomepageCategory,
  HomepageData,
  HomepageFooter,
  HomepageHeroStat,
  HomepageProductModule,
  HomepageRoadmapPhase,
  SectionContent,
  SEOData,
} from '@/types/api';
import {
  createFallbackHomepageBranding,
  createFallbackHomepageData,
  createFallbackHomepageFooter,
  createFallbackProductModules,
} from '@/data/api-fallbacks';
import {
  readApiData,
  requireArray,
  requireRecord,
  withApiFallback,
} from './api-fallback';

async function getHomepageCMS(): Promise<HomepageData> {
  const response: unknown = await api.get('/platform/api/v1/homepage-cmss');
  return requireRecord(
    readApiData<unknown>(response, 'Homepage CMS'),
    'Homepage CMS',
  ) as unknown as HomepageData;
}

export async function getHomepageData(): Promise<HomepageData> {
  return withApiFallback(
    'Homepage CMS data',
    getHomepageCMS,
    createFallbackHomepageData,
  );
}

export async function getSectionContents(): Promise<
  Record<string, SectionContent>
> {
  return withApiFallback('Homepage sections', async () => {
    const sections = (await getHomepageCMS()).sections;
    if (sections == null) return {};
    return requireRecord(sections, 'Homepage sections') as Record<
      string,
      SectionContent
    >;
  }, () => ({}));
}

export async function getSEOData(): Promise<SEOData | null> {
  return withApiFallback('Homepage SEO data', async () => {
    const seo = (await getHomepageCMS()).seo;
    if (seo == null) return null;
    return requireRecord(seo, 'Homepage SEO data') as unknown as SEOData;
  }, () => null);
}

export async function getHomepageCategories(): Promise<HomepageCategory[]> {
  return withApiFallback('Homepage categories', async () => {
    const categories = (await getHomepageCMS()).categories;
    return categories == null
      ? []
      : requireArray<HomepageCategory>(categories, 'Homepage categories');
  }, () => []);
}

export async function getHomepageCategoriesDirect(): Promise<HomepageCategory[]> {
  return withApiFallback('Homepage categories endpoint', async () => {
    const response: unknown = await api.get('/platform/api/v1/homepage-categories');
    return requireArray<HomepageCategory>(
      readApiData<unknown>(response, 'Homepage categories endpoint'),
      'Homepage categories endpoint',
    );
  }, () => []);
}

export async function getHomepageProductModules(): Promise<HomepageProductModule[]> {
  return withApiFallback('Homepage product modules', async () => {
    const cms = await getHomepageCMS();
    const productModules = cms.productModules ?? cms.modules;
    return productModules == null
      ? []
      : requireArray<HomepageProductModule>(
          productModules,
          'Homepage product modules',
        );
  }, createFallbackProductModules);
}

export async function getHomepageProductModulesDirect(): Promise<HomepageProductModule[]> {
  return withApiFallback('Homepage product modules endpoint', async () => {
    const response: unknown = await api.get(
      '/platform/api/v1/homepage-product-modules',
    );
    return requireArray<HomepageProductModule>(
      readApiData<unknown>(response, 'Homepage product modules endpoint'),
      'Homepage product modules endpoint',
    );
  }, createFallbackProductModules);
}

export async function getHomepageHeroStats(): Promise<HomepageHeroStat[]> {
  return withApiFallback('Homepage hero statistics', async () => {
    const heroStats = (await getHomepageCMS()).heroStats;
    return heroStats == null
      ? []
      : requireArray<HomepageHeroStat>(heroStats, 'Homepage hero statistics');
  }, () => []);
}

export async function getHomepageHeroStatsDirect(): Promise<HomepageHeroStat[]> {
  return withApiFallback('Homepage hero statistics endpoint', async () => {
    const response: unknown = await api.get(
      '/platform/api/v1/homepage-hero-stats',
    );
    return requireArray<HomepageHeroStat>(
      readApiData<unknown>(response, 'Homepage hero statistics endpoint'),
      'Homepage hero statistics endpoint',
    );
  }, () => []);
}

export async function getHomepageArchitecturePillars(): Promise<HomepageArchitecturePillar[]> {
  return withApiFallback('Homepage architecture pillars', async () => {
    const pillars = (await getHomepageCMS()).architecturePillars;
    return pillars == null
      ? []
      : requireArray<HomepageArchitecturePillar>(
          pillars,
          'Homepage architecture pillars',
        );
  }, () => []);
}

export async function getHomepageArchitecturePillarsDirect(): Promise<HomepageArchitecturePillar[]> {
  return withApiFallback('Homepage architecture pillars endpoint', async () => {
    const response: unknown = await api.get(
      '/platform/api/v1/homepage-architecture-pillars',
    );
    return requireArray<HomepageArchitecturePillar>(
      readApiData<unknown>(response, 'Homepage architecture pillars endpoint'),
      'Homepage architecture pillars endpoint',
    );
  }, () => []);
}

export async function getHomepageRoadmapPhases(): Promise<HomepageRoadmapPhase[]> {
  return withApiFallback('Homepage roadmap phases', async () => {
    const phases = (await getHomepageCMS()).roadmapPhases;
    return phases == null
      ? []
      : requireArray<HomepageRoadmapPhase>(phases, 'Homepage roadmap phases');
  }, () => []);
}

export async function getHomepageRoadmapPhasesDirect(): Promise<HomepageRoadmapPhase[]> {
  return withApiFallback('Homepage roadmap phases endpoint', async () => {
    const response: unknown = await api.get(
      '/platform/api/v1/homepage-roadmap-phases',
    );
    return requireArray<HomepageRoadmapPhase>(
      readApiData<unknown>(response, 'Homepage roadmap phases endpoint'),
      'Homepage roadmap phases endpoint',
    );
  }, () => []);
}

export async function getHomepageFooter(): Promise<HomepageFooter | null> {
  return withApiFallback('Homepage footer', async () => {
    const footer = (await getHomepageCMS()).footer;
    if (footer == null) return null;
    return requireRecord(footer, 'Homepage footer') as unknown as HomepageFooter;
  }, createFallbackHomepageFooter);
}

export async function getHomepageFooterDirect(): Promise<HomepageFooter> {
  return withApiFallback('Homepage footer endpoint', async () => {
    const response: unknown = await api.get('/platform/api/v1/homepage-footer');
    return requireRecord(
      readApiData<unknown>(response, 'Homepage footer endpoint'),
      'Homepage footer endpoint',
    ) as unknown as HomepageFooter;
  }, createFallbackHomepageFooter);
}

export async function getHomepageBranding(): Promise<HomepageBranding | null> {
  return withApiFallback('Homepage branding', async () => {
    const branding = (await getHomepageCMS()).branding;
    if (branding == null) return null;
    return requireRecord(branding, 'Homepage branding') as unknown as HomepageBranding;
  }, createFallbackHomepageBranding);
}

export async function getHomepageBrandingDirect(): Promise<HomepageBranding> {
  return withApiFallback('Homepage branding endpoint', async () => {
    const response: unknown = await api.get('/platform/api/v1/homepage-branding');
    return requireRecord(
      readApiData<unknown>(response, 'Homepage branding endpoint'),
      'Homepage branding endpoint',
    ) as unknown as HomepageBranding;
  }, createFallbackHomepageBranding);
}