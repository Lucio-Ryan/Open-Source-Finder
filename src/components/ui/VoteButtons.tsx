'use client';

import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

interface VoteButtonsProps {
  alternativeId: string;
  initialScore?: number;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'vertical' | 'horizontal';
  className?: string;
}

export function VoteButtons({ 
  alternativeId, 
  initialScore = 0,
  size = 'sm',
  layout = 'vertical',
  className = ''
}: VoteButtonsProps) {
  const { user, loading: authLoading } = useAuth();
  const [voteScore, setVoteScore] = useState(initialScore);
  const [userVote, setUserVote] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Fetch current vote status when component mounts or user changes
  useEffect(() => {
    const fetchVoteStatus = async () => {
      try {
        const params = new URLSearchParams({ alternativeId });
        if (user?.id) {
          params.append('userId', user.id);
        }
        
        const response = await fetch(`/api/votes?${params}`);
        if (response.ok) {
          const data = await response.json();
          setVoteScore(data.voteScore);
          setUserVote(data.userVote);
        }
      } catch (error) {
        console.error('Error fetching vote status:', error);
      }
    };

    fetchVoteStatus();
  }, [alternativeId, user?.id]);

  const handleVote = async (voteType: 1 | -1) => {
    if (!user) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 3000);
      return;
    }

    setIsLoading(true);

    try {
      // If clicking the same vote type, remove the vote
      const newVoteType = userVote === voteType ? 0 : voteType;
      
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          alternativeId,
          voteType: newVoteType,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setVoteScore(data.voteScore);
        setUserVote(data.userVote);
      } else {
        const error = await response.json();
        console.error('Vote error:', error);
      }
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatScore = (score: number): string => {
    if (score >= 1000) {
      return (score / 1000).toFixed(1) + 'k';
    }
    if (score <= -1000) {
      return (score / 1000).toFixed(1) + 'k';
    }
    return score.toString();
  };

  // Size classes
  const sizeClasses = {
    sm: {
      button: 'p-1',
      icon: 'w-4 h-4',
      score: 'text-xs',
      container: 'gap-0.5',
    },
    md: {
      button: 'p-1.5',
      icon: 'w-5 h-5',
      score: 'text-sm',
      container: 'gap-1',
    },
    lg: {
      button: 'p-2',
      icon: 'w-6 h-6',
      score: 'text-base',
      container: 'gap-1',
    },
  };

  const currentSize = sizeClasses[size];
  const isVertical = layout === 'vertical';

  return (
    <div className={`relative ${className}`}>
      <div 
        className={`flex ${isVertical ? 'flex-col' : 'flex-row'} items-center ${currentSize.container}`}
      >
        {/* Upvote Button */}
        <button
          onClick={() => handleVote(1)}
          disabled={isLoading || authLoading}
          className={`${currentSize.button} rounded-md transition-all duration-200 ${
            userVote === 1
              ? 'bg-brand/20 text-brand'
              : 'text-muted hover:text-brand hover:bg-brand/10'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          title={user ? 'Upvote' : 'Sign in to vote'}
          aria-label="Upvote"
        >
          <ChevronUp className={`${currentSize.icon} ${userVote === 1 ? 'stroke-[3]' : ''}`} />
        </button>

        {/* Score */}
        <span 
          className={`${currentSize.score} font-mono font-semibold min-w-[2ch] text-center ${
            voteScore > 0 ? 'text-brand' : voteScore < 0 ? 'text-red-400' : 'text-muted'
          }`}
        >
          {formatScore(voteScore)}
        </span>

        {/* Downvote Button */}
        <button
          onClick={() => handleVote(-1)}
          disabled={isLoading || authLoading}
          className={`${currentSize.button} rounded-md transition-all duration-200 ${
            userVote === -1
              ? 'bg-red-500/20 text-red-400'
              : 'text-muted hover:text-red-400 hover:bg-red-500/10'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          title={user ? 'Downvote' : 'Sign in to vote'}
          aria-label="Downvote"
        >
          <ChevronDown className={`${currentSize.icon} ${userVote === -1 ? 'stroke-[3]' : ''}`} />
        </button>
      </div>

      {/* Login Prompt Tooltip */}
      {showLoginPrompt && (
        <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-surface border border-border rounded-lg shadow-lg whitespace-nowrap">
          <p className="text-xs font-mono text-muted">
            <a href="/login" className="text-brand hover:underline">Sign in</a> to vote
          </p>
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border"></div>
        </div>
      )}
    </div>
  );
}
