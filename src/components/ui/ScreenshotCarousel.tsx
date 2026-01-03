'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ScreenshotCarouselProps {
  screenshots: string[];
  altName: string;
}

export function ScreenshotCarousel({ screenshots, altName }: ScreenshotCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (screenshots.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-video rounded-lg overflow-hidden border border-border group">
        <Image
          src={screenshots[currentIndex]}
          alt={`${altName} screenshot ${currentIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          priority={currentIndex === 0}
        />

        {/* Navigation Arrows */}
        {screenshots.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-dark/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-dark hover:text-brand"
              aria-label="Previous screenshot"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-dark/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-dark hover:text-brand"
              aria-label="Next screenshot"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {screenshots.length > 1 && (
          <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-dark/80 text-white text-sm font-mono">
            {currentIndex + 1} / {screenshots.length}
          </div>
        )}
      </div>

      {/* Dot Indicators */}
      {screenshots.length > 1 && (
        <div className="flex justify-center gap-2">
          {screenshots.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-brand w-6'
                  : 'bg-border hover:bg-muted'
              }`}
              aria-label={`Go to screenshot ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail Strip (for 3+ images) */}
      {screenshots.length >= 3 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          {screenshots.map((screenshot, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative flex-shrink-0 w-20 h-14 rounded-md overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-brand'
                  : 'border-border hover:border-muted'
              }`}
            >
              <Image
                src={screenshot}
                alt={`${altName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
