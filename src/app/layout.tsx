import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AuthProvider } from '@/lib/auth/AuthContext';

export const metadata: Metadata = {
  title: 'OSS_Finder - Discover Open Source Alternatives',
  description: 'Find the best open source alternatives to popular proprietary software. Browse by category, tech stack, or search directly.',
  keywords: ['open source', 'alternatives', 'free software', 'self-hosted', 'privacy'],
  authors: [{ name: 'OpenSourceFinder' }],
  openGraph: {
    title: 'OSS_Finder - Discover Open Source Alternatives',
    description: 'Find the best open source alternatives to popular proprietary software.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OSS_Finder',
    description: 'Discover open source alternatives to proprietary software',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-dark text-white flex flex-col antialiased">
        <AuthProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
