export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface HomepageSection {
  id: string;
  section_key: string;
  heading: string;
  subheading?: string;
  description?: string;
  image_url?: string;
  primary_cta_label?: string;
  primary_cta_url?: string;
  secondary_cta_label?: string;
  secondary_cta_url?: string;
  content_json: Record<string, any>;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  detailed_description?: string;
  product_logo?: string;
  product_thumbnail?: string;
  product_url?: string;
  features: string[];
  benefits: string[];
  cta_label?: string;
  display_order: number;
  is_featured: boolean;
  status: 'draft' | 'published' | 'archived';
  seo_title?: string;
  seo_description?: string;
  code?: string;
  abbr?: string;
  release_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  detailed_description?: string;
  icon?: string;
  thumbnail_url?: string;
  features: string[];
  benefits: string[];
  cta_label?: string;
  cta_url?: string;
  display_order: number;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  designation: string;
  company: string;
  content: string;
  profile_image_url?: string;
  rating: number;
  display_order: number;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  original_name: string;
  file_size: number;
  mime_type: string;
  alt_text?: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  parent_id?: string | null;
  display_order: number;
  open_in_new_tab: boolean;
  is_visible: boolean;
  children: NavigationItem[];
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  general: {
    site_name: string;
    site_tagline: string;
    site_description: string;
    site_url: string;
    logo_light?: string;
    logo_dark?: string;
    favicon?: string;
    maintenance_mode?: boolean;
  };
  contact: {
    general_email: string;
    sales_email: string;
    phone: string;
    city: string;
    region: string;
    country: string;
    facebook_url?: string;
    instagram_url?: string;
    linkedin_url?: string;
    x_url?: string;
  };
  footer: {
    description: string;
    footer_logo?: string;
    legal_name: string;
    copyright_text: string;
    columns: Array<{
      heading: string;
      links: Array<{ label: string; href: string }>;
    }>;
    legal_links: Array<{ label: string; href: string }>;
  };
}

export interface SEOMetadata {
  id: string;
  page_key: string;
  title: string;
  meta_description: string;
  keywords: string[];
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
  robots_index: boolean;
  robots_follow: boolean;
  json_ld?: string;
  created_at: string;
  updated_at: string;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  display_order: number;
  status: 'published' | 'draft' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  job_id?: string;
  job_title: string;
  name: string;
  email: string;
  phone: string;
  experience_range: string;
  experience_years: number;
  portfolio_url?: string;
  resume_url?: string;
  cover_note?: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
  created_at: string;
  updated_at: string;
}

