export interface BrandAsset {
  src: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface BrandingConfig {
  siteName: string;
  legalName: string;
  tagline: string;
  logo: BrandAsset;
  banner: BrandAsset;
}

export const siteBranding: BrandingConfig = {
  siteName: 'CORPXCLOUD',
  legalName: 'CORPXCLOUD Technologies Private Limited',
  tagline: 'One cloud platform to run your entire enterprise.',
  logo: {
    src: '/logo.jpeg',
    url: '/logo.jpeg',
    alt: 'CORPXCLOUD Technologies Private Limited',
    width: 1254,
    height: 1254,
  },
  banner: {
    src: '/logo.jpeg',
    url: '/logo.jpeg',
    alt: 'CORPXCLOUD',
    width: 1600,
    height: 270,
  },
};
