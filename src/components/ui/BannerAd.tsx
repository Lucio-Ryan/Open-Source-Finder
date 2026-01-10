'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import type { Advertisement } from '@/types/database';

export function BannerAd() {
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await fetch('/api/advertisements?type=banner');
        const data = await response.json();
        if (data.advertisements && data.advertisements.length > 0) {
          // Pick a random banner ad if multiple exist
          const randomIndex = Math.floor(Math.random() * data.advertisements.length);
          setAd(data.advertisements[randomIndex]);
        }
      } catch (error) {
        console.error('Failed to fetch banner ad:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, []);

  const handleClick = () => {
    if (!ad) return;
    // Track click (fire and forget)
    fetch(`/api/advertisements/track?id=${ad.id}&action=click`, { method: 'POST' }).catch(() => {});
    window.open(ad.destination_url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="bg-surface/80 border border-border rounded-xl animate-pulse">
          <div className="flex items-center justify-between py-3 px-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-muted/20 rounded"></div>
              <div className="w-64 h-4 bg-muted/20 rounded"></div>
            </div>
            <div className="w-32 h-8 bg-muted/20 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!ad) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div className="bg-surface/90 border border-border rounded-xl relative overflow-hidden shadow-lg">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand/5 via-transparent to-brand/5 pointer-events-none"></div>
        
        <div className="px-4 relative">
          <div className="flex items-center justify-between py-2.5">
          {/* Left side - Ad indicator + Company info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="flex-shrink-0 px-2 py-0.5 bg-dark/50 border border-border rounded text-xs font-mono text-muted">
              Ad
            </span>
            
            {ad.company_logo && (
              <Image
                src={ad.company_logo}
                alt={`${ad.company_name} logo`}
                width={24}
                height={24}
                className="flex-shrink-0 rounded"
              />
            )}
            
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="font-medium text-brand text-sm flex-shrink-0">
                {ad.company_name}
              </span>
              <span className="text-muted hidden sm:inline">—</span>
              <span className="text-muted text-sm truncate hidden sm:block">
                {ad.headline || ad.description}
              </span>
            </div>
          </div>

          {/* Right side - CTA */}
          <button
            onClick={handleClick}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-1.5 bg-brand/10 border border-brand/30 text-brand text-sm font-medium rounded-lg hover:bg-brand/20 hover:border-brand/50 transition-all group ml-4"
          >
            <span className="hidden sm:inline">{ad.cta_text}</span>
            <span className="sm:hidden">Visit</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
