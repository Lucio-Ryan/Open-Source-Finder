'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, Send, Trash2, Reply, Bell, ChevronDown, ChevronUp, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { DiscussionWithAuthor } from '@/types/database';

interface DiscussionSectionProps {
  alternativeId: string;
  alternativeName: string;
  creatorId?: string | null;
}

export default function DiscussionSection({ alternativeId, alternativeName, creatorId }: DiscussionSectionProps) {
  const { user, profile } = useAuth();
  const [discussions, setDiscussions] = useState<DiscussionWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [requestCreatorResponse, setRequestCreatorResponse] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  const isCreator = user && creatorId && user.id === creatorId;

  const fetchDiscussions = useCallback(async () => {
    try {
      const response = await fetch(`/api/discussions?alternativeId=${alternativeId}`);
      const data = await response.json();
      
      if (response.ok) {
        setDiscussions(data.discussions || []);
        // Auto-expand replies for discussions with creator responses
        const autoExpand: string[] = [];
        data.discussions?.forEach((d: DiscussionWithAuthor) => {
          if (d.replies?.some(r => r.is_creator_response)) {
            autoExpand.push(d.id);
          }
        });
        setExpandedReplies(prev => new Set([...Array.from(prev), ...autoExpand]));
      } else {
        setError(data.error || 'Failed to load discussions');
      }
    } catch (err) {
      setError('Failed to load discussions');
    } finally {
      setLoading(false);
    }
  }, [alternativeId]);

  useEffect(() => {
    fetchDiscussions();
  }, [fetchDiscussions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alternativeId,
          content: newComment.trim(),
          requestCreatorResponse: requestCreatorResponse && !isCreator
        })
      });

      if (response.ok) {
        const data = await response.json();
        setDiscussions(prev => [{ ...data.discussion, replies: [] }, ...prev]);
        setNewComment('');
        setRequestCreatorResponse(false);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to post comment');
      }
    } catch (err) {
      setError('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (parentId: string, content: string) => {
    if (!content.trim() || !user) return;

    try {
      const response = await fetch('/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alternativeId,
          content: content.trim(),
          parentId,
          requestCreatorResponse: false
        })
      });

      if (response.ok) {
        const data = await response.json();
        setDiscussions(prev => prev.map(d => {
          if (d.id === parentId) {
            return { ...d, replies: [...(d.replies || []), data.discussion] };
          }
          return d;
        }));
        setReplyingTo(null);
        setExpandedReplies(prev => new Set([...Array.from(prev), parentId]));
        return true; // Signal success
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to post reply');
        return false;
      }
    } catch (err) {
      setError('Failed to post reply');
      return false;
    }
  };

  const handleDelete = async (discussionId: string, parentId?: string | null) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await fetch(`/api/discussions?id=${discussionId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        if (parentId) {
          // Remove reply
          setDiscussions(prev => prev.map(d => {
            if (d.id === parentId) {
              return { ...d, replies: d.replies?.filter(r => r.id !== discussionId) };
            }
            return d;
          }));
        } else {
          // Remove top-level discussion
          setDiscussions(prev => prev.filter(d => d.id !== discussionId));
        }
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete comment');
      }
    } catch (err) {
      setError('Failed to delete comment');
    }
  };

  const toggleReplies = (discussionId: string) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(discussionId)) {
        newSet.delete(discussionId);
      } else {
        newSet.add(discussionId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  // Reply form component - manages its own state to avoid re-renders
  const ReplyForm = ({ discussionId }: { discussionId: string }) => {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
      if (!content.trim()) return;
      setIsSubmitting(true);
      const success = await handleReply(discussionId, content);
      if (success) {
        setContent('');
      }
      setIsSubmitting(false);
    };

    return (
      <div className="mt-3 ml-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
            placeholder="Write a reply..."
            className="flex-1 px-3 py-2 bg-dark border border-border rounded-lg text-white text-sm focus:outline-none focus:border-brand font-mono"
            disabled={isSubmitting}
            autoFocus
          />
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
            className="px-4 py-2 bg-brand text-dark font-mono text-sm font-medium rounded-lg hover:bg-brand-light disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    );
  };

  // Render a single discussion item
  const renderDiscussionContent = (discussion: DiscussionWithAuthor, isReply = false, parentId?: string) => {
    const canDelete = user && (user.id === discussion.user_id || profile?.role === 'admin');
    const hasReplies = discussion.replies && discussion.replies.length > 0;
    const isExpanded = expandedReplies.has(discussion.id);

    return (
      <div key={discussion.id} className={`${isReply ? 'ml-8 pl-4 border-l-2 border-border' : ''}`}>
        <div className={`bg-surface rounded-lg border p-4 ${
          discussion.is_creator_response 
            ? 'border-brand/50 bg-brand/5' 
            : discussion.request_creator_response 
              ? 'border-yellow-500/30' 
              : 'border-border'
        }`}>
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {discussion.author?.avatar_url ? (
                <Image
                  src={discussion.author.avatar_url}
                  alt={discussion.author.name || 'User'}
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full object-cover border border-border"
                />
              ) : (
                <div className="w-9 h-9 bg-brand/10 rounded-full flex items-center justify-center text-brand font-mono text-sm">
                  {(discussion.author?.name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white text-sm">
                    {discussion.author?.name || 'Anonymous'}
                  </span>
                  {discussion.is_creator_response && (
                    <span className="px-2 py-0.5 bg-brand/20 text-brand rounded text-xs font-mono">
                      Creator
                    </span>
                  )}
                  {discussion.request_creator_response && !discussion.is_creator_response && (
                    <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded text-xs font-mono flex items-center gap-1">
                      <Bell className="w-3 h-3" />
                      Response Requested
                    </span>
                  )}
                </div>
                <span className="text-muted text-xs font-mono">
                  {formatDate(discussion.created_at)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {!isReply && user && (
                <button
                  onClick={() => setReplyingTo(replyingTo === discussion.id ? null : discussion.id)}
                  className="p-1.5 text-muted hover:text-brand transition-colors"
                  title="Reply"
                >
                  <Reply className="w-4 h-4" />
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => handleDelete(discussion.id, isReply ? parentId : null)}
                  className="p-1.5 text-muted hover:text-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <p className="mt-3 text-gray-300 text-sm whitespace-pre-wrap">
            {discussion.content}
          </p>

          {/* Replies Toggle */}
          {hasReplies && !isReply && (
            <button
              onClick={() => toggleReplies(discussion.id)}
              className="mt-3 flex items-center gap-1 text-muted hover:text-brand text-sm font-mono transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {discussion.replies!.length} {discussion.replies!.length === 1 ? 'reply' : 'replies'}
            </button>
          )}
        </div>

        {/* Reply Form - rendered outside of nested component */}
        {replyingTo === discussion.id && <ReplyForm discussionId={discussion.id} />}

        {/* Replies */}
        {hasReplies && isExpanded && (
          <div className="mt-3 space-y-3">
            {discussion.replies!.map((reply) => renderDiscussionContent(reply, true, discussion.id))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5 text-brand" />
        <h2 className="text-lg font-mono text-brand">// discussion</h2>
        <span className="text-muted text-sm font-mono">({discussions.length})</span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">×</button>
        </div>
      )}

      {/* New Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={`Share your thoughts about ${alternativeName}...`}
            rows={3}
            className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white placeholder-muted focus:outline-none focus:border-brand font-mono text-sm resize-none"
            disabled={submitting}
          />
          <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {/* Request Creator Response Checkbox */}
            {!isCreator && creatorId && (
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={requestCreatorResponse}
                  onChange={(e) => setRequestCreatorResponse(e.target.checked)}
                  className="w-4 h-4 rounded border-border bg-dark text-brand focus:ring-brand focus:ring-offset-0"
                  disabled={submitting}
                />
                <span className="text-sm text-muted group-hover:text-white transition-colors flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-yellow-400" />
                  Request creator response
                </span>
              </label>
            )}
            {(isCreator || !creatorId) && <div />}
            
            <button
              type="submit"
              disabled={!newComment.trim() || submitting}
              className="flex items-center gap-2 px-4 py-2 bg-brand text-dark font-mono font-medium rounded-lg hover:bg-brand-light disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-glow"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Post Comment
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-dark border border-border rounded-lg text-center">
          <p className="text-muted text-sm mb-2">Sign in to join the discussion</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-dark font-mono font-medium rounded-lg hover:bg-brand-light transition-all text-sm"
          >
            Sign In
          </Link>
        </div>
      )}

      {/* Discussions List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-brand animate-spin" />
        </div>
      ) : discussions.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-muted mx-auto mb-3" />
          <p className="text-muted font-mono text-sm">No discussions yet</p>
          <p className="text-muted/70 text-xs mt-1">Be the first to start a conversation!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {discussions.map((discussion) => renderDiscussionContent(discussion))}
        </div>
      )}
    </div>
  );
}
