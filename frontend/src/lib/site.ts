import type { FooterColumn, NavLink } from '@/types';
import { liveModules, roadmapModules } from '@/data/modules';
import { siteBranding } from './branding';

export { siteBranding } from './branding';

export const site = {
  name: 'CORPXCLOUD',
  legalName: 'CORPXCLOUD Technologies Private Limited',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://corpxcloud.com',
  tagline: 'One unified cloud platform for your entire enterprise',
  description:
    'A multi-tenant enterprise cloud platform. HRMS, Hospital Management and Vendor & Inventory are live today; ERP, IGA, CRM, Restaurant and Institute management ship through 2026.',
  email: {
    general: 'contact@corpxcloud.com',
    sales: process.env.NEXT_PUBLIC_SALES_EMAIL ?? '',
  },
  phone: process.env.NEXT_PUBLIC_PHONE ?? '+91 9635493346',
  address: {
    city: 'Kolkata',
    region: 'West Bengal',
    country: 'India',
  },
  social: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? 'https://www.facebook.com/people/corpxcloud/61593336181697/',
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? 'https://www.instagram.com/corpxcloud/',
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? 'https://www.linkedin.com/company/corpxcloud-technologies-private-limited',
  },
  branding: siteBranding,
};

export const navLinks: NavLink[] = [
  { label: 'Products', href: '/module' },
  { label: 'Solutions', href: '/enterprise-solutions' },
  { label: 'Enterprise', href: '/#enterprise' },
  // { label: 'Pricing', href: '/#pricing' },
  { label: 'About', href: '/about-us' },
  { label: 'Contact', href: '/contact-us' },
  { label: 'Careers', href: '/careers' },
];

export const footerColumns: FooterColumn[] = [
  {
    heading: 'Available now',
    links: liveModules.map((m) => ({ label: m.name, href: '/module' })),
  },
  {
    heading: 'Upcoming systems',
    links: roadmapModules.map((m) => ({ label: m.name, href: '/module' })),
  },
  {
    heading: 'Platform',
    links: [
      { label: 'Enterprise Solutions', href: '/enterprise-solutions' },
      { label: 'Architecture', href: '/#enterprise' },
      { label: 'Security & compliance', href: '/#enterprise' },
      { label: 'API documentation', href: '/#enterprise' },
      { label: 'Status page', href: '/#enterprise' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about-us' },
      { label: 'Solutions by industry', href: '/enterprise-solutions' },
      { label: 'Contact Us', href: '/contact-us' },
      { label: 'Book a demo', href: '/book-demo' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact sales', href: '/contact-us' },
    ],
  },
];

export const legalLinks: NavLink[] = [
  { label: 'Privacy policy', href: '/privacy-policy' },
  { label: 'Terms & conditions', href: '/terms-and-conditions' },
];
