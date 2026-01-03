'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Save, User, Globe, Github, FileText } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

export default function ProfileSettingsPage() {
  const { user, profile, loading: authLoading, updateProfile } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    website: '',
    github_username: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        bio: profile.bio || '',
        website: profile.website || '',
        github_username: profile.github_username || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const { error } = await updateProfile(formData);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    }

    setSaving(false);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <p className="text-brand font-mono text-sm mb-2">// SETTINGS</p>
          <h1 className="text-3xl font-bold text-white font-mono">
            Profile Settings<span className="text-brand">_</span>
          </h1>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Messages */}
          {message && (
            <div
              className={`p-4 rounded-lg border ${
                message.type === 'success'
                  ? 'bg-green-500/10 border-green-500/20 text-green-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Email (read-only) */}
          <div>
            <label className="block text-gray-300 font-mono text-sm mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={user.email || ''}
              disabled
              className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-gray-500 cursor-not-allowed"
            />
            <p className="text-gray-500 text-sm mt-2">Email cannot be changed</p>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-gray-300 font-mono text-sm mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Display Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your name"
              className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand transition-colors"
              maxLength={100}
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-gray-300 font-mono text-sm mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Bio
            </label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              rows={4}
              className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand transition-colors resize-none"
              maxLength={500}
            />
            <p className="text-gray-500 text-sm mt-1">{formData.bio.length}/500 characters</p>
          </div>

          {/* Website */}
          <div>
            <label htmlFor="website" className="block text-gray-300 font-mono text-sm mb-2">
              <Globe className="w-4 h-4 inline mr-2" />
              Website
            </label>
            <input
              type="url"
              id="website"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://yourwebsite.com"
              className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand transition-colors"
            />
          </div>

          {/* GitHub Username */}
          <div>
            <label htmlFor="github_username" className="block text-gray-300 font-mono text-sm mb-2">
              <Github className="w-4 h-4 inline mr-2" />
              GitHub Username
            </label>
            <div className="flex items-center">
              <span className="px-4 py-3 bg-dark border border-border border-r-0 rounded-l-lg text-gray-500">
                github.com/
              </span>
              <input
                type="text"
                id="github_username"
                value={formData.github_username}
                onChange={(e) => setFormData({ ...formData, github_username: e.target.value })}
                placeholder="username"
                className="flex-1 px-4 py-3 bg-dark border border-border rounded-r-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand transition-colors"
                maxLength={39}
              />
            </div>
          </div>

          {/* Role Badge */}
          {profile && (
            <div>
              <label className="block text-gray-300 font-mono text-sm mb-2">
                Account Role
              </label>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  profile.role === 'admin'
                    ? 'bg-red-500/20 text-red-400'
                    : profile.role === 'moderator'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-brand/20 text-brand'
                }`}
              >
                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
              </span>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-brand text-dark font-mono font-semibold rounded-lg hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>

        {/* Account Info */}
        <div className="mt-12 pt-8 border-t border-border">
          <h2 className="text-xl font-bold text-white font-mono mb-4">
            Account Information
          </h2>
          <div className="space-y-2 text-gray-400">
            <p>
              <span className="text-gray-500">Account ID:</span>{' '}
              <code className="text-xs bg-surface px-2 py-1 rounded">{user.id}</code>
            </p>
            {profile && (
              <>
                <p>
                  <span className="text-gray-500">Member since:</span>{' '}
                  {new Date(profile.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p>
                  <span className="text-gray-500">Last updated:</span>{' '}
                  {new Date(profile.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
