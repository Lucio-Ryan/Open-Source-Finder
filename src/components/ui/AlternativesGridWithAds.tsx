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

export function AlternativesGridWithAds({ alternatives, maxAds = 10 }: AlternativesGridWithAdsProps) {
  const { ads } = useCardAds();

  // Intersperse ads into the grid - show one ad every 8 alternatives
  // Rotate through available ads, ordered by approved_at (oldest first from API)
  const itemsWithAds = useMemo(() => {
    if (ads.length === 0) return alternatives;
    
    const result: (AlternativeWithRelations | Advertisement)[] = [];
    let adIndex = 0;
    let adsInserted = 0;
    
    alternatives.forEach((alt, index) => {
      result.push(alt);
      
      // Insert an ad after every 8 alternatives
      if ((index + 1) % 8 === 0 && adsInserted < maxAds && ads.length > 0) {
        // Get the next ad (cycling through available ads)
        const ad = ads[adIndex % ads.length];
        result.push(ad);
        adIndex++;
        adsInserted++;
      }
    });
    
    return result;
  }, [alternatives, ads, maxAds]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {itemsWithAds.map((item, index) => (
        isAdvertisement(item) ? (
          <CardAd key={`ad-${item.id}-${index}`} ad={item} />
        ) : isActiveSponsor(item) ? (
          <SponsoredAlternativeCard key={item.id} alternative={item} />
        ) : (
          <AlternativeCard key={item.id} alternative={item} />
        )
      ))}
    </div>
  );
}
