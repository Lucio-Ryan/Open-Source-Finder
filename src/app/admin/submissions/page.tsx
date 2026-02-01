'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Eye,
  Edit2,
  Trash2,
  ExternalLink,
  Github,
  Star,
  Clock,
  AlertCircle,
  Filter,
  Tags
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { AlertHighlightBadges } from '@/components/ui/AlternativeTagsBadges';
import type { AlternativeTagsData } from '@/data/alternative-tags';

interface Submission {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string | null;
  website: string;
  github: string | null;
  icon_url: string | null;
  stars: number | null;
  health_score: number;
  license: string | null;
  is_self_hosted: boolean;
  featured: boolean;
  approved: boolean;
  rejection_reason: string | null;
  rejected_at: string | null;
  submitter_name: string | null;
  submitter_email: string | null;
  created_at: string;
  alternative_tags: AlternativeTagsData;
  alternative_categories: { categories: { name: string } }[];
  alternative_to: { proprietary_software: { name: string } }[];
}

export default function AdminSubmissionsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || profile?.role !== 'admin')) {
      router.push('/admin');
    }
  }, [user, profile, authLoading, router]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/submissions?status=${filter}`);
        if (response.ok) {
          const data = await response.json();
          setSubmissions(data.submissions || []);
        }
      } catch (error) {
        console.error('Failed to fetch submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (profile?.role === 'admin') {
      fetchSubmissions();
    }
  }, [profile, filter]);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      const response = await fetch('/api/admin/submissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'approve' }),
      });

      if (response.ok) {
        setSubmissions(prev => 
          prev.map(s => s.id === id ? { ...s, approved: true } : s)
        );
      }
    } catch (error) {
      console.error('Failed to approve:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const openRejectModal = (id: string) => {
    setRejectingId(id);
    setRejectionReason('');
    setRejectModalOpen(true);
  };

  const handleReject = async () => {
    if (!rejectingId) return;
    
    setActionLoading(rejectingId);
    try {
      const response = await fetch('/api/admin/submissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: rejectingId, 
          action: 'reject',
          rejection_reason: rejectionReason || 'No reason provided'
        }),
      });

      if (response.ok) {
        setSubmissions(prev => prev.filter(s => s.id !== rejectingId));
        setRejectModalOpen(false);
        setRejectingId(null);
        setRejectionReason('');
      }
    } catch (error) {
      console.error('Failed to reject:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    
    setActionLoading(id);
    try {
      const response = await fetch(`/api/admin/submissions?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSubmissions(prev => prev.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    setActionLoading(id);
    try {
      const response = await fetch('/api/admin/submissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, featured: !currentFeatured }),
      });

      if (response.ok) {
        setSubmissions(prev => 
          prev.map(s => s.id === id ? { ...s, featured: !currentFeatured } : s)
        );
      }
    } catch (error) {
      console.error('Failed to toggle featured:', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (authLoading || !user || !profile || profile.role !== 'admin') {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  const pendingCount = submissions.filter(s => !s.approved && !s.rejected_at).length;
  const rejectedCount = submissions.filter(s => s.rejected_at).length;

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/admin"
            className="inline-flex items-center text-muted hover:text-brand font-mono text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Link>
          <h1 className="text-3xl font-bold text-white font-mono">
            Submissions<span className="text-brand">_</span>
          </h1>
          <p className="text-muted font-mono text-sm mt-2">
            Review and manage all alternative submissions
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted" />
            <span className="text-muted font-mono text-sm">Filter:</span>
          </div>
          <div className="flex gap-2">
            {(['pending', 'approved', 'rejected', 'all'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-mono text-sm transition-colors ${
                  filter === status
                    ? 'bg-brand text-dark'
                    : 'bg-surface border border-border text-muted hover:text-white'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status === 'pending' && pendingCount > 0 && filter !== 'pending' && (
                  <span className="ml-2 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                    {pendingCount}
                  </span>
                )}
                {status === 'rejected' && rejectedCount > 0 && filter !== 'rejected' && (
                  <span className="ml-2 px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">
                    {rejectedCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Submissions List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-brand animate-spin" />
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted font-mono">No submissions found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className={`bg-surface border rounded-xl p-6 ${
                  submission.approved ? 'border-border' : 'border-yellow-500/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  {submission.icon_url ? (
                    <Image
                      src={submission.icon_url}
                      alt={submission.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center text-brand font-bold">
                      {submission.name.charAt(0)}
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {submission.name}
                          {submission.featured && (
                            <Star className="w-4 h-4 text-yellow-400 inline ml-2" />
                          )}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-muted mt-1">
                          {submission.approved ? (
                            <span className="flex items-center gap-1 text-brand">
                              <CheckCircle className="w-4 h-4" /> Approved
                            </span>
                          ) : submission.rejected_at ? (
                            <span className="flex items-center gap-1 text-red-400">
                              <XCircle className="w-4 h-4" /> Rejected
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-yellow-400">
                              <Clock className="w-4 h-4" /> Pending
                            </span>
                          )}
                          <span>•</span>
                          <span>{new Date(submission.created_at).toLocaleDateString()}</span>
                          {submission.submitter_email && (
                            <>
                              <span>•</span>
                              <span>{submission.submitter_email}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {!submission.approved && !submission.rejected_at && (
                          <>
                            <button
                              onClick={() => handleApprove(submission.id)}
                              disabled={actionLoading === submission.id}
                              className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50"
                              title="Approve"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => openRejectModal(submission.id)}
                              disabled={actionLoading === submission.id}
                              className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50"
                              title="Reject"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        {submission.rejected_at && (
                          <button
                            onClick={() => handleApprove(submission.id)}
                            disabled={actionLoading === submission.id}
                            className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50"
                            title="Approve (restore from rejected)"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleFeatured(submission.id, submission.featured)}
                          disabled={actionLoading === submission.id}
                          className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                            submission.featured
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-surface border border-border text-muted hover:text-yellow-400'
                          }`}
                          title={submission.featured ? 'Remove from featured' : 'Add to featured'}
                        >
                          <Star className="w-5 h-5" />
                        </button>
                        <Link
                          href={`/admin/submissions/${submission.id}`}
                          className="p-2 bg-surface border border-border text-muted rounded-lg hover:text-brand hover:border-brand/50 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(submission.id)}
                          disabled={actionLoading === submission.id}
                          className="p-2 bg-surface border border-border text-muted rounded-lg hover:text-red-400 hover:border-red-500/50 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-muted text-sm mt-3 line-clamp-2">
                      {submission.short_description || submission.description}
                    </p>

                    {/* Alternative Tags Section */}
                    <div className="flex items-center gap-3 mt-3">
                      {submission.alternative_tags && (
                        submission.alternative_tags.alerts?.length > 0 || 
                        submission.alternative_tags.highlights?.length > 0 ||
                        submission.alternative_tags.platforms?.length > 0 ||
                        submission.alternative_tags.properties?.length > 0
                      ) ? (
                        <div className="flex items-center gap-2">
                          <Tags className="w-4 h-4 text-muted" />
                          <AlertHighlightBadges alternativeTags={submission.alternative_tags} maxDisplay={6} />
                          <Link
                            href={`/admin/submissions/${submission.id}`}
                            className="text-xs text-brand hover:underline"
                          >
                            Edit tags
                          </Link>
                        </div>
                      ) : (
                        <Link
                          href={`/admin/submissions/${submission.id}`}
                          className="flex items-center gap-1 text-xs text-muted hover:text-brand transition-colors"
                        >
                          <Tags className="w-3.5 h-3.5" />
                          Add tags
                        </Link>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mt-4 text-sm">
                      {submission.website && (
                        <a
                          href={submission.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-brand hover:underline"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Website
                        </a>
                      )}
                      {submission.github && (
                        <a
                          href={submission.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-muted hover:text-white"
                        >
                          <Github className="w-4 h-4" />
                          GitHub
                        </a>
                      )}
                      {submission.alternative_to?.length > 0 && (
                        <span className="text-muted">
                          Alternative to:{' '}
                          {submission.alternative_to
                            .map(at => at.proprietary_software?.name)
                            .filter(Boolean)
                            .join(', ')}
                        </span>
                      )}
                    </div>

                    {/* Rejection reason */}
                    {submission.rejection_reason && (
                      <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-sm text-red-400 font-mono">
                          <strong>Rejection Reason:</strong> {submission.rejection_reason}
                        </p>
                        {submission.rejected_at && (
                          <p className="text-xs text-red-400/70 mt-1">
                            Rejected on {new Date(submission.rejected_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/70" 
            onClick={() => setRejectModalOpen(false)}
          />
          <div className="relative bg-surface border border-border rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-white font-mono mb-4">
              Reject Submission<span className="text-brand">_</span>
            </h3>
            <p className="text-muted text-sm mb-4">
              Please provide a reason for rejection. This will be visible to the submitter.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g., Missing required information, not open source, duplicate submission..."
              rows={4}
              className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:border-brand resize-none"
            />
            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 text-muted hover:text-white font-mono text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading === rejectingId}
                className="px-4 py-2 bg-red-500 text-white font-mono text-sm rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {actionLoading === rejectingId ? 'Rejecting...' : 'Reject Submission'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
