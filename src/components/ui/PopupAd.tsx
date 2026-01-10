'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Advertisement } from '@/types/database';

const ROTATION_INTERVAL = 8000; // 8 seconds between rotations
const STORAGE_KEY = 'popup_ad_dismissed';
const DISMISS_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function PopupAd() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if ads were dismissed recently
    const dismissedUntil = localStorage.getItem(STORAGE_KEY);
    if (dismissedUntil && Date.now() < parseInt(dismissedUntil)) {
      setLoading(false);
      return;
    }

    // Fetch popup ads
    const fetchAds = async () => {
      try {
        const response = await fetch('/api/advertisements?type=popup');
        const data = await response.json();
        if (data.advertisements && data.advertisements.length > 0) {
          setAds(data.advertisements);
          // Show after a short delay for better UX
          setTimeout(() => setIsVisible(true), 2000);
        }
      } catch (error) {
        console.error('Failed to fetch popup ads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  // Auto-rotate ads
  useEffect(() => {
    if (ads.length <= 1 || !isVisible || isMinimized) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [ads.length, isVisible, isMinimized]);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    localStorage.setItem(STORAGE_KEY, (Date.now() + DISMISS_DURATION).toString());
  }, []);

  const handleMinimize = useCallback(() => {
    setIsMinimized(true);
  }, []);

  const handleExpand = useCallback(() => {
    setIsMinimized(false);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
  }, [ads.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  }, [ads.length]);

  const handleClick = useCallback(async (ad: Advertisement) => {
    // Track click (fire and forget)
    fetch(`/api/advertisements/track?id=${ad.id}&action=click`, { method: 'POST' }).catch(() => {});
    window.open(ad.destination_url, '_blank', 'noopener,noreferrer');
  }, []);

  if (loading || !isVisible || ads.length === 0) {
    return null;
  }

  const currentAd = ads[currentIndex];

  // Minimized state - small floating button
  if (isMinimized) {
    return (
      <button
        onClick={handleExpand}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 bg-surface border border-border rounded-full flex items-center justify-center shadow-lg hover:border-brand/50 transition-all group"
        aria-label="Show sponsored content"
      >
        {currentAd.company_logo ? (
          <Image
            src={currentAd.company_logo}
            alt=""
            width={24}
            height={24}
            className="rounded-full"
          />
        ) : (
          <span className="text-brand text-xs font-mono">Ad</span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-surface border border-border rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-right-4 duration-300">
      {/* Content */}
      <div 
        className="p-4 cursor-pointer hover:bg-dark/30 transition-colors"
        onClick={() => handleClick(currentAd)}
      >
        <div className="flex items-start gap-3 mb-3">
          {currentAd.company_logo ? (
            <Image
              src={currentAd.company_logo}
              alt={`${currentAd.company_name} logo`}
              width={40}
              height={40}
              className="rounded-lg border border-border"
            />
          ) : (
            <div className="w-10 h-10 bg-brand/10 border border-brand/20 rounded-lg flex items-center justify-center text-brand font-bold">
              {currentAd.company_name.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white text-sm truncate">
              {currentAd.company_name}
            </h4>
            <p className="text-xs text-muted truncate">
              {currentAd.headline || currentAd.name}
            </p>
          </div>
        </div>
        
        <p className="text-sm text-muted mb-3 line-clamp-2">
          {currentAd.description}
        </p>

        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand text-dark text-sm font-medium rounded-lg hover:bg-brand-light transition-colors">
          {currentAd.cta_text}
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Navigation (if multiple ads) */}
      {ads.length > 1 && (
        <div className="flex items-center justify-between px-4 py-2 bg-dark/30 border-t border-border">
          <button
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="p-1 text-muted hover:text-white transition-colors"
            aria-label="Previous ad"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-1.5">
            {ads.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  idx === currentIndex ? 'bg-brand' : 'bg-muted/30 hover:bg-muted/50'
                }`}
                aria-label={`Go to ad ${idx + 1}`}
              />
            ))}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="p-1 text-muted hover:text-white transition-colors"
            aria-label="Next ad"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
