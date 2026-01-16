import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Terminal } from 'lucide-react';
import { SearchBar, AlternativesList } from '@/components/ui';
import { getAlternatives, getCategories, getProprietarySoftware } from '@/lib/mongodb/queries';

export const metadata: Metadata = {
  title: 'All Open Source Alternatives',
  description: 'Browse 100+ open source alternatives to proprietary software. Discover free, self-hosted tools organized by category and tech stack. Find alternatives to popular services.',
  alternates: {
    canonical: '/alternatives',
  },
};

export const revalidate = 60;

export default async function AlternativesPage() {
  const [alternatives, categories, proprietarySoftware] = await Promise.all([
    getAlternatives({ approved: true, sortBy: 'health_score' }),
    getCategories(),
    getProprietarySoftware(),
  ]);

  // Transform to simpler format for the client component
  const simplifiedCategories = categories.map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));

  const simplifiedProprietary = proprietarySoftware.map(s => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
  }));

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-surface/50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/"
            className="inline-flex items-center text-muted hover:text-brand font-mono text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            cd ../home
          </Link>
          <div className="flex items-center space-x-3 mb-2">
            <Terminal className="w-8 h-8 text-brand" />
            <h1 className="text-3xl font-bold text-white">
              All Alternatives<span className="text-brand">_</span>
            </h1>
          </div>
          <p className="text-muted font-mono text-sm mb-6">
            <span className="text-brand">$</span> Browse {alternatives.length}+ curated open source alternatives
          </p>
          <div className="max-w-xl">
            <SearchBar placeholder="Search alternatives..." />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AlternativesList 
          alternatives={alternatives} 
          categories={simplifiedCategories}
          proprietarySoftware={simplifiedProprietary}
        />
      </div>
    </div>
  );
}
