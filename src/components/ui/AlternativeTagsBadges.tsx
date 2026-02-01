'use client';

import { 
  AlternativeTagsData, 
  getAlternativeTagById,
  type AlertTagId,
  type HighlightTagId,
  type PlatformTagId,
  type PropertyTagId,
  type AlternativeTagDefinition,
} from '@/data/alternative-tags';
import {
  ShieldAlert,
  ShieldX,
  Ban,
  Lock,
  Pause,
  Clock,
  AlertTriangle,
  Building2,
  DollarSign,
  FlaskConical,
  Construction,
  XCircle,
  Zap,
  Globe,
  Star,
  Lightbulb,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react';

// Icon mapping for alerts and highlights
const tagIcons: Record<string, LucideIcon> = {
  // Alerts
  'security-minor': ShieldAlert,
  'security-moderate': ShieldAlert,
  'security-major': ShieldX,
  'security-critical': ShieldX,
  'abandoned': Ban,
  'closed-development': Lock,
  'development-paused': Pause,
  'development-slowed': Clock,
  'restrictive-license': AlertTriangle,
  'corporate-influence': Building2,
  'commercial': DollarSign,
  'experimental': FlaskConical,
  'unstable': Construction,
  'on-watch': XCircle,
  // Highlights
  'disruptive': Zap,
  'influential': Globe,
  'pioneering': Star,
  'innovative': Lightbulb,
};

// All tags use white or green (brand) colors
const tagColorClass = 'text-white';
const tagColorClassGreen = 'text-brand';

interface AlternativeTagBadgeProps {
  tag: AlternativeTagDefinition;
  size?: 'sm' | 'md';
  showName?: boolean;
}

export function AlternativeTagBadge({ tag, size = 'sm', showName = true }: AlternativeTagBadgeProps) {
  const sizeClasses = size === 'sm' 
    ? 'text-xs px-1.5 py-0.5' 
    : 'text-sm px-2 py-1';

  // Styling: alerts are orange, highlights are green, platforms/properties are white
  const categoryStyles = {
    alert: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    highlight: 'bg-brand/10 text-brand border-brand/30',
    platform: 'bg-white/5 text-white border-white/20',
    property: 'bg-white/5 text-white border-white/20',
  };

  const style = categoryStyles[tag.category];
  
  // For platform and property tags, the emoji is text-based
  const isTextEmoji = tag.category === 'platform' || tag.category === 'property';
  
  // Get icon for alerts and highlights
  const Icon = tagIcons[tag.id];
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono rounded border ${style} ${sizeClasses}`}
      title={tag.description}
    >
      {isTextEmoji ? (
        <span className="font-semibold">{tag.emoji}</span>
      ) : Icon ? (
        <Icon className="flex-shrink-0" size={iconSize} />
      ) : (
        <span>{tag.emoji}</span>
      )}
      {showName && !isTextEmoji && <span>{tag.name}</span>}
    </span>
  );
}

interface AlertHighlightBadgesProps {
  alternativeTags: AlternativeTagsData | null | undefined;
  maxDisplay?: number;
  size?: 'sm' | 'md';
}

// Component to display just alerts and highlights (for cards) with icons, names, and tooltips
export function AlertHighlightBadges({ 
  alternativeTags, 
  maxDisplay = 3,
  size = 'sm' 
}: AlertHighlightBadgesProps) {
  const alerts = (alternativeTags?.alerts || [])
    .map(id => getAlternativeTagById(id as AlertTagId))
    .filter((tag): tag is AlternativeTagDefinition => tag !== undefined);

  const highlights = (alternativeTags?.highlights || [])
    .map(id => getAlternativeTagById(id as HighlightTagId))
    .filter((tag): tag is AlternativeTagDefinition => tag !== undefined);

  const hasAlerts = alerts.length > 0;
  const iconSize = size === 'sm' ? 12 : 14;

  // If no alerts, show "Clear" badge
  const alertsToShow = hasAlerts ? alerts : [];
  const allTags = [...alertsToShow, ...highlights];
  
  const displayTags = allTags.slice(0, maxDisplay);
  const remaining = allTags.length - maxDisplay;

  return (
    <div className="flex items-center flex-wrap gap-1.5">
      {/* Show Clear badge if no alerts */}
      {!hasAlerts && (
        <span
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border bg-brand/10 border-brand/30 text-brand text-xs font-mono cursor-help"
          title="No alerts for this alternative"
        >
          <CheckCircle2 size={iconSize} className="flex-shrink-0" />
          <span>Clear</span>
        </span>
      )}
      
      {displayTags.map(tag => {
        const Icon = tagIcons[tag.id];
        // Alerts are orange, highlights are green
        const isAlert = tag.category === 'alert';
        const colorClass = isAlert ? 'text-orange-400' : 'text-brand';
        const bgClass = isAlert ? 'bg-orange-500/10 border-orange-500/30' : 'bg-brand/10 border-brand/30';
        
        return (
          <span
            key={tag.id}
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border ${bgClass} ${colorClass} text-xs font-mono cursor-help transition-all hover:scale-105`}
            title={tag.description}
          >
            {Icon && <Icon size={iconSize} className="flex-shrink-0" />}
            <span className="truncate max-w-[80px]">{tag.name}</span>
          </span>
        );
      })}
      {remaining > 0 && (
        <span className="text-xs text-muted">+{remaining}</span>
      )}
    </div>
  );
}

interface AllTagsBadgesProps {
  alternativeTags: AlternativeTagsData | null | undefined;
  size?: 'sm' | 'md';
  layout?: 'inline' | 'grouped';
}

// Component to display all tags (for alternative detail page)
export function AllTagsBadges({ 
  alternativeTags,
  size = 'sm',
  layout = 'grouped'
}: AllTagsBadgesProps) {
  if (!alternativeTags) return null;

  const alerts = (alternativeTags.alerts || [])
    .map(id => getAlternativeTagById(id as AlertTagId))
    .filter((tag): tag is AlternativeTagDefinition => tag !== undefined);

  const highlights = (alternativeTags.highlights || [])
    .map(id => getAlternativeTagById(id as HighlightTagId))
    .filter((tag): tag is AlternativeTagDefinition => tag !== undefined);

  const platforms = (alternativeTags.platforms || [])
    .map(id => getAlternativeTagById(id as PlatformTagId))
    .filter((tag): tag is AlternativeTagDefinition => tag !== undefined);

  const properties = (alternativeTags.properties || [])
    .map(id => getAlternativeTagById(id as PropertyTagId))
    .filter((tag): tag is AlternativeTagDefinition => tag !== undefined);

  const hasAnyTags = alerts.length > 0 || highlights.length > 0 || platforms.length > 0 || properties.length > 0;

  if (!hasAnyTags) return null;

  if (layout === 'inline') {
    const allTags = [...alerts, ...highlights, ...platforms, ...properties];
    return (
      <div className="flex items-center flex-wrap gap-1.5">
        {allTags.map(tag => (
          <AlternativeTagBadge key={tag.id} tag={tag} size={size} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {alerts.length > 0 && (
        <div className="flex items-center flex-wrap gap-1.5">
          {alerts.map(tag => (
            <AlternativeTagBadge key={tag.id} tag={tag} size={size} showName={false} />
          ))}
        </div>
      )}
      {highlights.length > 0 && (
        <div className="flex items-center flex-wrap gap-1.5">
          {highlights.map(tag => (
            <AlternativeTagBadge key={tag.id} tag={tag} size={size} showName={false} />
          ))}
        </div>
      )}
      {platforms.length > 0 && (
        <div className="flex items-center flex-wrap gap-1.5">
          {platforms.map(tag => (
            <AlternativeTagBadge key={tag.id} tag={tag} size={size} />
          ))}
        </div>
      )}
      {properties.length > 0 && (
        <div className="flex items-center flex-wrap gap-1.5">
          {properties.map(tag => (
            <AlternativeTagBadge key={tag.id} tag={tag} size={size} />
          ))}
        </div>
      )}
    </div>
  );
}

// Compact display for the header section of alternative page - shows full names with icons
export function AlternativeTagsHeader({ 
  alternativeTags 
}: { 
  alternativeTags: AlternativeTagsData | null | undefined 
}) {
  if (!alternativeTags) return null;

  const alerts = (alternativeTags.alerts || [])
    .map(id => getAlternativeTagById(id as AlertTagId))
    .filter((tag): tag is AlternativeTagDefinition => tag !== undefined);

  const highlights = (alternativeTags.highlights || [])
    .map(id => getAlternativeTagById(id as HighlightTagId))
    .filter((tag): tag is AlternativeTagDefinition => tag !== undefined);

  const platforms = (alternativeTags.platforms || [])
    .map(id => getAlternativeTagById(id as PlatformTagId))
    .filter((tag): tag is AlternativeTagDefinition => tag !== undefined);

  const properties = (alternativeTags.properties || [])
    .map(id => getAlternativeTagById(id as PropertyTagId))
    .filter((tag): tag is AlternativeTagDefinition => tag !== undefined);

  const hasAnyTags = alerts.length > 0 || highlights.length > 0 || platforms.length > 0 || properties.length > 0;

  if (!hasAnyTags) return null;

  return (
    <div className="bg-surface border border-border rounded-lg p-3 space-y-2">
      {/* Alerts - show full name with icon (orange) or Clear if none */}
      <div className="flex items-start gap-2">
        <span className="text-xs font-mono text-white/60 w-16 pt-0.5">alerts:</span>
        <div className="flex flex-wrap gap-2">
          {alerts.length > 0 ? (
            alerts.map(tag => {
              const Icon = tagIcons[tag.id];
              return (
                <span 
                  key={tag.id}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono cursor-help"
                  title={tag.description}
                >
                  {Icon && <Icon size={12} className="flex-shrink-0" />}
                  <span>{tag.name}</span>
                </span>
              );
            })
          ) : (
            <span 
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-brand/10 border border-brand/30 text-brand text-xs font-mono cursor-help"
              title="No alerts for this alternative"
            >
              <CheckCircle2 size={12} className="flex-shrink-0" />
              <span>Clear</span>
            </span>
          )}
        </div>
      </div>
      
      {/* Highlights - show full name with icon (green) */}
      {highlights.length > 0 && (
        <div className="flex items-start gap-2">
          <span className="text-xs font-mono text-white/60 w-16 pt-0.5">highlights:</span>
          <div className="flex flex-wrap gap-2">
            {highlights.map(tag => {
              const Icon = tagIcons[tag.id];
              return (
                <span 
                  key={tag.id}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-brand/10 border border-brand/30 text-brand text-xs font-mono cursor-help"
                  title={tag.description}
                >
                  {Icon && <Icon size={12} className="flex-shrink-0" />}
                  <span>{tag.name}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Platforms (white) */}
      {platforms.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-white/60 w-16">platforms:</span>
          <div className="flex flex-wrap gap-1">
            {platforms.map(tag => (
              <span 
                key={tag.id}
                className="px-1.5 py-0.5 bg-white/5 text-white border border-white/20 rounded text-xs font-mono cursor-help"
                title={tag.description}
              >
                {tag.emoji}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Properties (white) */}
      {properties.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-white/60 w-16">props:</span>
          <div className="flex flex-wrap gap-1">
            {properties.map(tag => (
              <span 
                key={tag.id}
                className="px-1.5 py-0.5 bg-white/5 text-white border border-white/20 rounded text-xs font-mono cursor-help"
                title={tag.description}
              >
                {tag.emoji}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
