import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { StructuredData } from '@/components/seo/StructuredData';
import { CriticalPreloads } from '@/components/seo/Performance';
import { BannerAd } from '@/components/ui/BannerAd';
import { PopupAd } from '@/components/ui/PopupAd';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://opensrc.me'),
  title: {
    default: 'OPEN_SRC.ME - Open Source Alternatives to Software',
    template: '%s | OPEN_SRC.ME',
  },
  description: 'Discover the best open source alternatives to popular proprietary software. Browse 100+ free, self-hosted tools by category and tech stack.',
  keywords: ['open source', 'alternatives', 'free software', 'self-hosted', 'privacy', 'open source software', 'proprietary software alternatives', 'FOSS', 'free open source'],
  authors: [{ name: 'OPEN_SRC.ME', url: 'https://opensrc.me' }],
  creator: 'OPEN_SRC.ME',
  publisher: 'OPEN_SRC.ME',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: 'https://opensrc.me/favicon.svg', type: 'image/svg+xml' },
      { url: '/assets/logo.svg', type: 'image/svg+xml', sizes: '64x64' },
    ],
    apple: [
      { url: '/apple-touch-icon.svg', type: 'image/svg+xml', sizes: '180x180' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://opensrc.me/',
    siteName: 'OPEN_SRC.ME',
    title: 'OPEN_SRC.ME - Discover Open Source Alternatives',
    description: 'Find the best open source alternatives to popular proprietary software. Browse by category, tech stack, or search directly.',
    images: [
      {
        url: 'https://opensrc.me/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'OPEN_SRC.ME - Open Source Alternatives to Software',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OPEN_SRC.ME - Open Source Alternatives',
    description: 'Discover free, open source alternatives to proprietary software',
    creator: '@opensrcme',
    images: ['https://opensrc.me/twitter-image'],
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
    canonical: 'https://opensrc.me/',
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
        <CriticalPreloads />
        <script defer src="https://cloud.umami.is/script.js" data-website-id="67610b2b-567d-460f-898a-9161a00540ce"></script>
        <meta charSet="utf-8" />
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
