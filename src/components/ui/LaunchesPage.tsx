'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Rocket, 
  Calendar, 
  TrendingUp, 
  Star, 
  Flame,
  ChevronUp,
  Clock,
  Filter,
  X,
  ChevronDown,
  ExternalLink,
  Github,
  Server
} from 'lucide-react';
import { VoteButtons } from './VoteButtons';

interface LaunchAlternative {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string | null;
  icon_url?: string | null;
  website: string;
  github?: string | null;
  stars?: number | null;
  forks?: number | null;
  is_self_hosted?: boolean;
  health_score?: number;
  vote_score?: number;
  created_at: string;
  categories?: { id: string; name: string; slug: string }[];
  alternative_to?: { id: string; name: string; slug: string }[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProprietarySoftware {
  id: string;
  name: string;
  slug: string;
}

interface LaunchPageProps {
  categories: Category[];
  proprietarySoftware: ProprietarySoftware[];
}

type TimeFrame = 'today' | 'week' | 'month' | 'year' | 'all';
type SortOption = 'vote_score' | 'stars' | 'newest' | 'health_score';

const TIME_FRAMES: { value: TimeFrame; label: string; icon: React.ReactNode }[] = [
  { value: 'today', label: 'Today', icon: <Flame className="w-4 h-4" /> },
  { value: 'week', label: 'This Week', icon: <TrendingUp className="w-4 h-4" /> },
  { value: 'month', label: 'This Month', icon: <Calendar className="w-4 h-4" /> },
  { value: 'year', label: 'This Year', icon: <Star className="w-4 h-4" /> },
  { value: 'all', label: 'All Time', icon: <Clock className="w-4 h-4" /> },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'vote_score', label: 'Most Upvoted' },
  { value: 'stars', label: 'Most Stars' },
  { value: 'newest', label: 'Newest First' },
  { value: 'health_score', label: 'Health Score' },
];

export function LaunchesPage({ categories, proprietarySoftware }: LaunchPageProps) {
  const [alternatives, setAlternatives] = useState<LaunchAlternative[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('today');
  const [sortBy, setSortBy] = useState<SortOption>('vote_score');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedAlternativeTo, setSelectedAlternativeTo] = useState<string>('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const fetchLaunches = useCallback(async (reset = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        timeFrame,
        sortBy,
        page: reset ? '1' : page.toString(),
        limit: '20',
      });

      if (selectedCategory) {
        params.set('category', selectedCategory);
      }
      if (selectedAlternativeTo) {
        params.set('alternativeTo', selectedAlternativeTo);
      }

      const response = await fetch(`/api/launches?${params}`);
      const data = await response.json();

      if (reset) {
        setAlternatives(data.alternatives || []);
        setPage(1);
      } else {
        setAlternatives(prev => [...prev, ...(data.alternatives || [])]);
      }
      setHasMore(data.hasMore);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to fetch launches:', error);
    } finally {
      setLoading(false);
    }
  }, [timeFrame, sortBy, selectedCategory, selectedAlternativeTo, page]);

  useEffect(() => {
    fetchLaunches(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeFrame, sortBy, selectedCategory, selectedAlternativeTo]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      // Fetch with the new page number directly
      const fetchMore = async () => {
        setLoading(true);
        try {
          const params = new URLSearchParams({
            timeFrame,
            sortBy,
            page: nextPage.toString(),
            limit: '20',
          });

          if (selectedCategory) {
            params.set('category', selectedCategory);
          }
          if (selectedAlternativeTo) {
            params.set('alternativeTo', selectedAlternativeTo);
          }

          const response = await fetch(`/api/launches?${params}`);
          const data = await response.json();

          setAlternatives(prev => [...prev, ...(data.alternatives || [])]);
          setHasMore(data.hasMore);
          setTotal(data.total || 0);
        } catch (error) {
          console.error('Failed to fetch launches:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchMore();
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedAlternativeTo('');
  };

  const hasActiveFilters = selectedCategory || selectedAlternativeTo;

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-surface/50 border-b border-border z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <Link
                href="/"
                className="inline-flex items-center text-muted hover:text-brand font-mono text-sm mb-3 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                cd ../home
              </Link>
              <div className="flex items-center space-x-3">
                <Rocket className="w-8 h-8 text-brand" />
                <h1 className="text-3xl font-bold text-white">
                  Launches<span className="text-brand">_</span>
                </h1>
              </div>
              <p className="text-muted font-mono text-sm mt-2">
                <span className="text-brand">$</span> Discover the newest open source alternatives
              </p>
            </div>

            {/* Time Frame Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
              {TIME_FRAMES.map((tf) => (
                <button
                  key={tf.value}
                  onClick={() => setTimeFrame(tf.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm whitespace-nowrap transition-all ${
                    timeFrame === tf.value
                      ? 'bg-brand text-dark'
                      : 'bg-surface border border-border text-muted hover:text-white hover:border-brand/50'
                  }`}
                >
                  {tf.icon}
                  {tf.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block lg:w-72 flex-shrink-0">
            <div className="bg-surface rounded-xl border border-border p-6 sticky top-32">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-brand" />
                  <h2 className="font-mono text-white">// Filters</h2>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs font-mono text-muted hover:text-brand transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-xs font-mono text-muted mb-2 uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Alternative To Filter */}
                <div>
                  <label className="block text-xs font-mono text-muted mb-2 uppercase tracking-wider">
                    Alternative To
                  </label>
                  <select
                    value={selectedAlternativeTo}
                    onChange={(e) => setSelectedAlternativeTo(e.target.value)}
                    className="w-full px-3 py-2.5 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50"
                  >
                    <option value="">All Software</option>
                    {proprietarySoftware.map((sw) => (
                      <option key={sw.id} value={sw.slug}>
                        {sw.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-8 pt-6 border-t border-border">
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand">{total}</div>
                  <div className="text-xs font-mono text-muted mt-1">
                    {timeFrame === 'all' ? 'Total Launches' : `Launches ${TIME_FRAMES.find(t => t.value === timeFrame)?.label}`}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filters Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between px-4 py-3 bg-surface border border-border rounded-lg text-white"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-brand" />
                <span className="font-mono text-sm">Filters</span>
                {hasActiveFilters && (
                  <span className="px-2 py-0.5 bg-brand/20 text-brand text-xs rounded-full">
                    Active
                  </span>
                )}
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Mobile Filters Panel */}
            {showFilters && (
              <div className="mt-4 p-4 bg-surface border border-border rounded-lg space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-muted mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-dark border border-border rounded-lg text-white font-mono text-sm"
                    >
                      <option value="">All</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-muted mb-2">Alternative To</label>
                    <select
                      value={selectedAlternativeTo}
                      onChange={(e) => setSelectedAlternativeTo(e.target.value)}
                      className="w-full px-3 py-2 bg-dark border border-border rounded-lg text-white font-mono text-sm"
                    >
                      <option value="">All Software</option>
                      {proprietarySoftware.map((sw) => (
                        <option key={sw.id} value={sw.slug}>
                          {sw.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm font-mono text-brand hover:text-brand/80"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Active Filters Tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand/10 border border-brand/30 rounded-full text-brand text-sm font-mono">
                    Category: {categories.find(c => c.slug === selectedCategory)?.name}
                    <button onClick={() => setSelectedCategory('')} className="hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {selectedAlternativeTo && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand/10 border border-brand/30 rounded-full text-brand text-sm font-mono">
                    Alternative to: {proprietarySoftware.find(s => s.slug === selectedAlternativeTo)?.name}
                    <button onClick={() => setSelectedAlternativeTo('')} className="hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Launches List */}
            <div className="space-y-4">
              {loading && alternatives.length === 0 ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="bg-surface border border-border rounded-xl p-6 animate-pulse">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-dark rounded-xl" />
                      <div className="flex-1">
                        <div className="h-6 bg-dark rounded w-1/3 mb-2" />
                        <div className="h-4 bg-dark rounded w-2/3 mb-3" />
                        <div className="h-3 bg-dark rounded w-1/4" />
                      </div>
                      <div className="w-16 h-20 bg-dark rounded-lg" />
                    </div>
                  </div>
                ))
              ) : alternatives.length === 0 ? (
                <div className="text-center py-16">
                  <Rocket className="w-16 h-16 text-muted mx-auto mb-4" />
                  <h3 className="text-xl font-mono text-white mb-2">No launches found</h3>
                  <p className="text-muted font-mono text-sm">
                    Try adjusting your filters or time frame
                  </p>
                </div>
              ) : (
                alternatives.map((alt, index) => (
                  <LaunchCard 
                    key={alt.id} 
                    alternative={alt} 
                    rank={index + 1}
                    formatDate={formatDate}
                    formatNumber={formatNumber}
                  />
                ))
              )}
            </div>

            {/* Load More */}
            {hasMore && alternatives.length > 0 && (
              <div className="mt-8 text-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-8 py-3 bg-surface border border-border rounded-lg text-white font-mono hover:border-brand/50 hover:text-brand transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    'Load more launches'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Product Hunt style launch card
function LaunchCard({ 
  alternative, 
  rank,
  formatDate,
  formatNumber 
}: { 
  alternative: LaunchAlternative; 
  rank: number;
  formatDate: (date: string) => string;
  formatNumber: (num: number) => string;
}) {
  return (
    <div className="group bg-surface border border-border rounded-xl p-6 hover:border-brand/30 transition-all">
      <div className="flex items-start gap-4">
        {/* Rank badge */}
        <div className="hidden sm:flex flex-col items-center justify-center w-10">
          <span className="text-2xl font-bold text-brand">#{rank}</span>
        </div>

        {/* Vote Section */}
        <div className="flex-shrink-0">
          <VoteButtons 
            alternativeId={alternative.id} 
            initialScore={alternative.vote_score || 0}
            size="md"
            layout="vertical"
          />
        </div>

        {/* Icon */}
        <div className="flex-shrink-0">
          {alternative.icon_url ? (
            <Image
              src={alternative.icon_url}
              alt={`${alternative.name} icon`}
              width={64}
              height={64}
              className="w-16 h-16 rounded-xl object-cover border border-border group-hover:border-brand/30 transition-colors"
            />
          ) : (
            <div className="w-16 h-16 bg-brand/10 border border-border rounded-xl flex items-center justify-center text-brand font-pixel text-2xl group-hover:border-brand/30 transition-colors">
              {alternative.name.charAt(0)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Link href={`/alternatives/${alternative.slug}`}>
                <h3 className="text-lg font-semibold text-white group-hover:text-brand transition-colors">
                  {alternative.name}
                </h3>
              </Link>
              <p className="text-muted text-sm mt-1 line-clamp-2">
                {alternative.short_description || alternative.description}
              </p>
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            {/* Categories */}
            {alternative.categories && alternative.categories.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {alternative.categories.slice(0, 2).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className="px-2 py-0.5 bg-brand/10 text-brand text-xs font-mono rounded hover:bg-brand/20 transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Alternative to */}
            {alternative.alternative_to && alternative.alternative_to.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted font-mono">
                <span>→</span>
                {alternative.alternative_to.slice(0, 2).map((prop, i) => (
                  <span key={prop.id}>
                    <Link
                      href={`/alternatives-to/${prop.slug}`}
                      className="hover:text-brand transition-colors"
                    >
                      {prop.name}
                    </Link>
                    {i < Math.min(alternative.alternative_to!.length, 2) - 1 && ', '}
                  </span>
                ))}
              </div>
            )}

            {/* Self-hosted badge */}
            {alternative.is_self_hosted && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-500/10 text-purple-400 text-xs font-mono rounded">
                <Server className="w-3 h-3" />
                Self-hosted
              </span>
            )}

            {/* Stats */}
            {alternative.stars && (
              <span className="flex items-center gap-1 text-xs text-muted">
                <Star className="w-3 h-3" />
                {formatNumber(alternative.stars)}
              </span>
            )}

            {/* Launch date */}
            <span className="flex items-center gap-1 text-xs text-muted ml-auto">
              <Clock className="w-3 h-3" />
              {formatDate(alternative.created_at)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="hidden sm:flex flex-col gap-2">
          <a
            href={alternative.website}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-dark border border-border rounded-lg text-muted hover:text-brand hover:border-brand/30 transition-colors"
            title="Visit website"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          {alternative.github && (
            <a
              href={alternative.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-dark border border-border rounded-lg text-muted hover:text-brand hover:border-brand/30 transition-colors"
              title="View on GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
