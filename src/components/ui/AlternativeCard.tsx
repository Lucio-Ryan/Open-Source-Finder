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
}

export function AlternativeCard({ alternative }: AlternativeCardProps) {
  const [liveStats, setLiveStats] = useState<GitHubStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Fetch live GitHub stats
  useEffect(() => {
    const fetchGitHubStats = async () => {
      if (!alternative.github) return;
      
      setStatsLoading(true);
      try {
        const response = await fetch(`/api/github-stats?github=${encodeURIComponent(alternative.github)}`);
        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            setLiveStats({
              stars: data.data.stars,
              forks: data.data.forks,
              lastCommit: data.data.lastCommit,
              healthScore: data.data.healthScore,
            });
          }
        }
      } catch (err) {
        // Silently fail and use database values
        console.error('Failed to fetch GitHub stats:', err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchGitHubStats();
  }, [alternative.github]);

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
      <div className="flex items-start justify-between mb-5">
        {/* Vote buttons on the left */}
        <div className="flex items-start space-x-3">
          <VoteButtons 
            alternativeId={alternative.id} 
            initialScore={voteScore}
            size="sm"
            layout="vertical"
            className="flex-shrink-0"
          />
          <div className="flex items-center space-x-4">
            {iconUrl ? (
              <Image
                src={iconUrl}
                alt={`${alternative.name} icon`}
                width={56}
                height={56}
                className="w-14 h-14 rounded-xl object-cover border border-brand/20 group-hover:border-brand/40 transition-colors"
              />
            ) : (
              <div className="w-14 h-14 bg-brand/10 border border-brand/20 rounded-xl flex items-center justify-center text-brand font-pixel text-xl group-hover:border-brand/40 transition-colors">
                {alternative.name.charAt(0)}
              </div>
            )}
            <div>
              <Link href={`/alternatives/${alternative.slug}`}>
                <h3 className="font-semibold text-white group-hover:text-brand transition-colors">
                  {alternative.name}
                </h3>
              </Link>
              <div className="flex items-center space-x-2 text-xs font-mono text-muted">
                {isSelfHosted && (
                  <span className="flex items-center text-brand">
                    <Server className="w-3 h-3 mr-1" />
                    self-hosted
                  </span>
                )}
                {alternative.license && (
                  <span className="text-muted/60">• {alternative.license}</span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Health Score */}
        <div className={`flex items-center space-x-2 px-2 py-1 bg-surface rounded-md border border-border ${statsLoading ? 'animate-pulse' : ''}`}>
          <div className={`w-2 h-2 rounded-full ${getHealthScoreColor(displayHealthScore)}`} />
          <span className="text-xs font-mono text-muted">{displayHealthScore}</span>
        </div>
      </div>

      <p className="text-muted text-sm mb-5 line-clamp-2 font-mono leading-relaxed">
        {alternative.short_description || alternative.description}
      </p>

      {/* Alternative To */}
      {alternativeTo.length > 0 && (
        <div className="flex items-center flex-wrap gap-1.5 mb-5 text-xs font-mono">
          <span className="text-muted">alternative to:</span>
          {alternativeTo.slice(0, 3).map((software, index) => (
            <span key={software.id}>
              <Link
                href={`/alternatives-to/${software.slug}`}
                className="text-orange-400 hover:text-orange-300 transition-colors"
              >
                {software.name}
              </Link>
              {index < Math.min(alternativeTo.length, 3) - 1 && (
                <span className="text-muted">,</span>
              )}
            </span>
          ))}
          {alternativeTo.length > 3 && (
            <span className="text-muted">+{alternativeTo.length - 3} more</span>
          )}
        </div>
      )}

      {/* GitHub Stats */}
      {alternative.github && (
        <div className={`flex items-center space-x-5 text-xs font-mono text-muted mb-5 ${statsLoading ? 'animate-pulse' : ''}`}>
          {displayStars > 0 && (
            <div className="flex items-center space-x-1">
              <Star className="w-3.5 h-3.5 text-yellow-500" />
              <span>{formatNumber(displayStars)}</span>
            </div>
          )}
          {displayForks > 0 && (
            <div className="flex items-center space-x-1">
              <GitFork className="w-3.5 h-3.5" />
              <span>{formatNumber(displayForks)}</span>
            </div>
          )}
          {displayLastCommit && (
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatDate(displayLastCommit)}</span>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center space-x-4 pt-5 border-t border-border">
        <a
          href={alternative.website}
          target="_blank"
          rel={isSponsor ? "noopener noreferrer" : "noopener noreferrer nofollow"}
          className="flex items-center space-x-1 text-xs font-mono text-brand hover:text-brand-light transition-colors"
        >
          <span>website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        {alternative.github && (
          <a
            href={alternative.github}
            target="_blank"
            rel={isSponsor ? "noopener noreferrer" : "noopener noreferrer nofollow"}
            className="flex items-center space-x-1 text-xs font-mono text-muted hover:text-white transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>source</span>
          </a>
        )}
      </div>
    </div>
  );
}
