'use client';

import { useMemo } from 'react';
import { AlternativeCard } from '@/components/ui/AlternativeCard';
import { SponsoredAlternativeCard } from '@/components/ui/SponsoredAlternativeCard';
import { CardAd, useCardAds, intersperseAds, isAdvertisement } from '@/components/ui/CardAd';
import type { AlternativeWithRelations } from '@/types/database';

// Helper to check if an alternative is an active sponsor
function isActiveSponsor(alternative: { submission_plan?: string | null; sponsor_priority_until?: string | null }): boolean {
  if (alternative.submission_plan !== 'sponsor') return false;
  if (!alternative.sponsor_priority_until) return false;
  return new Date(alternative.sponsor_priority_until) > new Date();
}

interface SelfHostedGridProps {
  alternatives: AlternativeWithRelations[];
}

export function SelfHostedGrid({ alternatives }: SelfHostedGridProps) {
  const { ads } = useCardAds();

  // Intersperse ads into alternatives list
  const itemsWithAds = useMemo(() => {
    return intersperseAds(alternatives, ads, 6);
  }, [alternatives, ads]);

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
