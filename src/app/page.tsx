import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Code2, ChevronRight, Github, Rocket } from 'lucide-react';
import { SearchBar, AlternativeCard, SponsoredAlternativeCard, NewsletterForm, AlternativesGridWithAds, isActiveSponsor } from '@/components/ui';
import { 
  getFeaturedAlternatives, 
  getProprietarySoftware,
  getAlternatives,
} from '@/lib/supabase/queries';

// Enable ISR with revalidation
export const revalidate = 60;

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

export default async function Home() {
  const [featuredAlternatives, proprietarySoftware, recentLaunches] = await Promise.all([
    getFeaturedAlternatives(),
    getProprietarySoftware(),
    getAlternatives({ approved: true, sortBy: 'created_at', sortOrder: 'desc', limit: 6 }),
  ]);

  return (
    <div className="bg-dark min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Gradient orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-brand/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Terminal badge */}
            <div className="inline-flex items-center px-4 py-2 bg-surface border border-border rounded-full text-brand font-mono text-sm mb-8">
              <span className="w-2 h-2 bg-brand rounded-full mr-3 animate-pulse"></span>
              <code>$ discover --alternatives</code>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight text-white">
              Open Source
              <br />
              <span className="gradient-text-brand">Alternatives_</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted mb-12 max-w-2xl mx-auto font-mono">
              <span className="text-brand">{'>'}</span> Find free, open source replacements for proprietary software. 
              Self-host for complete control.
            </p>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto mb-10">
              <SearchBar size="lg" placeholder="Search alternatives to Notion, Slack, Figma..." />
            </div>
            
            {/* Popular searches */}
            <div className="flex flex-wrap justify-center gap-3 text-sm font-mono">
              <span className="text-muted">Popular:</span>
              {proprietarySoftware.slice(0, 5).map((software) => (
                <Link
                  key={software.slug}
                  href={`/alternatives-to/${software.slug}`}
                  className="text-muted hover:text-brand transition-colors"
                >
                  [{software.name}]
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent"></div>
      </section>

      {/* Discover Alternatives To Section */}
      <section className="py-16 lg:py-20 bg-surface/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-brand font-mono text-sm mb-3">// POPULAR</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Find Alternatives to<span className="text-brand">_</span>
              </h2>
            </div>
            <Link
              href="/alternatives-to"
              className="hidden sm:flex items-center text-muted hover:text-brand font-mono text-sm transition-colors group"
            >
              View all
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {proprietarySoftware.slice(0, 8).map((software) => (
              <Link
                key={software.slug}
                href={`/alternatives-to/${software.slug}`}
                className="group p-5 bg-surface border border-border rounded-xl hover:border-brand/50 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-white group-hover:text-brand transition-colors">
                    {software.name}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-muted group-hover:text-brand group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-sm text-muted line-clamp-2 mb-3 font-mono">
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

      {/* Recently Launched Section */}
      <section className="py-16 lg:py-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-brand font-mono text-sm mb-3 flex items-center gap-2">
                <Rocket className="w-4 h-4" />
                // RECENTLY LAUNCHED
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                New Arrivals<span className="text-brand">_</span>
              </h2>
            </div>
            <Link
              href="/launches"
              className="hidden sm:flex items-center text-muted hover:text-brand font-mono text-sm transition-colors group"
            >
              View all launches
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentLaunches.map((alternative) => (
              isActiveSponsor(alternative) ? (
                <SponsoredAlternativeCard key={alternative.id} alternative={alternative} />
              ) : (
                <AlternativeCard key={alternative.id} alternative={alternative} />
              )
            ))}
          </div>
          
          <div className="mt-10 text-center sm:hidden">
            <Link
              href="/launches"
              className="inline-flex items-center text-brand font-mono text-sm"
            >
              View All Launches
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Alternatives */}
      <section className="py-20 lg:py-28 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-3"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-brand font-mono text-sm mb-3">// FEATURED</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Top Alternatives<span className="text-brand">_</span>
              </h2>
            </div>
            <Link
              href="/alternatives"
              className="hidden sm:flex items-center text-muted hover:text-brand font-mono text-sm transition-colors group"
            >
              View all
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <AlternativesGridWithAds alternatives={featuredAlternatives} maxAds={1} />
          
          <div className="mt-10 text-center sm:hidden">
            <Link
              href="/alternatives"
              className="inline-flex items-center text-brand font-mono text-sm"
            >
              View All Alternatives
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Terminal CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-box">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              <span className="ml-4 text-muted text-xs font-mono">newsletter.sh</span>
            </div>
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Stay Updated<span className="text-brand">_</span>
                </h2>
                <p className="text-muted font-mono text-sm">
                  <span className="text-brand">$</span> Get weekly updates on new alternatives and community picks
                </p>
              </div>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>

      {/* Submit CTA Section */}
      <section className="py-20 border-t border-border relative">
        <div className="absolute inset-0 bg-gradient-to-t from-brand/5 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-surface border border-border rounded-full text-brand font-mono text-sm mb-6">
            <Code2 className="w-4 h-4 mr-2" />
            Contribute to the community
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Know a Great Project?<span className="text-brand">_</span>
          </h2>
          <p className="text-muted mb-8 max-w-xl mx-auto font-mono text-sm">
            Help grow the directory by submitting open source alternatives that aren&apos;t listed yet.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/submit"
              className="inline-flex items-center px-8 py-4 bg-brand text-dark font-mono font-semibold rounded-lg hover:bg-brand-light transition-all hover:shadow-glow"
            >
              Submit Project_
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-surface border border-border text-white font-mono rounded-lg hover:border-brand/50 transition-colors"
            >
              <Github className="w-5 h-5 mr-2" />
              View on GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
