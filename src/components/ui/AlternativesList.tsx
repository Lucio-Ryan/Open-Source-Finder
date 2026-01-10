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

interface AlternativesListProps {
  alternatives: AlternativeWithRelations[];
}

type SortOption = 'healthScore' | 'stars' | 'recent' | 'name' | 'votes';

export function AlternativesList({ alternatives }: AlternativesListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('healthScore');
  const [selfHostedOnly, setSelfHostedOnly] = useState(false);
  const { ads } = useCardAds();

  const filteredAndSortedAlternatives = useMemo(() => {
    let filtered = [...alternatives];

    // Apply self-hosted filter
    if (selfHostedOnly) {
      filtered = filtered.filter(alt => alt.is_self_hosted);
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
  }, [alternatives, sortBy, selfHostedOnly]);

  // Intersperse ads into alternatives list
  const itemsWithAds = useMemo(() => {
    return intersperseAds(filteredAndSortedAlternatives, ads, 6);
  }, [filteredAndSortedAlternatives, ads]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="lg:w-64 flex-shrink-0">
        <div className="bg-surface rounded-xl border border-border p-6 sticky top-24">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-brand" />
            <h2 className="font-mono text-white">// Filters</h2>
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

            {/* Tags */}
            <div>
              <label className="block text-xs font-mono text-muted mb-2">
                Popular Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {['self-hosted', 'privacy-focused', 'ai-powered'].map((tag) => (
                  <button
                    key={tag}
                    className="px-2 py-1 text-xs font-mono bg-dark border border-border text-muted rounded hover:border-brand/30 hover:text-brand transition-colors"
                  >
                    #{tag.replace('-', '_')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted font-mono text-sm">
            <span className="text-brand">found:</span> {filteredAndSortedAlternatives.length} alternatives
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
