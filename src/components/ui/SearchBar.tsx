'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SearchBar({ 
  placeholder = 'Search for open source alternatives...', 
  size = 'md',
  className = '' 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const sizeClasses = {
    sm: 'py-2.5 px-4 text-sm',
    md: 'py-3.5 px-5 text-base',
    lg: 'py-4 px-6 text-lg',
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
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted w-5 h-5 group-focus-within:text-brand transition-colors" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${sizeClasses[size]} pl-12 pr-12 bg-surface border border-border rounded-xl text-white placeholder-muted font-mono focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50 transition-all`}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="absolute -bottom-6 left-4 text-xs font-mono text-muted/50">
        Press Enter to search
      </div>
    </form>
  );
}
