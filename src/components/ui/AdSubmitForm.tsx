'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, CheckCircle, AlertCircle, LogIn } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import type { AdType } from '@/types/database';

interface AdSubmitFormProps {
  adType: AdType;
  title: string;
  description: string;
}

export function AdSubmitForm({ adType, title, description }: AdSubmitFormProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
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
    submitter_name: '',
    submitter_email: '',
    start_date: '',
    end_date: '',
  });
  
  // Auto-fill user email if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        submitter_email: user.email || '',
        submitter_name: user.user_metadata?.name || prev.submitter_name,
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      router.push(`/login?redirect=/advertise/${adType}`);
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/advertisements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ad_type: adType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit advertisement');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted font-mono">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Prompt signin if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-dark">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-surface border border-border rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-brand/10 border border-brand/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogIn className="w-8 h-8 text-brand" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Sign In Required<span className="text-brand">_</span>
            </h1>
            <p className="text-muted font-mono text-sm mb-8">
              You need to sign in before submitting an advertisement. This allows you to manage your ads from your dashboard.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={`/login?redirect=/advertise/${adType}`}
                className="px-6 py-3 bg-brand text-dark font-mono text-sm font-medium rounded-lg hover:bg-brand-light transition-all"
              >
                Sign In to Continue
              </Link>
              <Link
                href="/advertise"
                className="px-6 py-3 bg-surface border border-border text-white font-mono text-sm rounded-lg hover:border-brand/50 transition-all"
              >
                Back to Advertise
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    const price = adType === 'banner' ? '$49' : '$99';
    return (
      <div className="min-h-screen bg-dark">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-surface border border-border rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-brand/10 border border-brand/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-brand" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Submission Received!<span className="text-brand">_</span>
            </h1>
            <p className="text-muted font-mono text-sm mb-4">
              Thank you for your advertisement submission. Our team will review it within 24-48 hours.
            </p>
            <p className="text-muted font-mono text-sm mb-8">
              Once approved, you&apos;ll be able to complete payment ({price}) from your Ad Dashboard to go live.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/dashboard/advertisements"
                className="px-6 py-3 bg-brand text-dark font-mono text-sm font-medium rounded-lg hover:bg-brand-light transition-all"
              >
                View Ad Dashboard
              </Link>
              <Link
                href="/"
                className="px-6 py-3 bg-surface border border-border text-white font-mono text-sm rounded-lg hover:border-brand/50 transition-all"
              >
                Go Home
              </Link>
            </div>
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
            href="/advertise"
            className="inline-flex items-center text-muted hover:text-brand font-mono text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            cd ../advertise
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">
            {title}<span className="text-brand">_</span>
          </h1>
          <p className="text-muted font-mono text-sm">{description}</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm font-mono">{error}</p>
            </div>
          )}

          {/* Company Information */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6">
              // Company Information
            </h2>
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
                  placeholder="Your Company"
                  className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50"
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
                  placeholder="https://yourcompany.com"
                  className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-mono text-muted mb-2">
                  Company Logo URL
                </label>
                <input
                  type="url"
                  name="company_logo"
                  value={formData.company_logo}
                  onChange={handleChange}
                  placeholder="https://yourcompany.com/logo.png"
                  className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50"
                />
                <p className="text-xs text-muted/60 font-mono mt-1">
                  Recommended: Square image, at least 100x100px
                </p>
              </div>
            </div>
          </div>

          {/* Advertisement Details */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6">
              // Advertisement Details
            </h2>
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
                  placeholder="Summer Campaign 2024"
                  className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50"
                />
                <p className="text-xs text-muted/60 font-mono mt-1">
                  Internal name for tracking (not displayed publicly)
                </p>
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
                  placeholder="Get 50% off your first month"
                  maxLength={100}
                  className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50"
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
                  rows={3}
                  placeholder="Describe what you're promoting..."
                  className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50 resize-none"
                />
              </div>

              {adType === 'card' && (
                <>
                  <div>
                    <label className="block text-sm font-mono text-muted mb-2">
                      Short Description
                    </label>
                    <input
                      type="text"
                      name="short_description"
                      value={formData.short_description}
                      onChange={handleChange}
                      placeholder="Brief tagline for card display"
                      maxLength={150}
                      className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50"
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
                      placeholder="https://yourcompany.com/icon.png"
                      className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50"
                    />
                    <p className="text-xs text-muted/60 font-mono mt-1">
                      Square icon for the card (56x56px recommended)
                    </p>
                  </div>
                </>
              )}

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
                    placeholder="https://yourcompany.com/landing"
                    className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-mono text-muted mb-2">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    name="cta_text"
                    value={formData.cta_text}
                    onChange={handleChange}
                    placeholder="Learn More"
                    maxLength={30}
                    className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Scheduling (Optional) */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6">
              // Scheduling (Optional)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-mono text-muted mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50"
                />
              </div>
              <div>
                <label className="block text-sm font-mono text-muted mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50"
                />
              </div>
            </div>
            <p className="text-xs text-muted/60 font-mono mt-2">
              Leave blank to run indefinitely after approval
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6">
              // Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-mono text-muted mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="submitter_name"
                  value={formData.submitter_name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50"
                />
              </div>
              <div>
                <label className="block text-sm font-mono text-muted mb-2">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="submitter_email"
                  value={formData.submitter_email}
                  onChange={handleChange}
                  required
                  placeholder="you@company.com"
                  className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted/60 font-mono">
              All fields marked with <span className="text-red-400">*</span> are required
            </p>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-brand text-dark font-mono text-sm font-medium rounded-lg hover:bg-brand-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Advertisement'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
