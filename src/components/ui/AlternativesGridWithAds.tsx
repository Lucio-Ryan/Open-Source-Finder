'use client';

import { useMemo } from 'react';
import { AlternativeCard } from './AlternativeCard';
import { SponsoredAlternativeCard } from './SponsoredAlternativeCard';
import { CardAd, useCardAds, isAdvertisement } from './CardAd';
import type { AlternativeWithRelations, Advertisement } from '@/types/database';

// Helper to check if an alternative is an active sponsor
function isActiveSponsor(alternative: { submission_plan?: string | null; sponsor_priority_until?: string | null }): boolean {
  if (alternative.submission_plan !== 'sponsor') return false;
  if (!alternative.sponsor_priority_until) return false;
  return new Date(alternative.sponsor_priority_until) > new Date();
}

interface AlternativesGridWithAdsProps {
  alternatives: AlternativeWithRelations[];
  maxAds?: number;
}

export function AlternativesGridWithAds({ alternatives, maxAds = 1 }: AlternativesGridWithAdsProps) {
  const { ads } = useCardAds();

  // Intersperse a limited number of ads into the grid
  const itemsWithAds = useMemo(() => {
    if (ads.length === 0) return alternatives;
    
    const result: (AlternativeWithRelations | Advertisement)[] = [...alternatives];
    const adsToInsert = ads.slice(0, maxAds);
    
    // Insert ads at strategic positions (after every 3rd item)
    adsToInsert.forEach((ad, index) => {
      const insertPosition = Math.min((index + 1) * 3, result.length);
      result.splice(insertPosition + index, 0, ad);
    });
    
    return result;
  }, [alternatives, ads, maxAds]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
}
