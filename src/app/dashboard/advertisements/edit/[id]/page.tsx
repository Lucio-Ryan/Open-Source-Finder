'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

export default function EditAdvertisementPage() {
  const router = useRouter();
  const params = useParams();
  const adId = params.id as string;
  const { user, loading: authLoading } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    company_name: '',
    company_website: '',
    company_logo: '',
    headline: '',
    cta_text: 'Learn More',
    destination_url: '',
    icon_url: '',
    short_description: '',
    ad_type: 'banner' as 'banner' | 'card',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/dashboard/advertisements');
      return;
    }

    if (user && adId) {
      fetchAd();
    }
  }, [user, authLoading, adId, router]);

  const fetchAd = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/advertisements/${adId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch advertisement');
      }
      
      const data = await response.json();
      const ad = data.advertisement;
      
      // Check if ad is rejected
      if (ad.status !== 'rejected') {
        setError('Only rejected advertisements can be edited');
        return;
      }
      
      setFormData({
        name: ad.name || '',
        description: ad.description || '',
        company_name: ad.company_name || '',
        company_website: ad.company_website || '',
        company_logo: ad.company_logo || '',
        headline: ad.headline || '',
        cta_text: ad.cta_text || 'Learn More',
        destination_url: ad.destination_url || '',
        icon_url: ad.icon_url || '',
        short_description: ad.short_description || '',
        ad_type: ad.ad_type || 'banner',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load advertisement');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/advertisements/${adId}/resubmit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update advertisement');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted font-mono">Loading advertisement...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-dark">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-surface border border-border rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-brand/10 border border-brand/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-brand" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Resubmitted Successfully!<span className="text-brand">_</span>
            </h1>
            <p className="text-muted font-mono text-sm mb-8">
              Your advertisement has been resubmitted for review. Our team will review it within 24-48 hours.
            </p>
            <Link
              href="/dashboard/advertisements"
              className="px-6 py-3 bg-brand text-dark font-mono text-sm font-medium rounded-lg hover:bg-brand-light transition-all"
            >
              Back to Ad Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error && !formData.name) {
    return (
      <div className="min-h-screen bg-dark">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-surface border border-border rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Error<span className="text-brand">_</span>
            </h1>
            <p className="text-red-400 font-mono text-sm mb-8">{error}</p>
            <Link
              href="/dashboard/advertisements"
              className="px-6 py-3 bg-brand text-dark font-mono text-sm font-medium rounded-lg hover:bg-brand-light transition-all"
            >
              Back to Ad Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-surface/50 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/dashboard/advertisements"
            className="inline-flex items-center text-muted hover:text-brand font-mono text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Advertisements
          </Link>
          <h1 className="text-3xl font-bold text-white">
            Edit & Resubmit<span className="text-brand">_</span>
          </h1>
          <p className="text-muted font-mono text-sm mt-2">
            Make changes to your rejected advertisement and resubmit for review.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span className="font-mono text-sm">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Company Information */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Company Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-mono text-muted mb-2">
                  Company Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:border-brand transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-mono text-muted mb-2">
                  Company Website <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  name="company_website"
                  value={formData.company_website}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:border-brand transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-mono text-muted mb-2">
                  Company Logo URL
                </label>
                <input
                  type="url"
                  name="company_logo"
                  value={formData.company_logo}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:border-brand transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-mono text-muted mb-2">
                  Icon URL
                </label>
                <input
                  type="url"
                  name="icon_url"
                  value={formData.icon_url}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:border-brand transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Ad Content */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Advertisement Content</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-mono text-muted mb-2">
                  Ad Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:border-brand transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-mono text-muted mb-2">
                  Headline
                </label>
                <input
                  type="text"
                  name="headline"
                  value={formData.headline}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:border-brand transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-mono text-muted mb-2">
                  Short Description
                </label>
                <input
                  type="text"
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleChange}
                  maxLength={150}
                  className="w-full px-4 py-2.5 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:border-brand transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-mono text-muted mb-2">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:border-brand transition-colors resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-mono text-muted mb-2">
                    Destination URL <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="url"
                    name="destination_url"
                    value={formData.destination_url}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:border-brand transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-mono text-muted mb-2">
                    CTA Text
                  </label>
                  <input
                    type="text"
                    name="cta_text"
                    value={formData.cta_text}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:border-brand transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-4">
            <Link
              href="/dashboard/advertisements"
              className="px-6 py-3 bg-surface border border-border text-white font-mono text-sm rounded-lg hover:border-brand/50 transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-brand text-dark font-mono text-sm font-medium rounded-lg hover:bg-brand-light transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Resubmit for Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
