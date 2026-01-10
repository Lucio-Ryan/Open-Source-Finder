'use client';

import Image from 'next/image';
import { ExternalLink, Sparkles } from 'lucide-react';
import type { Advertisement } from '@/types/database';

interface CardAdProps {
  ad: Advertisement;
  className?: string;
}

export function CardAd({ ad, className = '' }: CardAdProps) {
  const handleClick = () => {
    // Track click (fire and forget)
    fetch(`/api/advertisements/track?id=${ad.id}&action=click`, { method: 'POST' }).catch(() => {});
    window.open(ad.destination_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className={`card-dark group cursor-pointer relative overflow-hidden bg-green-950/40 border-green-500/30 hover:border-green-500/50 ${className}`}
      onClick={handleClick}
    >
      {/* Ad indicator badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className="px-2 py-0.5 bg-green-900/80 border border-green-500/30 rounded text-xs font-mono text-green-400 backdrop-blur-sm">
          Ad
        </span>
      </div>

      {/* Subtle sponsored highlight */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-transparent pointer-events-none"></div>

      <div className="relative">
        <div className="flex items-start justify-between mb-5">
          {/* Icon and info */}
          <div className="flex items-start space-x-3">
            <div className="flex items-center space-x-4">
              {ad.icon_url || ad.company_logo ? (
                <Image
                  src={ad.icon_url || ad.company_logo!}
                  alt={`${ad.company_name} icon`}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-xl object-cover border border-brand/20 group-hover:border-brand/40 transition-colors"
                />
              ) : (
                <div className="w-14 h-14 bg-brand/10 border border-brand/20 rounded-xl flex items-center justify-center text-brand font-pixel text-xl group-hover:border-brand/40 transition-colors">
                  {ad.company_name.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="font-semibold text-white group-hover:text-brand transition-colors flex items-center gap-2">
                  {ad.company_name}
                  <Sparkles className="w-4 h-4 text-brand/60" />
                </h3>
                <div className="flex items-center space-x-2 text-xs font-mono text-muted">
                  <span className="text-brand/80">sponsored</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-muted text-sm mb-5 line-clamp-2 font-mono leading-relaxed">
          {ad.short_description || ad.description}
        </p>

        {/* CTA */}
        <div className="flex items-center justify-between pt-5 border-t border-green-500/20">
          <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-medium rounded-lg hover:bg-green-500/30 hover:border-green-500/50 transition-all">
            <span>{ad.cta_text}</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Component to fetch and display card ads in a grid
interface CardAdsProviderProps {
  children: (ads: Advertisement[]) => React.ReactNode;
}

export function CardAdsProvider({ children }: CardAdsProviderProps) {
  const [ads, setAds] = useState<Advertisement[]>([]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch('/api/advertisements?type=card');
        const data = await response.json();
        if (data.advertisements) {
          setAds(data.advertisements);
        }
      } catch (error) {
        console.error('Failed to fetch card ads:', error);
      }
    };

    fetchAds();
  }, []);

  return <>{children(ads)}</>;
}

// Hook to fetch card ads
import { useEffect, useState } from 'react';

export function useCardAds() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch('/api/advertisements?type=card');
        const data = await response.json();
        if (data.advertisements) {
          setAds(data.advertisements);
        }
      } catch (error) {
        console.error('Failed to fetch card ads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  return { ads, loading };
}

// Utility to intersperse ads into alternatives list
export function intersperseAds<T>(
  items: T[], 
  ads: Advertisement[], 
  interval: number = 6
): (T | Advertisement)[] {
  if (ads.length === 0) return items;
  
  const result: (T | Advertisement)[] = [];
  let adIndex = 0;
  
  items.forEach((item, index) => {
    result.push(item);
    
    // Insert an ad after every `interval` items
    if ((index + 1) % interval === 0 && adIndex < ads.length) {
      result.push(ads[adIndex]);
      adIndex++;
    }
  });
  
  return result;
}

// Type guard to check if item is an ad
export function isAdvertisement(item: any): item is Advertisement {
  return item && typeof item === 'object' && 'ad_type' in item;
}
