'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Code } from 'lucide-react';

interface TechStack {
  id: string;
  name: string;
  slug: string;
  type: string;
}

interface TechStackSelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  techStacks: TechStack[];
}

// Group tech stacks by type for display
const typeColors: Record<string, string> = {
  Language: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Framework: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Database: 'bg-green-500/20 text-green-400 border-green-500/30',
  Tool: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Cloud: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  SaaS: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  DevOps: 'bg-red-500/20 text-red-400 border-red-500/30',
  Library: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
};

export function TechStackSelector({ selectedIds, onChange, techStacks }: TechStackSelectorProps) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredStacks = techStacks.filter(
    (stack) =>
      stack.name.toLowerCase().includes(search.toLowerCase()) ||
      (stack.type && stack.type.toLowerCase().includes(search.toLowerCase()))
  );

  const selectedStacks = techStacks.filter((stack) => selectedIds.includes(stack.id));

  const handleSelect = (stackId: string) => {
    if (selectedIds.includes(stackId)) {
      onChange(selectedIds.filter((id) => id !== stackId));
    } else {
      onChange([...selectedIds, stackId]);
    }
  };

  const handleRemove = (stackId: string) => {
    onChange(selectedIds.filter((id) => id !== stackId));
  };

  const getTypeColor = (type: string) => {
    return typeColors[type] || 'bg-muted/20 text-muted border-border';
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Selected Tech Stacks */}
      {selectedStacks.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedStacks.map((stack) => (
            <span
              key={stack.id}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono border ${getTypeColor(stack.type)}`}
            >
              {stack.name}
              <button
                type="button"
                onClick={() => handleRemove(stack.id)}
                className="hover:opacity-70 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search tech stacks (e.g., React, Python, PostgreSQL...)"
          className="w-full pl-11 pr-4 py-3 bg-dark border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-transparent"
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-surface border border-border rounded-xl shadow-xl max-h-72 overflow-hidden">
          {filteredStacks.length === 0 ? (
            <div className="p-4 text-center text-muted font-mono text-sm">
              No tech stacks found
            </div>
          ) : (
            <div className="overflow-y-auto max-h-72 p-2">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {filteredStacks.map((stack) => {
                  const isSelected = selectedIds.includes(stack.id);
                  return (
                    <button
                      key={stack.id}
                      type="button"
                      onClick={() => handleSelect(stack.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                        isSelected
                          ? 'bg-brand/20 border border-brand text-brand'
                          : 'bg-dark border border-border hover:border-brand/50 text-muted hover:text-white'
                      }`}
                    >
                      <Code className="w-4 h-4 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{stack.name}</p>
                        <p className="text-xs opacity-60">{stack.type}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
