'use client';

import { useState, useMemo } from 'react';
import { 
  alertTags, 
  highlightTags, 
  platformTags, 
  propertyTags,
  type AlternativeTagsData,
  type AlertTagId,
  type HighlightTagId,
  type PlatformTagId,
  type PropertyTagId,
  type AlternativeTagDefinition,
} from '@/data/alternative-tags';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

interface AlternativeTagsSelectorProps {
  value: AlternativeTagsData;
  onChange: (tags: AlternativeTagsData) => void;
  disabled?: boolean;
}

interface TagCategoryProps {
  title: string;
  titleColor: string;
  bgColor: string;
  borderColor: string;
  tags: AlternativeTagDefinition[];
  selectedTags: string[];
  onToggle: (id: string) => void;
  disabled?: boolean;
  defaultExpanded?: boolean;
}

function TagCategory({ 
  title, 
  titleColor, 
  bgColor, 
  borderColor, 
  tags, 
  selectedTags, 
  onToggle,
  disabled = false,
  defaultExpanded = false 
}: TagCategoryProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const selectedCount = selectedTags.length;

  return (
    <div className={`border rounded-lg ${borderColor}`}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex items-center justify-between p-3 ${bgColor} rounded-t-lg hover:opacity-80 transition-opacity`}
        disabled={disabled}
      >
        <span className={`font-mono text-sm font-medium ${titleColor}`}>
          {title}
          {selectedCount > 0 && (
            <span className="ml-2 px-1.5 py-0.5 bg-dark/50 rounded text-xs">
              {selectedCount} selected
            </span>
          )}
        </span>
        {expanded ? (
          <ChevronUp className={`w-4 h-4 ${titleColor}`} />
        ) : (
          <ChevronDown className={`w-4 h-4 ${titleColor}`} />
        )}
      </button>
      
      {expanded && (
        <div className="p-3 space-y-2 bg-dark/30">
          {tags.map(tag => {
            const isSelected = selectedTags.includes(tag.id);
            return (
              <label
                key={tag.id}
                className={`flex items-start gap-3 p-2 rounded cursor-pointer transition-colors ${
                  isSelected ? bgColor : 'hover:bg-surface'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => !disabled && onToggle(tag.id)}
                  disabled={disabled}
                  className="mt-1 w-4 h-4 rounded border-border bg-dark text-brand focus:ring-brand focus:ring-offset-dark"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{tag.emoji}</span>
                    <span className="text-sm text-white font-medium">{tag.name}</span>
                  </div>
                  <p className="text-xs text-muted mt-0.5">{tag.description}</p>
                </div>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function AlternativeTagsSelector({ value, onChange, disabled = false }: AlternativeTagsSelectorProps) {
  const handleToggle = (category: keyof AlternativeTagsData, id: string) => {
    const currentTags = (value[category] || []) as string[];
    const newTags = currentTags.includes(id)
      ? currentTags.filter(t => t !== id)
      : [...currentTags, id];
    
    onChange({
      ...value,
      [category]: newTags,
    });
  };

  const clearAll = () => {
    onChange({
      alerts: [],
      highlights: [],
      platforms: [],
      properties: [],
    });
  };

  const totalSelected = 
    (value.alerts?.length || 0) + 
    (value.highlights?.length || 0) + 
    (value.platforms?.length || 0) + 
    (value.properties?.length || 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-mono text-brand">// alternative_tags</h3>
        {totalSelected > 0 && (
          <button
            type="button"
            onClick={clearAll}
            disabled={disabled}
            className="flex items-center gap-1 text-xs text-muted hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-3 h-3" />
            Clear all ({totalSelected})
          </button>
        )}
      </div>
      
      <div className="space-y-2">
        <TagCategory
          title="Alerts"
          titleColor="text-red-400"
          bgColor="bg-red-500/10"
          borderColor="border-red-500/30"
          tags={alertTags}
          selectedTags={value.alerts || []}
          onToggle={(id) => handleToggle('alerts', id)}
          disabled={disabled}
        />
        
        <TagCategory
          title="Highlights"
          titleColor="text-yellow-400"
          bgColor="bg-yellow-500/10"
          borderColor="border-yellow-500/30"
          tags={highlightTags}
          selectedTags={value.highlights || []}
          onToggle={(id) => handleToggle('highlights', id)}
          disabled={disabled}
        />
        
        <TagCategory
          title="Platforms"
          titleColor="text-blue-400"
          bgColor="bg-blue-500/10"
          borderColor="border-blue-500/30"
          tags={platformTags}
          selectedTags={value.platforms || []}
          onToggle={(id) => handleToggle('platforms', id)}
          disabled={disabled}
        />
        
        <TagCategory
          title="Properties"
          titleColor="text-purple-400"
          bgColor="bg-purple-500/10"
          borderColor="border-purple-500/30"
          tags={propertyTags}
          selectedTags={value.properties || []}
          onToggle={(id) => handleToggle('properties', id)}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
