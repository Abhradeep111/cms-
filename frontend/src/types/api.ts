export interface SectionContent {
  id: string;
  section: string;
  content: string;
  description: string;
  image: string;
  extra: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}





export interface SEOData {

  id: string;

  page: string;
  title: string;
  description: string;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image: string | null;
  canonical_url: string | null;
  keywords: string[];
  json_ld: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface HomepageCategory {
  id: string;
  section: string;
  name: string;
  description: string;
  icon: string;
  iconUrl: string;
  order: number;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface HomepageProductModule {
  id: string;
  section: string;
  name: string;
  abbr: string;
  code: string;
  status: 'live' | 'roadmap';
  release: string | null;
  summary: string;
  capabilities: string[];
  icon: string;
  iconUrl: string;
  link: string;
  order: number;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface HomepageHeroStat {
  id: string;
  key: string;
  label: string;
  metric: string;
  caption: string;
  delta: string;
  bars: number[];
  icon: string;
  iconUrl: string;
  order: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface HomepageArchitecturePillar {
  id: string;
  title: string;
  body: string;
  stat: string;
  icon: string;
  iconUrl: string;
  order: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface HomepageRoadmapPhase {
  id: string;
  period: string;
  state: 'shipped' | 'next' | 'later';
  items: string[];
  order: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface HomepageFooterColumn {
  id: string;
  heading: string;
  links: FooterLink[];
  order: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface HomepageFooterLegalLink {
  id: string;
  label: string;
  href: string;
  order: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface HomepageFooterSettings {
  id: string;
  description: string;
  legalName: string;
  city: string;
  region: string;
  country: string;
  email: string;
  salesEmail: string;
  linkedin: string;
  facebook?: string;
  instagram?: string;
  x?: string;
  copyright: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface HomepageFooter {
  columns: HomepageFooterColumn[];
  legalLinks: HomepageFooterLegalLink[];
  settings: HomepageFooterSettings;
}

export interface HomepageBranding {
  id: string;
  siteName: string;
  logo: string;
  logoUrl: string;
  logoDark: string;
  logoDarkUrl: string;
  favicon: string;
  faviconUrl: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface HomepageData {
  content: {
    id: string;
    content: string;
    image: string;
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
  } | null;
  sections: Record<string, SectionContent>;
  seo: SEOData | null;
  categories: HomepageCategory[];
  productModules?: HomepageProductModule[];
  modules?: HomepageProductModule[];
  heroStats?: HomepageHeroStat[];
  architecturePillars?: HomepageArchitecturePillar[];
  roadmapPhases?: HomepageRoadmapPhase[];
  footer?: HomepageFooter;
  branding?: HomepageBranding;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface PrivacyPolicySection {
  heading: string;
  content: string;
  order?: number;
}

export interface PrivacyPolicyData {
  id: string;
  title: string;
  introduction: string;
  sections: PrivacyPolicySection[];
  last_updated: string;
  is_published: boolean;
  published_at: string | null;
  content: string;
  image: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface TermsAndConditionsSection {
  heading: string;
  content: string;
  order?: number;
}

export interface TermsAndConditionsData {
  id: string;
  title: string;
  introduction: string;
  sections: TermsAndConditionsSection[];
  last_updated: string;
  is_published: boolean;
  published_at: string | null;
  content?: string;
  created_at?: string;
  updated_at?: string;
  is_deleted?: boolean;
}

export interface AboutUsData {
  id?: string;
  title?: string;
  subtitle?: string;
  company_story?: string;
  mission?: string;
  vision?: string;
  services?: Array<{ title: string; description: string; icon?: string }>;
  technologies?: Array<{ title: string; description: string; stat?: string }>;
  stats?: Array<{ label: string; value: string }>;
}
