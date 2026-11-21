'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { SEOData } from '@/types/api';

export function useDynamicSEO(seoData: SEOData | null) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hash = searchParams.get('hash') || '';

  useEffect(() => {
    if (!seoData) return;

    // Since there's only one landing page, use the single SEO data
    const seo = seoData;

    document.title = seo.title;
    
    updateMetaTag('description', seo.description);
    updateMetaTag('og:title', seo.og_title || seo.title);
    updateMetaTag('og:description', seo.og_description || seo.description);
    updateMetaTag('og:image', seo.og_image || '');
    updateMetaTag('twitter:title', seo.twitter_title || seo.title);
    updateMetaTag('twitter:description', seo.twitter_description || seo.description);
    updateMetaTag('twitter:image', seo.twitter_image || '');
    updateMetaTag('canonical', seo.canonical_url || window.location.href);

    if (seo.keywords.length > 0) {
      updateMetaTag('keywords', seo.keywords.join(', '));
    }
  }, [pathname, hash, seoData]);
}

function updateMetaTag(name: string, content: string) {
  if (!content) return;
  
  let meta = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    if (name.startsWith('og:') || name.startsWith('twitter:')) {
      meta.setAttribute('property', name);
    } else {
      meta.setAttribute('name', name);
    }
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

export function useSectionSEO(seoData: SEOData | null) {
  useEffect(() => {
    if (!seoData) return;

    const seo = seoData;

    document.title = seo.title;
    updateMetaTag('description', seo.description);
    updateMetaTag('og:title', seo.og_title || seo.title);
    updateMetaTag('og:description', seo.og_description || seo.description);
    updateMetaTag('og:image', seo.og_image || '');
    updateMetaTag('twitter:title', seo.twitter_title || seo.title);
    updateMetaTag('twitter:description', seo.twitter_description || seo.description);
    updateMetaTag('twitter:image', seo.twitter_image || '');
    updateMetaTag('canonical', seo.canonical_url || window.location.href);
    if (seo.keywords.length > 0) {
      updateMetaTag('keywords', seo.keywords.join(', '));
    }
  }, [seoData]);
}