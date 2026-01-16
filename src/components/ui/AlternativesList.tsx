'use client';

import { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';
import { AlternativeCard } from './AlternativeCard';
import { SponsoredAlternativeCard } from './SponsoredAlternativeCard';
import { CardAd, useCardAds, intersperseAds, isAdvertisement } from './CardAd';
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
}

type SortOption = 'healthScore' | 'stars' | 'recent' | 'name' | 'votes';

export function AlternativesList({ alternatives, categories = [], proprietarySoftware = [] }: AlternativesListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('votes');
  const [selfHostedOnly, setSelfHostedOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedAlternativeTo, setSelectedAlternativeTo] = useState<string>('');
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

  // Intersperse ads into alternatives list
  const itemsWithAds = useMemo(() => {
    return intersperseAds(filteredAndSortedAlternatives, ads, 6);
  }, [filteredAndSortedAlternatives, ads]);

  const hasActiveFilters = selfHostedOnly || selectedCategory || selectedAlternativeTo;

  const clearFilters = () => {
    setSelfHostedOnly(false);
    setSelectedCategory('');
    setSelectedAlternativeTo('');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="lg:w-64 flex-shrink-0">
        <div className="bg-surface rounded-xl border border-border p-6 sticky top-24">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-brand" />
              <h2 className="font-mono text-white">// Filters</h2>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs font-mono text-muted hover:text-brand transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
          
          <div className="space-y-6">
            {/* Sort By */}
            <div>
              <label className="block text-xs font-mono text-muted mb-2">
                Sort By
              </label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full px-3 py-2.5 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50"
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
                <label className="block text-xs font-mono text-muted mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50"
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
                <label className="block text-xs font-mono text-muted mb-2">
                  Alternative To
                </label>
                <select
                  value={selectedAlternativeTo}
                  onChange={(e) => setSelectedAlternativeTo(e.target.value)}
                  className="w-full px-3 py-2.5 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50"
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
              <label className="flex items-center space-x-2 cursor-pointer group">
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
      <main className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted font-mono text-sm">
            <span className="text-brand">found:</span> {filteredAndSortedAlternatives.length} alternatives
            {filteredAndSortedAlternatives.length !== alternatives.length && (
              <span className="text-muted/70"> (filtered from {alternatives.length})</span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </main>
    </div>
  );
}
