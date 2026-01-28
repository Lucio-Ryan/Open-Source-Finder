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

// Enable ISR - revalidate every 60 seconds
export const revalidate = 60;

export default async function AlternativesPage() {
  let alternatives: Awaited<ReturnType<typeof getAlternatives>> = [];
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let proprietarySoftware: Awaited<ReturnType<typeof getProprietarySoftware>> = [];
  
  // Use Promise.allSettled to ensure one failure doesn't affect others
  const results = await Promise.allSettled([
    getAlternatives({ approved: true, sortBy: 'health_score' }),
    getCategories(),
    getProprietarySoftware(),
  ]);
  
  // Extract successful results, use defaults for failures
  if (results[0].status === 'fulfilled') {
    alternatives = results[0].value;
  } else {
    console.error('Error fetching alternatives:', results[0].reason);
  }
  
  if (results[1].status === 'fulfilled') {
    categories = results[1].value;
  } else {
    console.error('Error fetching categories:', results[1].reason);
  }
  
  if (results[2].status === 'fulfilled') {
    proprietarySoftware = results[2].value;
  } else {
    console.error('Error fetching proprietary software:', results[2].reason);
  }

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Link
            href="/"
            className="inline-flex items-center text-muted hover:text-brand font-mono text-xs sm:text-sm mb-3 sm:mb-4 transition-colors touch-manipulation py-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            cd ../home
          </Link>
          <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
            <Terminal className="w-6 h-6 sm:w-8 sm:h-8 text-brand" />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              All Alternatives<span className="text-brand">_</span>
            </h1>
          </div>
          <p className="text-muted font-mono text-xs sm:text-sm mb-4 sm:mb-6">
            <span className="text-brand">$</span> Browse {alternatives.length}+ curated open source alternatives
          </p>
          <div className="max-w-xl">
            <SearchBar placeholder="Search alternatives..." />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <AlternativesList 
          alternatives={alternatives} 
          categories={simplifiedCategories}
          proprietarySoftware={simplifiedProprietary}
        />
      </div>
    </div>
  );
}
