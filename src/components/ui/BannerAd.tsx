'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import type { Advertisement } from '@/types/database';

export function BannerAd() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch('/api/advertisements?type=banner');
        const data = await response.json();
        if (data.advertisements && data.advertisements.length > 0) {
          // Ads are already ordered by approved_at (oldest first) from API
          setAds(data.advertisements);
        }
      } catch (error) {
        console.error('Failed to fetch banner ads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  // Rotate banner ads every 3 minutes
  useEffect(() => {
    if (ads.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 3 * 60 * 1000); // 3 minutes
    
    return () => clearInterval(interval);
  }, [ads.length]);

  const ad = ads[currentIndex];

  const handleClick = useCallback(() => {
    if (!ad) return;
    // Track click (fire and forget)
    fetch(`/api/advertisements/track?id=${ad.id}&action=click`, { method: 'POST' }).catch(() => {});
    window.open(ad.destination_url, '_blank', 'noopener,noreferrer');
  }, [ad]);

  if (loading) {
    return (
      <div className="flex justify-center px-4 mt-4">
        <div className="w-full max-w-7xl">
          <div className="bg-surface/80 border border-border rounded-lg animate-pulse">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-muted/20 rounded"></div>
                <div className="w-48 h-3 bg-muted/20 rounded"></div>
              </div>
              <div className="w-20 h-6 bg-muted/20 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!ad) {
    return null;
  }

  return (
    <div className="flex justify-center px-4 mt-4">
      <div className="w-full max-w-7xl">
        <div className="bg-surface/95 border border-border/50 rounded-lg relative overflow-hidden shadow-lg backdrop-blur-sm">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand/3 via-transparent to-brand/3 pointer-events-none"></div>
          
          <button
            onClick={handleClick}
            className="w-full relative flex items-center justify-between px-3 py-2 transition-all hover:bg-surface/100"
          >
            {/* Left side - Ad indicator + Company info */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="flex-shrink-0 px-1.5 py-0.5 bg-dark/50 border border-border rounded text-xs font-mono text-muted">
                Ad
              </span>
              
              {ad.company_logo && (
                <Image
                  src={ad.company_logo}
                  alt={`${ad.company_name} logo`}
                  width={20}
                  height={20}
                  className="flex-shrink-0 rounded"
                />
              )}
              
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <span className="font-medium text-brand text-xs flex-shrink-0">
                  {ad.company_name}
                </span>
                <span className="text-muted hidden sm:inline text-xs">•</span>
                <span className="text-muted text-xs truncate hidden sm:block">
                  {ad.headline || ad.description}
                </span>
              </div>
            </div>

            {/* Right side - CTA */}
            <div className="flex-shrink-0 flex items-center gap-1.5 ml-3">
              <span className="hidden sm:inline text-xs font-medium text-brand">{ad.cta_text}</span>
              <ExternalLink className="w-3 h-3 text-brand flex-shrink-0" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
