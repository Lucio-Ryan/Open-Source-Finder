import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { StructuredData } from '@/components/seo/StructuredData';
import { BannerAd, PopupAd } from '@/components/ui';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'OS Finder - Discover Open Source Alternatives to Proprietary Software',
    template: '%s | OS Finder',
  },
  description: 'Discover the best open source alternatives to popular proprietary software. Browse 100+ free, self-hosted tools by category and tech stack. Find privacy-focused replacements for Notion, Slack, Figma and more.',
  keywords: ['open source', 'alternatives', 'free software', 'self-hosted', 'privacy', 'open source software', 'proprietary software alternatives', 'FOSS', 'free open source'],
  authors: [{ name: 'OS Finder', url: 'https://osfinder.com' }],
  creator: 'OS Finder',
  publisher: 'OS Finder',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/assets/logo.svg', type: 'image/svg+xml', sizes: '64x64' },
    ],
    apple: [
      { url: '/apple-touch-icon.svg', type: 'image/svg+xml', sizes: '180x180' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'OS Finder',
    title: 'OS Finder - Discover Open Source Alternatives',
    description: 'Find the best open source alternatives to popular proprietary software. Browse by category, tech stack, or search directly.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OS Finder - Open Source Alternatives',
    description: 'Discover free, open source alternatives to proprietary software',
    creator: '@osfinder',
  },
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
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'} />
        <StructuredData />
      </head>
      <body className="min-h-screen bg-dark text-white flex flex-col antialiased">
        <AuthProvider>
          <BannerAd />
          <Header />
          <main className="flex-grow" role="main">
            {children}
          </main>
          <Footer />
          <PopupAd />
        </AuthProvider>
      </body>
    </html>
  );
}
