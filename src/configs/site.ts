import { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';

// Font configurations - Professional fonts
export const inter = localFont({
  src: [
    {
      path: '../app/fonts/Inter/Inter-VariableFont_opsz,wght.ttf',
      style: 'normal',
    },
    {
      path: '../app/fonts/Inter/Inter-Italic-VariableFont_opsz,wght.ttf',
      style: 'italic',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
  weight: '100 900',
  fallback: ['system-ui', 'sans-serif'],
});

// Arabic font fallback - using system fonts for Arabic
export const arabicFont = {
  variable: '--font-arabic',
  style: {
    fontFamily: 'var(--font-arabic), "Segoe UI", "Tahoma", "Arial", sans-serif',
  },
};

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0c4da2' },
    { media: '(prefers-color-scheme: dark)', color: '#0a3d8a' },
  ],
  userScalable: true,
};

// Site configuration - Professional Saudi-style delivery service platform
export const siteConfig = {
  name: 'Nukhbat Naql',
  title: 'Nukhbat Naql - Professional Shipping and Delivery Platform',
  description:
    'Comprehensive shipping and delivery platform in Saudi Arabia with real-time tracking and advanced logistics services',
  url: 'https://nukhbat-naql.sa',
  keywords:
    'shipping, delivery, transportation, logistics, shipment tracking, transportation services, Saudi Arabia, Riyadh, Jeddah, Dammam, Nukhbat Naql, نقل, شحن, توصيل, لوجستيات',
  author: 'Nukhbat Naql',
  category: 'Transportation & Logistics',
  ogImage: 'opengraph-image.png',
  locale: 'en_US',
  icons: {
    // Basic favicon
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', size: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', size: '32x32', type: 'image/png' },
    ],
    // Apple Touch Icons
    apple: [
      {
        url: '/icons/apple-touch-icon.png',
        size: '180x180',
        type: 'image/png',
      },
      {
        url: '/icons/android-chrome-192x192.png',
        size: '192x192',
        type: 'image/png',
      },
      {
        url: '/icons/android-chrome-512x512.png',
        size: '512x512',
        type: 'image/png',
      },
    ],
    // Web manifest
    other: [{ rel: 'manifest', url: '/site.webmanifest' }],
  },
  languages: {
    'en-US': '/en',
    'ar-SA': '/ar',
  },
  twitterHandle: '@NukhbatNaql',
  shortDescription:
    'Integrated platform for professional shipping and delivery services in the Kingdom of Saudi Arabia with advanced technologies and comprehensive solutions.',
  features: [
    'Real-time shipment tracking',
    'Professional delivery services',
    'Advanced logistics management',
    'Comprehensive shipping solutions',
    'Instant notifications and alerts',
    'Detailed analytics and reporting',
    'Driver performance monitoring',
    'Vehicle status and health tracking',
  ],
  targetAudience: [
    'Business Owners',
    'Logistics Managers',
    'Shipping Companies',
    'E-commerce Businesses',
    'Delivery Service Providers',
  ],
  colors: {
    primary: '#0c4da2',
    secondary: '#2ecc71',
    accent: '#e74c3c',
    neutral: '#2c3e50',
    light: '#ecf0f1',
  },
  fonts: {
    arabic: arabicFont,
    inter: inter,
  },
  social: {
    twitter: 'https://twitter.com/NukhbatNaql',
    linkedin: 'https://linkedin.com/company/nukhbat-naql',
    email: 'info@nukhbat-naql.sa',
    phone: '+966112345678',
  },
  company: {
    name: 'Nukhbat Naql',
    address: 'Riyadh, Kingdom of Saudi Arabia',
    foundingYear: '2023',
  },
} as const;

// Construct metadata object from siteConfig
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}${siteConfig.ogImage}`,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Professional Shipping and Delivery Platform`,
      },
    ],
    emails: [siteConfig.social.email],
    phoneNumbers: [siteConfig.social.phone],
    countryName: 'Kingdom of Saudi Arabia',
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: siteConfig.title,
    description: siteConfig.shortDescription,
    images: [`${siteConfig.url}${siteConfig.ogImage}`],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      {
        url: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    other: [
      {
        rel: 'apple-touch-icon',
        url: '/icons/apple-touch-icon.png',
      },
      {
        rel: 'manifest',
        url: '/site.webmanifest',
      },
      {
        rel: 'icon',
        type: 'image/png',
        url: '/icons/android-chrome-192x192.png',
        sizes: '192x192',
      },
      {
        rel: 'icon',
        type: 'image/png',
        url: '/icons/android-chrome-512x512.png',
        sizes: '512x512',
      },
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: siteConfig.colors.primary,
      },
    ],
  },
  alternates: {
    languages: siteConfig.languages,
    canonical: siteConfig.url,
  },
  authors: [{ name: siteConfig.author, url: siteConfig.url }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  applicationName: siteConfig.name,
  category: siteConfig.category,
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
    url: true,
  },
  other: {
    'application-type': 'Shipping and Delivery Management Software',
    'target-industry': 'Transportation & Logistics',
    'primary-purpose': 'Shipping Operations Management',
    'company-foundation': siteConfig.company.foundingYear,
    'company-address': siteConfig.company.address,
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};