'use client';

import { useState, useEffect } from 'react';
import { NewsletterForm } from '@/components/ui';

interface NewsletterSectionProps {
  totalAlternatives?: number | null;
}

export function NewsletterSection({ totalAlternatives }: NewsletterSectionProps) {
  const [showSection, setShowSection] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/site-settings');
        if (response.ok) {
          const data = await response.json();
          setShowSection(data.showNewsletterSection ?? true);
        }
      } catch (error) {
        console.error('Failed to fetch site settings:', error);
      } finally {
        setLoaded(true);
      }
    };
    fetchSettings();
  }, []);

  // Don't render anything until settings are loaded to avoid flash
  if (!loaded) {
    return null;
  }

  if (!showSection) {
    return null;
  }

  return (
    <section className="py-4 sm:py-6 lg:py-8 bg-surface/30 border-b border-border">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="text-center sm:text-left">
            <p className="text-white font-mono text-xs sm:text-sm">
              <code>
                $ discover <span className="text-brand">{totalAlternatives ? `--${totalAlternatives}` : '--'}</span> alternatives
              </code>
            </p>
          </div>
          <div className="w-full sm:w-auto">
            <NewsletterForm compact />
          </div>
        </div>
      </div>
    </section>
  );
}
