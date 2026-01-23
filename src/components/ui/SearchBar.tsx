'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchBarProps {
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  syncWithUrl?: boolean;
}

export function SearchBar({ 
  placeholder = 'Search for open source alternatives...', 
  size = 'md',
  className = '',
  syncWithUrl = false
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sync with URL query parameter when on search page
  useEffect(() => {
    if (syncWithUrl) {
      const urlQuery = searchParams.get('q') || '';
      setQuery(urlQuery);
    }
  }, [syncWithUrl, searchParams]);

  const sizeClasses = {
    sm: 'py-2 sm:py-2.5 px-3 sm:px-4 text-sm',
    md: 'py-2.5 sm:py-3.5 px-4 sm:px-5 text-sm sm:text-base',
    lg: 'py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-lg',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative group">
        <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-muted w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-brand transition-colors" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${sizeClasses[size]} pl-10 sm:pl-12 pr-10 sm:pr-12 bg-surface border border-border rounded-xl text-white placeholder-muted font-mono focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50 transition-all touch-manipulation`}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-muted hover:text-white transition-colors p-1 touch-manipulation"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}
      </div>
    </form>
  );
}
