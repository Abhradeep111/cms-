'use client';

import { atom } from 'jotai';
import { HomepageArchitecturePillar, HomepageBranding, HomepageCategory, HomepageFooter, HomepageHeroStat, HomepageProductModule, HomepageRoadmapPhase, SectionContent, SEOData } from '@/types/api';

export const activeSectionAtom = atom<string>('hero');

export const sectionContentsAtom = atom<Record<string, SectionContent>>({});

export const seoDataAtom = atom<SEOData | null>(null);

export const categoriesAtom = atom<HomepageCategory[]>([]);

export const productModulesAtom = atom<HomepageProductModule[]>([]);

export const heroStatsAtom = atom<HomepageHeroStat[]>([]);

export const architecturePillarsAtom = atom<HomepageArchitecturePillar[]>([]);

export const roadmapPhasesAtom = atom<HomepageRoadmapPhase[]>([]);

export const footerAtom = atom<HomepageFooter | null>(null);

export const brandingAtom = atom<HomepageBranding | null>(null);

export const isLoadingAtom = atom<boolean>(true);

export const errorAtom = atom<string | null>(null);

export const demoModalOpenAtom = atom<boolean>(false);
export const demoModalPreselectedAtom = atom<string[]>([]);