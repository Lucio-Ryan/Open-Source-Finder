import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Code2, ChevronRight } from 'lucide-react';
import { SearchBar, AlternativeCard, SponsoredAlternativeCard, NewsletterSection, AlternativesGridWithAds, isActiveSponsor } from '@/components/ui';
import { 
  getFeaturedAlternatives, 
  getProprietarySoftware,
  getStats,
  getAlternatives,
} from '@/lib/mongodb/queries';

// Enable ISR - revalidate every 60 seconds for better performance
export const revalidate = 60;

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://opensrc.me/',
  },
};

export default async function Home() {
  let featuredAlternatives: Awaited<ReturnType<typeof getFeaturedAlternatives>> = [];
  let proprietarySoftware: Awaited<ReturnType<typeof getProprietarySoftware>> = [];
  let stats: Awaited<ReturnType<typeof getStats>> | null = null;
  
  // Use Promise.allSettled to ensure one failure doesn't affect others
  const results = await Promise.allSettled([
    getFeaturedAlternatives(),
    getProprietarySoftware(),
    getStats(),
  ]);
  
  // Extract successful results, use defaults for failures
  if (results[0].status === 'fulfilled') {
    featuredAlternatives = results[0].value;
  } else {
    console.error('Error fetching featured alternatives:', results[0].reason);
  }
  
  if (results[1].status === 'fulfilled') {
    proprietarySoftware = results[1].value;
  } else {
    console.error('Error fetching proprietary software:', results[1].reason);
  }
  
  if (results[2].status === 'fulfilled') {
    stats = results[2].value;
  } else {
    console.error('Error fetching stats:', results[2].reason);
  }

  return (
    <div className="bg-dark min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Gradient orbs - hidden on small mobile, reduced on tablet */}
        <div className="hidden sm:block absolute top-20 left-1/4 w-48 md:w-72 lg:w-96 h-48 md:h-72 lg:h-96 bg-brand/10 rounded-full blur-3xl"></div>
        <div className="hidden sm:block absolute bottom-20 right-1/4 w-36 md:w-56 lg:w-72 h-36 md:h-56 lg:h-72 bg-brand/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-24 lg:pb-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Terminal badge */}
            <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-surface border border-border rounded-full text-brand font-mono text-xs sm:text-sm mb-6 sm:mb-8">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand rounded-full mr-2 sm:mr-3 animate-pulse"></span>
              <code className="truncate">
                $ discover <span className="text-green">{stats ? `--${stats.totalAlternatives}` : '--'}</span> alternatives
              </code>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-relaxed text-white">
              Replace your tech stack with
              <br />
              <span className="block mt-2 gradient-text-brand">open source alternatives</span>
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg text-muted mb-3 sm:mb-4 lg:mb-6 max-w-2xl mx-auto font-mono px-2">
              <span className="text-brand">{'>'}</span> A comprehensive, community-curated database of open source software alternatives to popular proprietary tools.
            </p>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto mb-6 sm:mb-7 px-2 sm:px-0">
              <SearchBar size="lg" placeholder="Search alternatives to Notion, Slack, Figma..." />
            </div>
            
            {/* Popular searches */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-mono px-2">
              <span className="text-muted">Popular:</span>
              {proprietarySoftware.slice(0, 5).map((software) => (
                <Link
                  key={software.slug}
                  href={`/alternatives-to/${software.slug}`}
                  className="text-muted hover:text-brand transition-colors touch-manipulation py-0.5"
                >
                  [{software.name}]
                </Link>
              ))}
            </div>
          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-6 mb-2 text-xs sm:text-sm font-mono text-muted">
            <span><span className="text-brand font-bold">50k+</span> monthly views</span>
            <span className="hidden sm:inline">|</span>
            <span><span className="text-brand font-bold">1.2k</span> avg. views/project</span>
            <span className="hidden sm:inline">|</span>
            <span><span className="text-brand font-bold">100+</span> newsletter subscribers</span>
          </div>
        </div>
        </div>
        
        {/* Gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent"></div>
      </section>

      {/* Simple Newsletter Section - Below Hero */}
      <NewsletterSection totalAlternatives={stats?.totalAlternatives} />

      {/* Discover Alternatives To Section */}
      <section className="py-10 sm:py-12 lg:py-16 xl:py-20 bg-surface/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10 lg:mb-12">
            <div>
              <p className="text-brand font-mono text-xs sm:text-sm mb-2 sm:mb-3">// POPULAR</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                Find Alternatives to<span className="text-brand">_</span>
              </h2>
            </div>
            <Link
              href="/alternatives-to"
              className="hidden sm:flex items-center text-muted hover:text-brand font-mono text-xs sm:text-sm transition-colors group"
            >
              View all
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {proprietarySoftware.slice(0, 8).map((software) => (
              <Link
                key={software.slug}
                href={`/alternatives-to/${software.slug}`}
                className="group p-4 sm:p-5 bg-surface border border-border rounded-xl hover:border-brand/50 transition-all touch-manipulation active:scale-[0.98]"
              >
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <h3 className="font-semibold text-sm sm:text-base text-white group-hover:text-brand transition-colors line-clamp-1">
                    {software.name}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-muted group-hover:text-brand group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                </div>
                <p className="text-xs sm:text-sm text-muted line-clamp-2 mb-2 sm:mb-3 font-mono">
                  {software.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-brand">
                    {software.alternative_count} {software.alternative_count === 1 ? 'alternative' : 'alternatives'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* Featured Alternatives */}
      <section className="py-12 sm:py-16 lg:py-20 xl:py-28 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-3"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10 lg:mb-12">
            <div>
              <p className="text-brand font-mono text-xs sm:text-sm mb-2 sm:mb-3">// FEATURED</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                Top Alternatives<span className="text-brand">_</span>
              </h2>
            </div>
            <Link
              href="/alternatives"
              className="hidden sm:flex items-center text-muted hover:text-brand font-mono text-xs sm:text-sm transition-colors group"
            >
              View all
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <AlternativesGridWithAds alternatives={featuredAlternatives} maxAds={1} />
          
          <div className="mt-8 sm:mt-10 text-center sm:hidden">
            <Link
              href="/alternatives"
              className="inline-flex items-center text-brand font-mono text-sm touch-manipulation"
            >
              View All Alternatives
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Submit CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-surface border border-border rounded-full text-brand font-mono text-xs sm:text-sm mb-4 sm:mb-6">
            <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            Contribute to the community
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
            Building a Great Project?<span className="text-brand">_</span>
          </h2>
          <p className="text-muted mb-6 sm:mb-8 max-w-xl mx-auto font-mono text-xs sm:text-sm px-2">
            Help grow the directory by submitting open source alternatives that aren&apos;t listed yet.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/submit"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-brand text-dark font-mono font-semibold rounded-lg hover:bg-brand-light transition-all hover:shadow-glow touch-manipulation active:scale-[0.98]"
            >
              Submit Project_
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
