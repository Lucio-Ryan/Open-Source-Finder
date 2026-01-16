'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Save, Loader2, Upload, X, Terminal, CheckCircle, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { RichTextEditor, TechStackSelector, CreatorProfileCard } from '@/components/ui';
import type { CreatorProfile } from '@/lib/mongodb/queries';

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

interface TechStack {
  id: string;
  name: string;
  slug: string;
  type: string;
}

export default function EditAlternativePage({ params }: { params: { id: string } }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [proprietarySoftware, setProprietarySoftware] = useState<ProprietarySoftware[]>([]);
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([]);
  const [rejectionInfo, setRejectionInfo] = useState<{ reason: string | null; rejected_at: string | null } | null>(null);
  const [showCreatorPreview, setShowCreatorPreview] = useState(true);
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const screenshotInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    github: '',
    short_description: '',
    description: '',
    long_description: '',
    icon_url: '',
    license: '',
    is_self_hosted: false,
    category_ids: [] as string[],
    alternative_to_ids: [] as string[],
    tech_stack_ids: [] as string[],
    screenshots: [] as string[],
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchData() {
      if (!user?.email) return;

      try {
        // Fetch the alternative via API
        const altResponse = await fetch(`/api/alternatives/${params.id}`);
        const altResult = await altResponse.json();
        
        if (!altResponse.ok || !altResult.alternative) {
          setError('Alternative not found or you do not have permission to edit it.');
          setLoading(false);
          return;
        }
        
        const alternative = altResult.alternative;

        // Check if this was a rejected submission
        if (alternative.rejected_at) {
          setRejectionInfo({
            reason: alternative.rejection_reason,
            rejected_at: alternative.rejected_at,
          });
        }

        // Set form data
        setFormData({
          name: alternative.name || '',
          website: alternative.website || '',
          github: alternative.github || '',
          short_description: alternative.short_description || '',
          description: alternative.description || '',
          long_description: alternative.long_description || '',
          icon_url: alternative.icon_url || '',
          license: alternative.license || '',
          is_self_hosted: alternative.is_self_hosted || false,
          category_ids: alternative.categories?.map((c: any) => c.id) || [],
          alternative_to_ids: alternative.alternative_to?.map((a: any) => a.id) || [],
          tech_stack_ids: alternative.tech_stacks?.map((t: any) => t.id) || [],
          screenshots: alternative.screenshots || [],
        });

        if (alternative.icon_url) {
          setIconPreview(alternative.icon_url);
        }
        if (alternative.screenshots?.length) {
          setScreenshotPreviews(alternative.screenshots);
        }

        // Fetch categories, proprietary software, and tech stacks
        const [catRes, propRes, techRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/proprietary'),
          fetch('/api/tech-stacks'),
        ]);
        
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData.categories || []);
        }
        
        if (propRes.ok) {
          const propData = await propRes.json();
          setProprietarySoftware(propData.software || []);
        }

        if (techRes.ok) {
          const techData = await techRes.json();
          setTechStacks(techData.techStacks || []);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load alternative data.');
      } finally {
        setLoading(false);
      }
    }
    
    if (user) {
      fetchData();
      
      // Fetch creator profile
      const fetchCreatorProfile = async () => {
        try {
          const res = await fetch('/api/profile');
          if (res.ok) {
            const data = await res.json();
            setCreatorProfile(data);
          }
        } catch (err) {
          console.error('Failed to fetch creator profile:', err);
        } finally {
          setLoadingProfile(false);
        }
      };
      
      fetchCreatorProfile();
    } else {
      setLoadingProfile(false);
    }
  }, [user, params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/alternatives/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save changes');
      }

      setSuccess(true);
      setRejectionInfo(null); // Clear rejection banner after successful save (resubmission)
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      category_ids: prev.category_ids.includes(categoryId)
        ? prev.category_ids.filter((c) => c !== categoryId)
        : [...prev.category_ids, categoryId],
    }));
  };

  const handleAlternativeToChange = (softwareId: string) => {
    setFormData((prev) => ({
      ...prev,
      alternative_to_ids: prev.alternative_to_ids.includes(softwareId)
        ? prev.alternative_to_ids.filter((s) => s !== softwareId)
        : [...prev.alternative_to_ids, softwareId],
    }));
  };

  const handleTechStackChange = (ids: string[]) => {
    setFormData((prev) => ({
      ...prev,
      tech_stack_ids: ids,
    }));
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setIconPreview(result);
        setFormData(prev => ({ ...prev, icon_url: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeIcon = () => {
    setIconPreview(null);
    setFormData(prev => ({ ...prev, icon_url: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const remainingSlots = 3 - screenshotPreviews.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);
      
      filesToProcess.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setScreenshotPreviews(prev => [...prev, result]);
          setFormData(prev => ({ ...prev, screenshots: [...prev.screenshots, result] }));
        };
        reader.readAsDataURL(file);
      });
    }
    if (screenshotInputRef.current) {
      screenshotInputRef.current.value = '';
    }
  };

  const removeScreenshot = (index: number) => {
    setScreenshotPreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({ ...prev, screenshots: prev.screenshots.filter((_, i) => i !== index) }));
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  if (error && !formData.name) {
    return (
      <div className="min-h-screen bg-dark">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center">
            <p className="text-red-400 font-mono mb-4">{error}</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-brand hover:text-brand-light font-mono"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-muted hover:text-brand mb-4 font-mono"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            cd ../dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">
            Edit Project<span className="text-brand">_</span>
          </h1>
          <p className="text-muted">
            Update the details for <span className="text-white font-medium">{formData.name}</span>
          </p>
        </div>
      </div>

      {/* Success Banner */}
      {success && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-brand/10 border border-brand/30 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-brand" />
            <p className="text-brand font-mono text-sm">Changes saved successfully! Your submission has been resubmitted for review.</p>
          </div>
        </div>
      )}

      {/* Rejection Banner */}
      {rejectionInfo && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-400 font-mono text-sm font-semibold mb-1">Submission Rejected</h3>
                {rejectionInfo.reason && (
                  <p className="text-red-300/80 text-sm mb-2">{rejectionInfo.reason}</p>
                )}
                <p className="text-muted text-sm">
                  Please address the issues mentioned above and save your changes to resubmit for review.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold text-white mb-6 font-mono">
              <Terminal className="w-5 h-5 inline mr-2 text-brand" />
              // BASIC_INFO
            </h2>

            {/* Creator Card Toggle */}
            <div className="flex items-center justify-between bg-dark rounded-lg border border-border p-3 mb-6">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreatorPreview(!showCreatorPreview)}
                  className="p-1 hover:bg-surface rounded transition-colors"
                  aria-label="Toggle creator preview"
                >
                  {showCreatorPreview ? (
                    <Eye className="w-4 h-4 text-brand" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-muted" />
                  )}
                </button>
                <span className="text-xs text-muted">
                  {showCreatorPreview ? "Showing" : "Hiding"} creator card
                </span>
              </div>
              <Link
                href="/dashboard/settings"
                className="text-xs text-brand hover:underline font-medium"
              >
                Customize
              </Link>
            </div>
            
            <div className="space-y-6">
              {/* Icon Upload */}
              <div>
                <label className="block text-sm font-medium font-mono text-muted mb-2">
                  project_icon <span className="text-muted/70">(optional)</span>
                </label>
                <div className="flex items-start gap-4">
                  {iconPreview ? (
                    <div className="relative">
                      <Image
                        src={iconPreview}
                        alt="Icon preview"
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-xl object-cover border border-border"
                      />
                      <button
                        type="button"
                        onClick={removeIcon}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-brand/10 rounded-xl flex items-center justify-center text-brand font-bold text-2xl font-mono border border-dashed border-brand/30">
                      {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleIconChange}
                      className="hidden"
                      id="icon-upload"
                    />
                    <label
                      htmlFor="icon-upload"
                      className="inline-flex items-center px-4 py-2 bg-dark border border-border rounded-lg text-muted hover:text-white hover:border-brand/50 transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Icon
                    </label>
                    <p className="text-xs text-muted mt-2">
                      Recommended: 128x128px, PNG or SVG
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium font-mono text-muted mb-2">
                  project_name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-transparent"
                  placeholder="e.g., Nextcloud"
                />
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium font-mono text-muted mb-2">
                  website_url *
                </label>
                <input
                  type="url"
                  id="website"
                  required
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label htmlFor="github" className="block text-sm font-medium font-mono text-muted mb-2">
                  github_repo *
                </label>
                <input
                  type="url"
                  id="github"
                  required
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-transparent"
                  placeholder="https://github.com/owner/repo"
                />
              </div>

              {/* Screenshots Upload */}
              <div>
                <label className="block text-sm font-medium font-mono text-muted mb-2">
                  screenshots <span className="text-muted/70">(optional, up to 3 images)</span>
                </label>
                <p className="text-xs text-muted mb-3">
                  Upload up to 3 screenshots in 16:9 ratio to showcase your project.
                </p>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {screenshotPreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-video">
                      <Image
                        src={preview}
                        alt={`Screenshot ${index + 1}`}
                        fill
                        className="rounded-lg object-cover border border-border"
                      />
                      <button
                        type="button"
                        onClick={() => removeScreenshot(index)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {screenshotPreviews.length < 3 && (
                    <label
                      htmlFor="screenshot-upload"
                      className="aspect-video flex flex-col items-center justify-center bg-dark border border-dashed border-brand/30 rounded-lg text-muted hover:text-brand hover:border-brand/50 transition-colors cursor-pointer"
                    >
                      <Upload className="w-6 h-6 mb-2" />
                      <span className="text-xs">Add Screenshot</span>
                    </label>
                  )}
                </div>
                <input
                  type="file"
                  ref={screenshotInputRef}
                  accept="image/*"
                  multiple
                  onChange={handleScreenshotChange}
                  className="hidden"
                  id="screenshot-upload"
                />
              </div>

              <div>
                <label htmlFor="short_description" className="block text-sm font-medium font-mono text-muted mb-2">
                  short_description * <span className="text-muted/70">(shown below name)</span>
                </label>
                <p className="text-xs text-muted mb-2">
                  A brief summary shown below the project name (max 200 characters).
                </p>
                <textarea
                  id="short_description"
                  required
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  maxLength={200}
                  rows={2}
                  className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-transparent resize-none"
                  placeholder="A brief one-line description of what the project does..."
                />
                <p className="text-xs text-muted mt-1 text-right">
                  {formData.short_description.length}/200
                </p>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium font-mono text-muted mb-2">
                  about * <span className="text-muted/70">(detailed description)</span>
                </label>
                <p className="text-xs text-muted mb-2">
                  Detailed description for the About section. Supports bold, italic, links, and inline code only.
                </p>
                <RichTextEditor
                  content={formData.description}
                  onChange={(html) => setFormData({ ...formData, description: html })}
                  placeholder="Describe what the project does and what makes it a good alternative. You can use formatting like bold, italic, and links..."
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold text-white mb-2 font-mono">
              <Terminal className="w-5 h-5 inline mr-2 text-brand" />
              // CATEGORIES
            </h2>
            <p className="text-sm text-muted mb-4">
              Select one or more categories that best describe this project.
            </p>
            
            <div className="max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                    formData.category_ids.includes(category.id)
                      ? 'border-brand bg-brand/10'
                      : 'border-border hover:border-border-light'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.category_ids.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                    className="sr-only"
                  />
                  <span className={`text-sm font-medium ${
                    formData.category_ids.includes(category.id)
                      ? 'text-brand'
                      : 'text-muted'
                  }`}>
                    {category.name}
                  </span>
                </label>
              ))}
              </div>
            </div>
          </div>

          {/* Alternative To */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold text-white mb-2 font-mono">
              <Terminal className="w-5 h-5 inline mr-2 text-brand" />
              // ALTERNATIVE_TO
            </h2>
            <p className="text-sm text-muted mb-4">
              Select which proprietary software this is an alternative to.
            </p>
            
            <div className="max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {proprietarySoftware.map((software) => (
                <label
                  key={software.id}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                    formData.alternative_to_ids.includes(software.id)
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-border hover:border-border-light'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.alternative_to_ids.includes(software.id)}
                    onChange={() => handleAlternativeToChange(software.id)}
                    className="sr-only"
                  />
                  <span className={`text-sm font-medium ${
                    formData.alternative_to_ids.includes(software.id)
                      ? 'text-orange-400'
                      : 'text-muted'
                  }`}>
                    {software.name}
                  </span>
                </label>
              ))}
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold text-white mb-2 font-mono">
              <Terminal className="w-5 h-5 inline mr-2 text-brand" />
              // TECH_STACK
            </h2>
            <p className="text-sm text-muted mb-4">
              What technologies is this project built with? Search and select from the list.
            </p>
            
            <TechStackSelector
              selectedIds={formData.tech_stack_ids}
              onChange={handleTechStackChange}
              techStacks={techStacks}
            />
          </div>

          {/* Options */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold text-white mb-6 font-mono">
              <Terminal className="w-5 h-5 inline mr-2 text-brand" />
              // OPTIONS
            </h2>
            
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_self_hosted}
                  onChange={(e) => setFormData({ ...formData, is_self_hosted: e.target.checked })}
                  className="w-5 h-5 rounded border-border bg-dark text-brand focus:ring-brand/50"
                />
                <span className="text-muted">Can be self-hosted</span>
              </label>

              <div>
                <label htmlFor="license" className="block text-sm font-medium font-mono text-muted mb-2">
                  license
                </label>
                <input
                  type="text"
                  id="license"
                  value={formData.license}
                  onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                  className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-transparent"
                  placeholder="e.g., MIT, Apache-2.0, GPL-3.0"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-400 font-mono text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="px-6 py-4 text-muted hover:text-white font-mono transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center px-6 py-4 bg-brand text-dark font-medium font-mono rounded-lg hover:bg-brand-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes<span className="text-dark">_</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
