'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Loader2, Save, User, Globe, Github, FileText, Camera, X, Twitter, Linkedin, Youtube, MessageCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { BioEditor } from '@/components/ui';

export default function ProfileSettingsPage() {
  const { user, profile, loading: authLoading, updateProfile } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    website: '',
    github_username: '',
    twitter_username: '',
    linkedin_url: '',
    youtube_url: '',
    discord_username: '',
    avatar_url: '',
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
        twitter_username: profile.twitter_username || '',
        linkedin_url: profile.linkedin_url || '',
        youtube_url: profile.youtube_url || '',
        discord_username: profile.discord_username || '',
        avatar_url: profile.avatar_url || '',
      });
    }
  }, [profile]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file' });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be less than 2MB' });
      return;
    }

    setUploadingAvatar(true);
    setMessage(null);

    try {
      // Convert to base64 for simple storage (alternatively use Supabase Storage)
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData({ ...formData, avatar_url: base64 });
        setUploadingAvatar(false);
      };
      reader.onerror = () => {
        setMessage({ type: 'error', text: 'Failed to read image file' });
        setUploadingAvatar(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload image' });
      setUploadingAvatar(false);
    }
  };

  const removeAvatar = () => {
    setFormData({ ...formData, avatar_url: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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

          {/* Profile Picture */}
          <div>
            <label className="block text-gray-300 font-mono text-sm mb-2">
              <Camera className="w-4 h-4 inline mr-2" />
              Profile Picture
            </label>
            <p className="text-gray-500 text-sm mb-4">This will be shown on your creator profile for alternatives you submit.</p>
            <div className="flex items-center gap-6">
              {formData.avatar_url ? (
                <div className="relative">
                  <Image
                    src={formData.avatar_url}
                    alt="Profile picture"
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover border-2 border-brand/30"
                  />
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 bg-surface border-2 border-dashed border-border rounded-full flex items-center justify-center text-gray-500">
                  <User className="w-10 h-10" />
                </div>
              )}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg cursor-pointer hover:border-brand transition-colors ${
                    uploadingAvatar ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploadingAvatar ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4" />
                      {formData.avatar_url ? 'Change Picture' : 'Upload Picture'}
                    </>
                  )}
                </label>
                <p className="text-gray-500 text-xs mt-2">JPG, PNG or GIF. Max 2MB.</p>
              </div>
            </div>
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
            <BioEditor
              content={formData.bio}
              onChange={(html) => setFormData({ ...formData, bio: html })}
              placeholder="Tell us about yourself..."
              maxLength={500}
            />
            <p className="text-gray-500 text-sm mt-2">Use bold, italic, and links to format your bio.</p>
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

          {/* Social Links Section */}
          <div className="pt-6 border-t border-border">
            <h3 className="text-lg font-mono text-brand mb-6">// social_links</h3>
            
            {/* Twitter/X */}
            <div className="mb-6">
              <label htmlFor="twitter_username" className="block text-gray-300 font-mono text-sm mb-2">
                <Twitter className="w-4 h-4 inline mr-2" />
                Twitter / X
              </label>
              <div className="flex items-center">
                <span className="px-4 py-3 bg-dark border border-border border-r-0 rounded-l-lg text-gray-500">
                  x.com/
                </span>
                <input
                  type="text"
                  id="twitter_username"
                  value={formData.twitter_username}
                  onChange={(e) => setFormData({ ...formData, twitter_username: e.target.value })}
                  placeholder="username"
                  className="flex-1 px-4 py-3 bg-dark border border-border rounded-r-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand transition-colors"
                  maxLength={15}
                />
              </div>
            </div>

            {/* LinkedIn */}
            <div className="mb-6">
              <label htmlFor="linkedin_url" className="block text-gray-300 font-mono text-sm mb-2">
                <Linkedin className="w-4 h-4 inline mr-2" />
                LinkedIn
              </label>
              <input
                type="url"
                id="linkedin_url"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand transition-colors"
              />
            </div>

            {/* YouTube */}
            <div className="mb-6">
              <label htmlFor="youtube_url" className="block text-gray-300 font-mono text-sm mb-2">
                <Youtube className="w-4 h-4 inline mr-2" />
                YouTube Channel
              </label>
              <input
                type="url"
                id="youtube_url"
                value={formData.youtube_url}
                onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                placeholder="https://youtube.com/@yourchannel"
                className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand transition-colors"
              />
            </div>

            {/* Discord */}
            <div>
              <label htmlFor="discord_username" className="block text-gray-300 font-mono text-sm mb-2">
                <MessageCircle className="w-4 h-4 inline mr-2" />
                Discord Username
              </label>
              <input
                type="text"
                id="discord_username"
                value={formData.discord_username}
                onChange={(e) => setFormData({ ...formData, discord_username: e.target.value })}
                placeholder="username"
                className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand transition-colors"
                maxLength={32}
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

        {/* Creator Profile Preview */}
        <div className="mt-12 pt-8 border-t border-border">
          <h2 className="text-xl font-bold text-white font-mono mb-2">
            Creator Profile Preview<span className="text-brand">_</span>
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            This is how your profile will appear on alternatives pages you submit.
          </p>
          
          <div className="bg-surface rounded-xl border border-border p-6 max-w-sm">
            <h3 className="text-lg font-mono text-brand mb-6">// creator</h3>
            
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-start gap-4">
                {formData.avatar_url ? (
                  <Image
                    src={formData.avatar_url}
                    alt="Profile picture"
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover border-2 border-brand/20"
                  />
                ) : (
                  <div className="w-16 h-16 bg-brand/10 border-2 border-brand/20 rounded-full flex items-center justify-center text-brand font-bold text-xl">
                    {(formData.name || user?.email?.split('@')[0] || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-white truncate">
                    {formData.name || user?.email?.split('@')[0] || 'Anonymous'}
                  </h4>
                  {formData.bio && (
                    <p className="text-sm text-muted mt-1 line-clamp-2">
                      {formData.bio}
                    </p>
                  )}
                </div>
              </div>

              {/* Links */}
              {(formData.website || formData.github_username || formData.twitter_username || formData.linkedin_url || formData.youtube_url || formData.discord_username) && (
                <div className="space-y-2">
                  {formData.website && (
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <Globe className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">
                        {formData.website.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                      </span>
                    </div>
                  )}
                  
                  {formData.github_username && (
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <Github className="w-4 h-4 flex-shrink-0" />
                      <span>@{formData.github_username}</span>
                    </div>
                  )}

                  {formData.twitter_username && (
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <Twitter className="w-4 h-4 flex-shrink-0" />
                      <span>@{formData.twitter_username}</span>
                    </div>
                  )}

                  {formData.linkedin_url && (
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <Linkedin className="w-4 h-4 flex-shrink-0" />
                      <span>LinkedIn</span>
                    </div>
                  )}

                  {formData.youtube_url && (
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <Youtube className="w-4 h-4 flex-shrink-0" />
                      <span>YouTube</span>
                    </div>
                  )}

                  {formData.discord_username && (
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <MessageCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Discord: {formData.discord_username}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Empty State */}
              {!formData.website && !formData.github_username && !formData.twitter_username && !formData.linkedin_url && !formData.youtube_url && !formData.discord_username && !formData.bio && (
                <p className="text-gray-500 text-sm italic">
                  Add more details above to enhance your creator profile.
                </p>
              )}
            </div>
          </div>
        </div>

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
