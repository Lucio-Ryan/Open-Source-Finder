'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Terminal, Loader2, ArrowRight, Filter, X } from 'lucide-react';
import { SearchBar, AlternativeCard, SponsoredAlternativeCard, CardAd, useCardAds, intersperseAds, isAdvertisement, isActiveSponsor } from '@/components/ui';
import type { AlternativeWithRelations } from '@/types/database';

interface ProprietaryMatch {
  name: string;
  slug: string;
}

type SortOption = 'health_score' | 'stars' | 'name' | 'recent' | 'votes';

interface Filters {
  sortBy: SortOption;
  selfHostedOnly: boolean;
  selectedTags: string[];
  selectedCategory: string;
}

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<AlternativeWithRelations[]>([]);
  const [proprietaryMatches, setProprietaryMatches] = useState<ProprietaryMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState<Filters>({
    sortBy: 'votes',
    selfHostedOnly: false,
    selectedTags: [],
    selectedCategory: '',
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    async function fetchResults() {
      if (!query || query.length < 2) {
        setResults([]);
        setProprietaryMatches([]);
        setSearched(false);
        return;
      }

      setLoading(true);
      setSearched(true);

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data.results || []);
        setProprietaryMatches(data.proprietaryMatches || []);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
        setProprietaryMatches([]);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [query]);

  // Extract available tags and categories from results
  const availableTags = useMemo(() => {
    const tagMap = new Map<string, { name: string; slug: string; count: number }>();
    results.forEach(alt => {
      alt.tags?.forEach(tag => {
        const existing = tagMap.get(tag.slug);
        if (existing) {
          existing.count++;
        } else {
          tagMap.set(tag.slug, { name: tag.name, slug: tag.slug, count: 1 });
        }
      });
    });
    return Array.from(tagMap.values()).sort((a, b) => b.count - a.count).slice(0, 6);
  }, [results]);

  const availableCategories = useMemo(() => {
    const categoryMap = new Map<string, { name: string; slug: string; count: number }>();
    results.forEach(alt => {
      alt.categories?.forEach(cat => {
        const existing = categoryMap.get(cat.slug);
        if (existing) {
          existing.count++;
        } else {
          categoryMap.set(cat.slug, { name: cat.name, slug: cat.slug, count: 1 });
        }
      });
    });
    return Array.from(categoryMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [results]);

  // Apply filters and sorting to results
  const filteredResults = useMemo(() => {
    let filtered = [...results];

    // Filter by category
    if (filters.selectedCategory) {
      filtered = filtered.filter(alt => 
        alt.categories?.some(cat => cat.slug === filters.selectedCategory)
      );
    }

    // Filter by self-hosted
    if (filters.selfHostedOnly) {
      filtered = filtered.filter(alt => alt.is_self_hosted);
    }

    // Filter by selected tags
    if (filters.selectedTags.length > 0) {
      filtered = filtered.filter(alt =>
        alt.tags?.some(tag => filters.selectedTags.includes(tag.slug))
      );
    }

    // Sort results
    switch (filters.sortBy) {
      case 'votes':
        filtered.sort((a, b) => ((b as any).vote_score || 0) - ((a as any).vote_score || 0));
        break;
      case 'stars':
        filtered.sort((a, b) => (b.stars || 0) - (a.stars || 0));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'recent':
        filtered.sort((a, b) => {
          const dateA = a.last_commit ? new Date(a.last_commit).getTime() : 0;
          const dateB = b.last_commit ? new Date(b.last_commit).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case 'health_score':
      default:
        filtered.sort((a, b) => (b.health_score || 0) - (a.health_score || 0));
        break;
    }

    return filtered;
  }, [results, filters]);

  const toggleTag = (slug: string) => {
    setFilters(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(slug)
        ? prev.selectedTags.filter(t => t !== slug)
        : [...prev.selectedTags, slug],
    }));
  };

  const { ads } = useCardAds();

  // Intersperse ads into filtered results
  const itemsWithAds = useMemo(() => {
    return intersperseAds(filteredResults, ads, 6);
  }, [filteredResults, ads]);

  const clearFilters = () => {
    setFilters({
      sortBy: 'votes',
      selfHostedOnly: false,
      selectedTags: [],
      selectedCategory: '',
    });
  };

  const hasActiveFilters = filters.selfHostedOnly || filters.selectedTags.length > 0 || filters.sortBy !== 'votes' || filters.selectedCategory !== '';

  // Filter sidebar component (reused for desktop and mobile)
  const FilterSidebar = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={`bg-surface rounded-xl border border-border p-6 ${isMobile ? '' : 'sticky top-24'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-brand" />
          <h2 className="font-mono text-white">// Filters</h2>
        </div>
        {isMobile && (
          <button
            onClick={() => setShowMobileFilters(false)}
            className="text-muted hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full mb-4 px-3 py-2 text-xs font-mono text-orange-400 bg-orange-500/10 rounded-lg hover:bg-orange-500/20 transition-colors"
        >
          Clear All Filters
        </button>
      )}
      
      <div className="space-y-6">
        {/* Sort By */}
        <div>
          <label className="block text-xs font-mono text-muted mb-2">
            Sort By
          </label>
          <select 
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as SortOption }))}
            className="w-full px-3 py-2.5 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50"
          >
            <option value="votes">Most Upvoted</option>
            <option value="health_score">Health Score</option>
            <option value="stars">GitHub Stars</option>
            <option value="recent">Recently Updated</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>

        {/* Category Filter */}
        {availableCategories.length > 0 && (
          <div>
            <label className="block text-xs font-mono text-muted mb-2">
              Category
            </label>
            <select
              value={filters.selectedCategory}
              onChange={(e) => setFilters(prev => ({ ...prev, selectedCategory: e.target.value }))}
              className="w-full px-3 py-2.5 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50"
            >
              <option value="">All Categories</option>
              {availableCategories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Self-Hosted */}
        <div>
          <label className="flex items-center space-x-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.selfHostedOnly}
              onChange={(e) => setFilters(prev => ({ ...prev, selfHostedOnly: e.target.checked }))}
              className="w-4 h-4 rounded border-border bg-dark text-brand focus:ring-brand/50"
            />
            <span className="text-sm font-mono text-muted group-hover:text-white transition-colors">Self-Hosted Only</span>
          </label>
        </div>

        {/* Tags */}
        {availableTags.length > 0 && (
          <div>
            <label className="block text-xs font-mono text-muted mb-2">
              Filter by Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag.slug}
                  onClick={() => toggleTag(tag.slug)}
                  className={`px-2 py-1 text-xs font-mono rounded transition-colors ${
                    filters.selectedTags.includes(tag.slug)
                      ? 'bg-brand/20 border border-brand text-brand'
                      : 'bg-dark border border-border text-muted hover:border-brand/30 hover:text-brand'
                  }`}
                >
                  #{tag.name.replace(/-/g, '_')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="text-center py-16 font-mono text-muted">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-brand" />
        <span className="text-brand">$</span> Searching...
      </div>
    );
  }

  return (
    <>
      {searched ? (
        <>
          {/* Proprietary software matches */}
          {proprietaryMatches.length > 0 && (
            <div className="mb-8 p-4 bg-surface rounded-xl border border-border">
              <p className="text-sm text-muted font-mono mb-3">
                <span className="text-brand">Looking for alternatives to:</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {proprietaryMatches.map((match) => (
                  <Link
                    key={match.slug}
                    href={`/alternatives-to/${match.slug}`}
                    className="inline-flex items-center px-4 py-2 bg-orange-500/10 text-orange-400 rounded-lg hover:bg-orange-500/20 transition-colors text-sm font-mono"
                  >
                    {match.name}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block lg:w-64 flex-shrink-0">
              <FilterSidebar />
            </aside>

            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="inline-flex items-center px-4 py-2 bg-surface border border-border rounded-lg text-muted hover:text-white hover:border-brand/50 transition-colors font-mono text-sm"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 px-1.5 py-0.5 bg-brand/20 text-brand text-xs rounded">
                    {(filters.selfHostedOnly ? 1 : 0) + filters.selectedTags.length}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Filter Modal */}
            {showMobileFilters && (
              <div className="lg:hidden fixed inset-0 z-50 bg-dark/80 backdrop-blur-sm">
                <div className="fixed inset-x-4 top-20 max-h-[70vh] overflow-y-auto">
                  <FilterSidebar isMobile />
                </div>
              </div>
            )}

            {/* Main Content */}
            <main className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted font-mono text-sm">
                  <span className="text-brand">found:</span> {filteredResults.length} {filteredResults.length === 1 ? 'alternative' : 'alternatives'}
                  {filteredResults.length !== results.length && (
                    <span className="text-muted/70"> (filtered from {results.length})</span>
                  )}
                </p>
              </div>

              {filteredResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {itemsWithAds.map((item) => (
                    isAdvertisement(item) ? (
                      <CardAd key={`ad-${item.id}`} ad={item} />
                    ) : isActiveSponsor(item) ? (
                      <SponsoredAlternativeCard key={item.id} alternative={item} />
                    ) : (
                      <AlternativeCard key={item.id} alternative={item} />
                    )
                  ))}
                </div>
              ) : results.length > 0 ? (
                <div className="text-center py-16 bg-surface rounded-xl border border-border">
                  <Filter className="w-12 h-12 text-muted/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No matches with current filters<span className="text-brand">_</span></h3>
                  <p className="text-muted font-mono text-sm mb-6">
                    Try adjusting your filters to see more results
                  </p>
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center px-6 py-3 bg-brand text-dark font-mono font-semibold rounded-lg hover:bg-brand-light transition-all hover:shadow-glow"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="text-center py-16 bg-surface rounded-xl border border-border">
                  <Search className="w-12 h-12 text-muted/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No alternatives found<span className="text-brand">_</span></h3>
                  <p className="text-muted font-mono text-sm mb-6">
                    Try searching for a different software name or browse our categories
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Link
                      href="/categories"
                      className="inline-flex items-center px-6 py-3 bg-brand text-dark font-mono font-semibold rounded-lg hover:bg-brand-light transition-all hover:shadow-glow"
                    >
                      Browse Categories
                    </Link>
                    <Link
                      href="/alternatives"
                      className="inline-flex items-center px-6 py-3 bg-surface border border-border text-white font-mono font-semibold rounded-lg hover:border-brand/50 transition-all"
                    >
                      View All Alternatives
                    </Link>
                  </div>
                </div>
              )}
            </main>
          </div>
        </>
      ) : (
        <div className="text-center py-16 bg-surface rounded-xl border border-border">
          <Terminal className="w-12 h-12 text-brand/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Search<span className="text-brand">_</span></h3>
          <p className="text-muted font-mono text-sm mb-4">
            <span className="text-brand">$</span> Enter a software name to find open source alternatives
          </p>
          <p className="text-muted/70 text-sm">
            Try searching for: Photoshop, Slack, Notion, Figma, Firebase...
          </p>
        </div>
      )}
    </>
  );
}

export default function SearchPage() {
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
          <div className="flex items-center space-x-3 mb-6">
            <Search className="w-8 h-8 text-brand" />
            <h1 className="text-3xl font-bold text-white">
              Search<span className="text-brand">_</span>
            </h1>
          </div>
          <div className="max-w-2xl">
            <SearchBar size="lg" placeholder="Search for software like Photoshop, Slack, Notion..." syncWithUrl />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={
          <div className="text-center py-16 font-mono text-muted">
            <span className="text-brand animate-pulse">$</span> Loading results...
          </div>
        }>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}
