'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, GitFork, Clock, ExternalLink, Github, Server } from 'lucide-react';
import type { AlternativeWithRelations } from '@/types/database';
import { VoteButtons } from './VoteButtons';

// Unified interface that works with both old static data and new Supabase data
interface AlternativeData {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string | null;
  website: string;
  github?: string | null;
  icon_url?: string | null;
  stars?: number | null;
  forks?: number | null;
  lastCommit?: string | null;
  last_commit?: string | null;
  license?: string | null;
  isSelfHosted?: boolean;
  is_self_hosted?: boolean;
  healthScore?: number;
  health_score?: number;
  vote_score?: number | null;
  submission_plan?: string | null;
  tags?: string[] | { slug: string; name: string }[];
  alternative_to?: { id: string; name: string; slug: string }[];
}

interface GitHubStats {
  stars: number;
  forks: number;
  lastCommit: string;
  healthScore: number;
}

interface AlternativeCardProps {
  alternative: AlternativeData | AlternativeWithRelations;
  disableLiveStats?: boolean; // Option to disable live stats fetching for performance
}

// In-memory cache for GitHub stats to prevent duplicate API calls
const statsCache = new Map<string, { data: GitHubStats | null; timestamp: number }>();
const STATS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function AlternativeCard({ alternative, disableLiveStats = false }: AlternativeCardProps) {
  const [liveStats, setLiveStats] = useState<GitHubStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Fetch live GitHub stats with caching and debouncing
  useEffect(() => {
    if (!alternative.github || disableLiveStats) return;
    
    const githubUrl = alternative.github;
    
    // Check cache first
    const cached = statsCache.get(githubUrl);
    if (cached && Date.now() - cached.timestamp < STATS_CACHE_TTL) {
      if (cached.data) {
        setLiveStats(cached.data);
      }
      return;
    }

    let isMounted = true;
    
    const fetchStats = async () => {
      if (!isMounted) return;
      
      setStatsLoading(true);
      try {
        const response = await fetch(`/api/github-stats?github=${encodeURIComponent(githubUrl)}`);
        if (response.ok && isMounted) {
          const data = await response.json();
          if (data.data) {
            const stats: GitHubStats = {
              stars: data.data.stars,
              forks: data.data.forks,
              lastCommit: data.data.lastCommit,
              healthScore: data.data.healthScore,
            };
            setLiveStats(stats);
            // Cache the result
            statsCache.set(githubUrl, { data: stats, timestamp: Date.now() });
          }
        }
      } catch (err) {
        // Silently fail and use database values
        console.error('Failed to fetch GitHub stats:', err);
        statsCache.set(githubUrl, { data: null, timestamp: Date.now() });
      } finally {
        if (isMounted) {
          setStatsLoading(false);
        }
      }
    };

    // Delay fetching to batch requests and reduce API load
    const timeoutId = setTimeout(fetchStats, 500 + Math.random() * 500);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [alternative.github, disableLiveStats]);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  };

  const getHealthScoreColor = (score: number): string => {
    if (score >= 90) return 'bg-brand';
    if (score >= 70) return 'bg-yellow-500';
    if (score >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Normalize data from both old and new formats
  const isSelfHosted = alternative.is_self_hosted ?? (alternative as any).isSelfHosted ?? false;
  const dbHealthScore = alternative.health_score ?? (alternative as any).healthScore ?? 50;
  const dbLastCommit = alternative.last_commit ?? (alternative as any).lastCommit;
  const iconUrl = (alternative as any).icon_url ?? null;
  const voteScore = (alternative as any).vote_score ?? 0;
  const isSponsor = (alternative as any).submission_plan === 'sponsor';
  
  // Use live stats if available, fallback to database values
  const displayStars = liveStats?.stars ?? alternative.stars ?? 0;
  const displayForks = liveStats?.forks ?? alternative.forks ?? 0;
  const displayLastCommit = liveStats?.lastCommit ?? dbLastCommit;
  const displayHealthScore = liveStats?.healthScore ?? dbHealthScore;
  
  // Handle alternative_to - the proprietary software this is an alternative to
  const alternativeTo: { id: string; name: string; slug: string }[] = 
    (alternative as any).alternative_to ?? [];

  return (
    <div className="card-dark group">
      <div className="flex items-start justify-between mb-4 sm:mb-5 gap-2">
        {/* Left: Icon + Title */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
            {iconUrl ? (
              <Image
                src={iconUrl}
                alt={`${alternative.name} icon`}
                width={56}
                height={56}
                className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl object-cover border border-brand/20 group-hover:border-brand/40 transition-colors flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-brand/10 border border-brand/20 rounded-lg sm:rounded-xl flex items-center justify-center text-brand font-pixel text-base sm:text-xl group-hover:border-brand/40 transition-colors flex-shrink-0">
                {alternative.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <Link href={`/alternatives/${alternative.slug}`}>
                <h3 className="font-semibold text-sm sm:text-base text-white group-hover:text-brand transition-colors truncate">
                  {alternative.name}
                </h3>
              </Link>
              <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 text-xs font-mono text-muted">
                {isSelfHosted && (
                  <span className="flex items-center text-brand">
                    <Server className="w-3 h-3 mr-1" />
                    <span className="hidden xs:inline">self-hosted</span>
                    <span className="xs:hidden">SH</span>
                  </span>
                )}
                {alternative.license && (
                  <span className="text-muted/60 truncate max-w-[80px] sm:max-w-none">• {alternative.license}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Vote buttons */}
        <div className="flex-shrink-0">
          <VoteButtons
            alternativeId={alternative.id}
            initialScore={voteScore}
            size="sm"
            layout="vertical"
            className="flex-shrink-0"
          />
        </div>
      </div>

      <p className="text-muted text-xs sm:text-sm mb-4 sm:mb-5 line-clamp-2 font-mono leading-relaxed">
        {alternative.short_description || alternative.description}
      </p>

      {/* Alternative To */}
      {alternativeTo.length > 0 && (
        <div className="flex items-center flex-wrap gap-1 sm:gap-1.5 mb-4 sm:mb-5 text-xs font-mono">
          <span className="text-muted">alt to:</span>
          {alternativeTo.slice(0, 2).map((software, index) => (
            <span key={software.id}>
              <Link
                href={`/alternatives-to/${software.slug}`}
                className="text-orange-400 hover:text-orange-300 transition-colors touch-manipulation"
              >
                {software.name}
              </Link>
              {index < Math.min(alternativeTo.length, 2) - 1 && (
                <span className="text-muted">,</span>
              )}
            </span>
          ))}
          {/* Removed +N overflow indicator to avoid showing counts next to badges */}
        </div>
      )}

      {/* GitHub Stats */}
      {alternative.github && (
        <div className={`flex items-center flex-wrap gap-x-3 sm:gap-x-5 gap-y-1 text-xs font-mono text-muted mb-4 sm:mb-5 ${statsLoading ? 'animate-pulse' : ''}`}>
          {displayStars > 0 && (
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-500" />
              <span>{formatNumber(displayStars)}</span>
            </div>
          )}
          {displayForks > 0 && (
            <div className="flex items-center space-x-1">
              <GitFork className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{formatNumber(displayForks)}</span>
            </div>
          )}
          {displayLastCommit && (
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{formatDate(displayLastCommit)}</span>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center space-x-3 sm:space-x-4 pt-4 sm:pt-5 border-t border-border">
        <a
          href={alternative.website}
          target="_blank"
          rel={isSponsor ? "noopener noreferrer" : "noopener noreferrer nofollow"}
          className="flex items-center space-x-1 text-xs font-mono text-brand hover:text-brand-light transition-colors touch-manipulation py-1"
        >
          <span>website</span>
          <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </a>
        {alternative.github && (
          <a
            href={alternative.github}
            target="_blank"
            rel={isSponsor ? "noopener noreferrer" : "noopener noreferrer nofollow"}
            className="flex items-center space-x-1 text-xs font-mono text-muted hover:text-white transition-colors touch-manipulation py-1"
          >
            <Github className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>source</span>
          </a>
        )}
      </div>
    </div>
  );
}
