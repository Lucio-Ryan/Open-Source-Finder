'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Loader2, 
  Save,
  ExternalLink,
  Github,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { AlternativeTagsSelector } from '@/components/ui/AlternativeTagsSelector';
import { AlertHighlightBadges } from '@/components/ui/AlternativeTagsBadges';
import type { AlternativeTagsData } from '@/data/alternative-tags';

interface Submission {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string | null;
  long_description: string | null;
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
  submitter_email: string | null;
  alternative_tags: AlternativeTagsData;
  created_at: string;
  categories: { id: string; name: string; slug: string }[];
  alternative_to: { id: string; name: string; slug: string }[];
}

const emptyTags: AlternativeTagsData = {
  alerts: [],
  highlights: [],
  platforms: [],
  properties: [],
};

export default function AdminSubmissionEditPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const submissionId = params.id as string;
  
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Form state
  const [alternativeTags, setAlternativeTags] = useState<AlternativeTagsData>(emptyTags);
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || profile?.role !== 'admin')) {
      router.push('/admin');
    }
  }, [user, profile, authLoading, router]);

  useEffect(() => {
    const fetchSubmission = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/submissions?status=all`);
        if (response.ok) {
          const data = await response.json();
          const found = data.submissions?.find((s: Submission) => s.id === submissionId);
          if (found) {
            setSubmission(found);
            setAlternativeTags(found.alternative_tags || emptyTags);
            setFeatured(found.featured);
          } else {
            setError('Submission not found');
          }
        } else {
          setError('Failed to fetch submission');
        }
      } catch (error) {
        console.error('Failed to fetch submission:', error);
        setError('Failed to fetch submission');
      } finally {
        setLoading(false);
      }
    };

    if (profile?.role === 'admin' && submissionId) {
      fetchSubmission();
    }
  }, [profile, submissionId]);

  const handleSave = async () => {
    if (!submission) return;
    
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await fetch('/api/admin/submissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: submission.id,
          alternative_tags: alternativeTags,
          featured,
        }),
      });

      if (response.ok) {
        setSuccessMessage('Changes saved successfully!');
        setSubmission(prev => prev ? { 
          ...prev, 
          alternative_tags: alternativeTags,
          featured,
        } : null);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save changes');
      }
    } catch (error) {
      console.error('Failed to save:', error);
      setError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async () => {
    if (!submission) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/admin/submissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: submission.id, 
          action: 'approve',
          alternative_tags: alternativeTags,
          featured,
        }),
      });

      if (response.ok) {
        setSubmission(prev => prev ? { ...prev, approved: true, rejection_reason: null, rejected_at: null } : null);
        setSuccessMessage('Submission approved!');
      }
    } catch (error) {
      console.error('Failed to approve:', error);
      setError('Failed to approve submission');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user || !profile || profile.role !== 'admin') {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  if (error && !submission) {
    return (
      <div className="min-h-screen bg-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/admin/submissions"
            className="inline-flex items-center text-muted hover:text-brand font-mono text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Submissions
          </Link>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!submission) return null;

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/admin/submissions"
            className="inline-flex items-center text-muted hover:text-brand font-mono text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Submissions
          </Link>
          
          <div className="flex items-start gap-4">
            {submission.icon_url ? (
              <Image
                src={submission.icon_url}
                alt={submission.name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-brand/10 rounded-lg flex items-center justify-center text-brand font-bold text-2xl">
                {submission.name.charAt(0)}
              </div>
            )}
            
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white font-mono">
                  {submission.name}<span className="text-brand">_</span>
                </h1>
                {submission.approved ? (
                  <span className="flex items-center gap-1 text-sm text-brand">
                    <CheckCircle className="w-4 h-4" /> Approved
                  </span>
                ) : submission.rejected_at ? (
                  <span className="flex items-center gap-1 text-sm text-red-400">
                    <XCircle className="w-4 h-4" /> Rejected
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-sm text-yellow-400">
                    Pending
                  </span>
                )}
              </div>
              
              <p className="text-muted text-sm mt-1">
                {submission.short_description || submission.description.slice(0, 150)}
              </p>
              
              <div className="flex items-center gap-4 mt-3 text-sm">
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
              </div>
            </div>
            
            {/* Current tags preview */}
            <div className="flex-shrink-0">
              <AlertHighlightBadges alternativeTags={alternativeTags} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm">{successMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Tags Selector */}
          <div className="lg:col-span-2">
            <div className="bg-surface border border-border rounded-xl p-6">
              <AlternativeTagsSelector
                value={alternativeTags}
                onChange={setAlternativeTags}
                disabled={saving}
              />
            </div>
          </div>

          {/* Sidebar - Info & Actions */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-sm font-mono text-brand mb-4">// quick_info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted">Categories:</span>
                  <span className="text-white">
                    {submission.categories?.map(c => c.name).join(', ') || 'None'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Alternative to:</span>
                  <span className="text-white">
                    {submission.alternative_to?.map(a => a.name).join(', ') || 'None'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">License:</span>
                  <span className="text-white">{submission.license || 'Unknown'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Self-hosted:</span>
                  <span className="text-white">{submission.is_self_hosted ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Submitted:</span>
                  <span className="text-white">
                    {new Date(submission.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-sm font-mono text-brand mb-4">// options</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  disabled={saving}
                  className="w-4 h-4 rounded border-border bg-dark text-brand focus:ring-brand focus:ring-offset-dark"
                />
                <span className="text-sm text-white">Featured alternative</span>
              </label>
            </div>

            {/* Actions */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-sm font-mono text-brand mb-4">// actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand text-dark font-mono font-medium text-sm rounded-lg hover:bg-brand-light transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Changes
                </button>
                
                {!submission.approved && (
                  <button
                    onClick={handleApprove}
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500/20 text-green-400 font-mono font-medium text-sm rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve with Tags
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
