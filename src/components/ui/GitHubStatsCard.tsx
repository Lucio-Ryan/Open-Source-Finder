'use client';

import { useEffect, useState } from 'react';
import { Star, GitFork, Clock, Users, RefreshCw, AlertCircle } from 'lucide-react';

interface GitHubStatsData {
  stars: number;
  forks: number;
  contributors: number;
  lastCommit: string;
  healthScore: number;
  openIssues: number;
  license: string | null;
}

interface GitHubStatsProps {
  githubUrl: string;
  // Fallback values from database (for initial render / SSR)
  initialStars?: number | null;
  initialForks?: number | null;
  initialContributors?: number | null;
  initialLastCommit?: string | null;
  initialHealthScore?: number | null;
}

export function GitHubStatsCard({
  githubUrl,
  initialStars,
  initialForks,
  initialContributors,
  initialLastCommit,
  initialHealthScore,
}: GitHubStatsProps) {
  const [stats, setStats] = useState<GitHubStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/github-stats?github=${encodeURIComponent(githubUrl)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch stats');
      }

      setStats(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch GitHub stats');
      // Fall back to initial values on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (githubUrl) {
      fetchStats();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [githubUrl]);

  // Use live stats if available, otherwise fall back to initial values
  const displayStats = {
    stars: stats?.stars ?? initialStars ?? 0,
    forks: stats?.forks ?? initialForks ?? 0,
    contributors: stats?.contributors ?? initialContributors ?? 0,
    lastCommit: stats?.lastCommit ?? initialLastCommit,
    healthScore: stats?.healthScore ?? initialHealthScore ?? 0,
  };

  const getHealthScoreLabel = (score: number): { label: string; color: string } => {
    if (score >= 90) return { label: 'Excellent', color: 'text-brand bg-brand/10' };
    if (score >= 70) return { label: 'Good', color: 'text-yellow-400 bg-yellow-500/10' };
    if (score >= 50) return { label: 'Fair', color: 'text-orange-400 bg-orange-500/10' };
    return { label: 'Needs Improvement', color: 'text-red-400 bg-red-500/10' };
  };

  const healthScore = getHealthScoreLabel(displayStats.healthScore);

  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-mono text-brand">// github_stats</h2>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="p-1.5 rounded-lg hover:bg-border/50 text-muted hover:text-brand transition-colors disabled:opacity-50"
          title="Refresh stats"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-orange-400 text-sm mb-4 font-mono">
          <AlertCircle className="w-4 h-4" />
          <span>Using cached data</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Health Score */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <span className="text-muted font-mono">health_score</span>
          <span className={`px-2 py-1 rounded text-sm font-medium font-mono ${healthScore.color}`}>
            {loading && !stats ? (
              <span className="inline-block w-16 h-4 bg-border/50 rounded animate-pulse" />
            ) : (
              `${healthScore.label} (${displayStats.healthScore})`
            )}
          </span>
        </div>

        {/* Stars */}
        <div className="flex items-center justify-between">
          <span className="flex items-center text-muted font-mono">
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
            stars
          </span>
          <span className="font-semibold text-white font-mono">
            {loading && !stats ? (
              <span className="inline-block w-12 h-4 bg-border/50 rounded animate-pulse" />
            ) : (
              formatNumber(displayStats.stars)
            )}
          </span>
        </div>

        {/* Forks */}
        <div className="flex items-center justify-between">
          <span className="flex items-center text-muted font-mono">
            <GitFork className="w-5 h-5 mr-2" />
            forks
          </span>
          <span className="font-semibold text-white font-mono">
            {loading && !stats ? (
              <span className="inline-block w-12 h-4 bg-border/50 rounded animate-pulse" />
            ) : (
              formatNumber(displayStats.forks)
            )}
          </span>
        </div>

        {/* Contributors */}
        <div className="flex items-center justify-between">
          <span className="flex items-center text-muted font-mono">
            <Users className="w-5 h-5 mr-2" />
            contributors
          </span>
          <span className="font-semibold text-white font-mono">
            {loading && !stats ? (
              <span className="inline-block w-12 h-4 bg-border/50 rounded animate-pulse" />
            ) : (
              formatNumber(displayStats.contributors)
            )}
          </span>
        </div>

        {/* Last Commit */}
        <div className="flex items-center justify-between">
          <span className="flex items-center text-muted font-mono">
            <Clock className="w-5 h-5 mr-2" />
            last_commit
          </span>
          <span className="font-semibold text-white font-mono">
            {loading && !stats ? (
              <span className="inline-block w-20 h-4 bg-border/50 rounded animate-pulse" />
            ) : displayStats.lastCommit ? (
              new Date(displayStats.lastCommit).toLocaleDateString()
            ) : (
              'N/A'
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
