"use client";

import { useAtom } from "jotai";
import { useEffect } from "react";
import {
  useHomepageArchitecturePillars,
  useHomepageBranding,
  useHomepageCategories,
  useHomepageFooter,
  useHomepageHeroStats,
  useHomepageProductModules,
  useHomepageRoadmapPhases,
  useSectionContents,
  useSEOData,
  useHomepageData,
} from "./useHomepage";
import {
  architecturePillarsAtom,
  brandingAtom,
  categoriesAtom,
  footerAtom,
  heroStatsAtom,
  productModulesAtom,
  roadmapPhasesAtom,
  sectionContentsAtom,
  seoDataAtom,
  isLoadingAtom,
  errorAtom,
  activeSectionAtom,
} from "@/store/atoms";

export function useHomepageStore() {
  const [sectionContents, setSectionContents] = useAtom(sectionContentsAtom);
  const [seoData, setSeoData] = useAtom(seoDataAtom);
  const [categories, setCategories] = useAtom(categoriesAtom);
  const [productModules, setProductModules] = useAtom(productModulesAtom);
  const [heroStats, setHeroStats] = useAtom(heroStatsAtom);
  const [architecturePillars, setArchitecturePillars] = useAtom(
    architecturePillarsAtom,
  );
  const [roadmapPhases, setRoadmapPhases] = useAtom(roadmapPhasesAtom);
  const [footer, setFooter] = useAtom(footerAtom);
  const [branding, setBranding] = useAtom(brandingAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [error, setError] = useAtom(errorAtom);
  const [activeSection, setActiveSection] = useAtom(activeSectionAtom);

  const {
    data: homepageData,
    isLoading: homepageLoading,
    error: homepageError,
  } = useHomepageData();
  const { data: sectionsData, isLoading: sectionsLoading } =
    useSectionContents();
  const { data: seoDataQuery, isLoading: seoLoading } = useSEOData();
  const { data: categoriesData } = useHomepageCategories();
  const { data: productModulesData } = useHomepageProductModules();
  const { data: heroStatsData } = useHomepageHeroStats();
  const { data: pillarsData } = useHomepageArchitecturePillars();
  const { data: roadmapData } = useHomepageRoadmapPhases();
  const { data: footerData } = useHomepageFooter();
  const { data: brandingData } = useHomepageBranding();

  useEffect(() => {
    if (homepageError) {
      setError(homepageError.message);
    }
  }, [homepageError, setError]);

  useEffect(() => {
    if (sectionsData) {
      setSectionContents(sectionsData);
    }
  }, [sectionsData, setSectionContents]);

  useEffect(() => {
    if (seoDataQuery) {
      setSeoData(seoDataQuery);
    }
  }, [seoDataQuery, setSeoData]);

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData);
    } else if (homepageData?.categories) {
      setCategories(homepageData.categories);
    }
  }, [categoriesData, homepageData, setCategories]);

  useEffect(() => {
    if (productModulesData) {
      setProductModules(productModulesData);
    } else if (homepageData?.productModules) {
      setProductModules(homepageData.productModules);
    } else if (homepageData?.modules) {
      setProductModules(homepageData.modules);
    }
  }, [productModulesData, homepageData, setProductModules]);

  useEffect(() => {
    if (heroStatsData) {
      setHeroStats(heroStatsData);
    } else if (homepageData?.heroStats) {
      setHeroStats(homepageData.heroStats);
    }
  }, [heroStatsData, homepageData, setHeroStats]);

  useEffect(() => {
    if (pillarsData) {
      setArchitecturePillars(pillarsData);
    } else if (homepageData?.architecturePillars) {
      setArchitecturePillars(homepageData.architecturePillars);
    }
  }, [pillarsData, homepageData, setArchitecturePillars]);

  useEffect(() => {
    if (roadmapData) {
      setRoadmapPhases(roadmapData);
    } else if (homepageData?.roadmapPhases) {
      setRoadmapPhases(homepageData.roadmapPhases);
    }
  }, [roadmapData, homepageData, setRoadmapPhases]);

  useEffect(() => {
    if (footerData) {
      setFooter(footerData);
    } else if (homepageData?.footer) {
      setFooter(homepageData.footer);
    }
  }, [footerData, homepageData, setFooter]);

  useEffect(() => {
    if (brandingData) {
      setBranding(brandingData);
    } else if (homepageData?.branding) {
      setBranding(homepageData.branding);
    }
  }, [brandingData, homepageData, setBranding]);

  useEffect(() => {
    setIsLoading(homepageLoading || sectionsLoading || seoLoading);
  }, [homepageLoading, sectionsLoading, seoLoading, setIsLoading]);

  return {
    sectionContents,
    seoData,
    categories,
    productModules,
    heroStats,
    architecturePillars,
    roadmapPhases,
    footer,
    branding,
    isLoading,
    error,
    activeSection,
    setActiveSection,
    homepageData,
  };
}
