'use client';

import { useState, useMemo } from 'react';
import { Filter, ChevronDown, X } from 'lucide-react';
import { AlternativeCard } from './AlternativeCard';
import { SponsoredAlternativeCard } from './SponsoredAlternativeCard';
import { CardAd, useCardAds, intersperseAds, isAdvertisement } from './CardAd';
import { Pagination } from './Pagination';
import type { AlternativeWithRelations } from '@/types/database';

// Helper to check if an alternative is an active sponsor
function isActiveSponsor(alternative: { submission_plan?: string | null; sponsor_priority_until?: string | null }): boolean {
  if (alternative.submission_plan !== 'sponsor') return false;
  if (!alternative.sponsor_priority_until) return false;
  return new Date(alternative.sponsor_priority_until) > new Date();
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProprietarySoftware {
  id: string;
  name: string;
  slug: string;
}

interface AlternativesListProps {
  alternatives: AlternativeWithRelations[];
  categories?: Category[];
  proprietarySoftware?: ProprietarySoftware[];
  itemsPerPage?: number;
}

type SortOption = 'healthScore' | 'stars' | 'recent' | 'name' | 'votes';

const ITEMS_PER_PAGE = 20;

export function AlternativesList({ alternatives, categories = [], proprietarySoftware = [], itemsPerPage = ITEMS_PER_PAGE }: AlternativesListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('votes');
  const [selfHostedOnly, setSelfHostedOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedAlternativeTo, setSelectedAlternativeTo] = useState<string>('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { ads } = useCardAds();

  const filteredAndSortedAlternatives = useMemo(() => {
    let filtered = [...alternatives];

    // Apply self-hosted filter
    if (selfHostedOnly) {
      filtered = filtered.filter(alt => alt.is_self_hosted);
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(alt => 
        alt.categories?.some(cat => cat.slug === selectedCategory)
      );
    }

    // Apply alternative-to filter
    if (selectedAlternativeTo) {
      filtered = filtered.filter(alt => 
        alt.alternative_to?.some(prop => prop.slug === selectedAlternativeTo)
      );
    }

    // Separate sponsored and non-sponsored alternatives
    const sponsored = filtered.filter(alt => isActiveSponsor(alt));
    const nonSponsored = filtered.filter(alt => !isActiveSponsor(alt));

    // Sort function based on selected option
    const sortFn = (a: AlternativeWithRelations, b: AlternativeWithRelations) => {
      switch (sortBy) {
        case 'healthScore':
          return (b.health_score || 0) - (a.health_score || 0);
        case 'stars':
          return (b.stars || 0) - (a.stars || 0);
        case 'recent':
          const aDate = a.last_commit ? new Date(a.last_commit).getTime() : 0;
          const bDate = b.last_commit ? new Date(b.last_commit).getTime() : 0;
          return bDate - aDate;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'votes':
          return ((b as any).vote_score || 0) - ((a as any).vote_score || 0);
        default:
          return 0;
      }
    };

    // Sort both groups independently, then combine with sponsored first
    sponsored.sort(sortFn);
    nonSponsored.sort(sortFn);

    return [...sponsored, ...nonSponsored];
  }, [alternatives, sortBy, selfHostedOnly, selectedCategory, selectedAlternativeTo]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [sortBy, selfHostedOnly, selectedCategory, selectedAlternativeTo]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedAlternatives.length / itemsPerPage);
  const paginatedAlternatives = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedAlternatives.slice(startIndex, endIndex);
  }, [filteredAndSortedAlternatives, currentPage, itemsPerPage]);

  // Intersperse ads into alternatives list
  const itemsWithAds = useMemo(() => {
    return intersperseAds(paginatedAlternatives, ads, 6);
  }, [paginatedAlternatives, ads]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of the list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = selfHostedOnly || selectedCategory || selectedAlternativeTo;

  const clearFilters = () => {
    setSelfHostedOnly(false);
    setSelectedCategory('');
    setSelectedAlternativeTo('');
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-surface border border-border rounded-xl text-white font-mono text-sm touch-manipulation"
        >
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-brand" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="px-1.5 py-0.5 bg-brand/20 text-brand text-xs rounded">Active</span>
            )}
          </div>
          <ChevronDown className={`w-4 h-4 text-muted transition-transform ${mobileFiltersOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Sidebar Filters - Desktop: always visible, Mobile: collapsible */}
      <aside className={`lg:w-64 flex-shrink-0 ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
        <div className="bg-surface rounded-xl border border-border p-4 sm:p-6 lg:sticky lg:top-24">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-brand" />
              <h2 className="font-mono text-sm sm:text-base text-white">// Filters</h2>
            </div>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-mono text-muted hover:text-brand transition-colors touch-manipulation px-2 py-1"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="lg:hidden p-1 text-muted hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            {/* Sort By */}
            <div>
              <label className="block text-xs font-mono text-muted mb-1.5 sm:mb-2">
                Sort By
              </label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full px-3 py-2.5 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50 touch-manipulation"
              >
                <option value="healthScore">Health Score</option>
                <option value="votes">Most Upvoted</option>
                <option value="stars">GitHub Stars</option>
                <option value="recent">Recently Updated</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div>
                <label className="block text-xs font-mono text-muted mb-1.5 sm:mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50 touch-manipulation"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Alternative To Filter */}
            {proprietarySoftware.length > 0 && (
              <div>
                <label className="block text-xs font-mono text-muted mb-1.5 sm:mb-2">
                  Alternative To
                </label>
                <select
                  value={selectedAlternativeTo}
                  onChange={(e) => setSelectedAlternativeTo(e.target.value)}
                  className="w-full px-3 py-2.5 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50 touch-manipulation"
                >
                  <option value="">All Software</option>
                  {proprietarySoftware.map((sw) => (
                    <option key={sw.id} value={sw.slug}>
                      {sw.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Self-Hosted */}
            <div>
              <label className="flex items-center space-x-2 cursor-pointer group touch-manipulation py-1">
                <input
                  type="checkbox"
                  checked={selfHostedOnly}
                  onChange={(e) => setSelfHostedOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-border bg-dark text-brand focus:ring-brand/50"
                />
                <span className="text-sm font-mono text-muted group-hover:text-white transition-colors">Self-Hosted Only</span>
              </label>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <p className="text-muted font-mono text-xs sm:text-sm">
            <span className="text-brand">found:</span> {filteredAndSortedAlternatives.length} alternatives
            {filteredAndSortedAlternatives.length !== alternatives.length && (
              <span className="text-muted/70 hidden sm:inline"> (filtered from {alternatives.length})</span>
            )}
            {totalPages > 1 && (
              <span className="text-muted/70"> • page {currentPage} of {totalPages}</span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6">
          {itemsWithAds.map((item, index) => (
            isAdvertisement(item) ? (
              <CardAd key={`ad-${item.id}`} ad={item} />
            ) : isActiveSponsor(item) ? (
              <SponsoredAlternativeCard key={item.id} alternative={item} />
            ) : (
              <AlternativeCard key={item.id} alternative={item} />
            )
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  );
}
