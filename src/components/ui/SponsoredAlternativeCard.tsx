'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, GitFork, Clock, ExternalLink, Github, Server, BadgeCheck, ArrowRight, Sparkles } from 'lucide-react';
import type { AlternativeWithRelations } from '@/types/database';
import { VoteButtons } from './VoteButtons';

interface GitHubStats {
  stars: number;
  forks: number;
  lastCommit: string;
  healthScore: number;
}

interface SponsoredAlternativeCardProps {
  alternative: AlternativeWithRelations;
}

export function SponsoredAlternativeCard({ alternative }: SponsoredAlternativeCardProps) {
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

  // Normalize data
  const isSelfHosted = alternative.is_self_hosted ?? false;
  const iconUrl = alternative.icon_url ?? null;
  const voteScore = alternative.vote_score ?? 0;
  const screenshots = alternative.screenshots ?? [];
  const longDescription = alternative.long_description || alternative.description;
  const dbLastCommit = alternative.last_commit ?? (alternative as any).lastCommit;
  
  // Use live stats if available
  const displayStars = liveStats?.stars ?? alternative.stars ?? 0;
  const displayForks = liveStats?.forks ?? alternative.forks ?? 0;
  const displayLastCommit = liveStats?.lastCommit ?? dbLastCommit;

  // Handle alternative_to - the proprietary software this is an alternative to
  const alternativeTo: { id: string; name: string; slug: string }[] = 
    (alternative as any).alternative_to ?? [];

  // Truncate description to 500 characters
  const truncatedDescription = longDescription.length > 500 
    ? longDescription.slice(0, 500) + '...' 
    : longDescription;

  // Strip HTML tags for display
  const plainDescription = truncatedDescription.replace(/<[^>]*>/g, '');

  return (
    <div className="relative group h-full">
      {/* Sponsored Badge - Top Right */}
      <div className="absolute -top-2 right-3 flex items-center gap-1 px-2 py-0.5 bg-emerald-500 text-dark text-xs font-bold rounded font-mono z-10">
        <Sparkles className="w-3 h-3" />
        Sponsored
      </div>
      
      {/* Card with gradient border effect */}
      <div className="relative h-full p-[2px] rounded-2xl bg-gradient-to-r from-emerald-500/50 via-green-500/50 to-emerald-500/50">
        <div className="bg-surface rounded-2xl p-5 h-full flex flex-col">
          {/* Header with icon and name */}
          <div className="flex items-start gap-3 mb-3">
            {iconUrl ? (
              <Image
                src={iconUrl}
                alt={`${alternative.name} icon`}
                width={48}
                height={48}
                className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500/30"
              />
            ) : (
              <div className="w-12 h-12 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-500 font-pixel text-lg">
                {alternative.name.charAt(0)}
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <Link href={`/alternatives/${alternative.slug}`} className="flex items-center gap-1.5">
                <h3 className="text-lg font-bold text-white hover:text-emerald-400 transition-colors font-mono truncate">
                  {alternative.name}
                </h3>
                <BadgeCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              </Link>
              {/* Self-hosted and License badges - like standard card */}
              <div className="flex items-center space-x-2 text-xs font-mono text-muted">
                {isSelfHosted && (
                  <span className="flex items-center text-emerald-400">
                    <Server className="w-3 h-3 mr-1" />
                    self-hosted
                  </span>
                )}
                {alternative.license && (
                  <span className="text-muted/60">• {alternative.license}</span>
                )}
              </div>
            </div>
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

          {/* Screenshot */}
          {screenshots.length > 0 && (
            <div className="mb-3">
              <div className="relative aspect-video rounded-lg overflow-hidden border border-emerald-500/20">
                <Image
                  src={screenshots[0]}
                  alt={`${alternative.name} screenshot`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-3 flex-grow">
            <p className="text-muted text-xs leading-relaxed line-clamp-4">
              {plainDescription}
            </p>
          </div>

          {/* Alternative To - like standard card with orange links */}
          {alternativeTo.length > 0 && (
            <div className="flex items-center flex-wrap gap-1.5 mb-3 text-xs font-mono">
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
              {/* Removed '+N more' overflow indicator to avoid numbers appearing next to badges */}
            </div>
          )}

          {/* GitHub Stats - like standard card with yellow stars and last commit */}
          {alternative.github && (
            <div className={`flex items-center space-x-4 text-xs font-mono text-muted mb-3 ${statsLoading ? 'animate-pulse' : ''}`}>
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

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-3 border-t border-border mt-auto">
            <Link
              href={`/alternatives/${alternative.slug}`}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-dark font-medium font-mono text-sm rounded-lg hover:opacity-90 transition-opacity"
              aria-label={`Learn more about ${alternative.name}`}
            >
              Learn more about {alternative.name}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            
            {alternative.website && (
              <a
                href={alternative.website}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-dark border border-border rounded-lg text-muted hover:text-white hover:border-emerald-500/50 transition-colors"
                title={`Visit ${alternative.name} website`}
                aria-label={`Visit ${alternative.name} website`}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {alternative.github && (
              <a
                href={alternative.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-dark border border-border rounded-lg text-muted hover:text-white hover:border-emerald-500/50 transition-colors"
                title={`View ${alternative.name} on GitHub`}
                aria-label={`View ${alternative.name} on GitHub`}
              >
                <Github className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
