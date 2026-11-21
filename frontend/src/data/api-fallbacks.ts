import type {
  AboutUsData,
  HomepageBranding,
  HomepageData,
  HomepageFooter,
  HomepageProductModule,
  PrivacyPolicyData,
  TermsAndConditionsData,
} from '@/types/api';
import { modules } from '@/data/modules';
import { footerColumns, legalLinks, site } from '@/lib/site';

export function createFallbackProductModules(): HomepageProductModule[] {
  return modules.map((module) => ({
    id: module.id,
    section: 'products',
    name: module.name,
    abbr: module.abbr,
    code: module.code,
    status: module.status,
    release: module.release || null,
    summary: module.summary,
    capabilities: module.capabilities,
    icon: '',
    iconUrl: '',
    link: module.link || '',
    order: 0,
    created_at: '',
    updated_at: '',
    is_deleted: false,
  }));
}

export function createFallbackHomepageData(): HomepageData {
  const productModules = createFallbackProductModules();
  return {
    content: null,
    sections: {},
    seo: null,
    categories: [],
    productModules,
    modules: productModules,
    heroStats: [],
    architecturePillars: [],
    roadmapPhases: [],
    footer: createFallbackHomepageFooter(),
    branding: createFallbackHomepageBranding(),
  };
}

export function createFallbackHomepageFooter(): HomepageFooter {
  return {
    columns: footerColumns.map((column, order) => ({
      id: `fallback-column-${order}`,
      heading: column.heading,
      links: column.links,
      order,
      is_deleted: false,
      created_at: '',
      updated_at: '',
    })),
    legalLinks: legalLinks.map((link, order) => ({
      id: `fallback-legal-link-${order}`,
      label: link.label,
      href: link.href,
      order,
      is_deleted: false,
      created_at: '',
      updated_at: '',
    })),
    settings: {
      id: 'fallback-footer-settings',
      description:
        'An all-in-one, multi-tenant enterprise cloud platform. Seven modules, one tenant, one source of truth.',
      legalName: site.legalName,
      city: site.address.city,
      region: site.address.region,
      country: site.address.country,
      email: site.email.general,
      salesEmail: site.email.sales,
      linkedin: site.social.linkedin,
      facebook: site.social.facebook,
      instagram: site.social.instagram,
      copyright: `© ${new Date().getFullYear()} ${site.legalName}. All rights reserved.`,
      is_deleted: false,
      created_at: '',
      updated_at: '',
    },
  };
}

export function createFallbackHomepageBranding(): HomepageBranding {
  return {
    id: 'fallback-branding',
    siteName: site.name,
    logo: '',
    logoUrl: '',
    logoDark: '',
    logoDarkUrl: '',
    favicon: '',
    faviconUrl: '',
    is_deleted: false,
    created_at: '',
    updated_at: '',
  };
}

export const fallbackAboutUsData: AboutUsData = {};

export const fallbackPrivacyPolicyData: PrivacyPolicyData = {
  id: 'fallback-privacy-policy',
  title: 'Privacy Policy',
  introduction:
    `Policy details are temporarily unavailable. For privacy questions, contact ${site.email.general}.`,
  sections: [],
  last_updated: '',
  is_published: false,
  published_at: null,
  content: '',
  image: '',
  created_at: '',
  updated_at: '',
  is_deleted: false,
};

export const fallbackTermsAndConditionsData: TermsAndConditionsData = {
  id: 'fallback-terms-and-conditions',
  title: 'Terms and Conditions',
  introduction: '',
  sections: [],
  last_updated: '2026-10-27',
  is_published: true,
  published_at: null,
  content: '',
  created_at: '',
  updated_at: '',
  is_deleted: false,
};
