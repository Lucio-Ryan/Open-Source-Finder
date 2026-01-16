'use client';

import { useState, useEffect, useRef } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Send, CheckCircle, Terminal, Loader2, Upload, X, Crown, Sparkles, Eye, EyeOff } from 'lucide-react';
import { RichTextEditor, TechStackSelector, PlanSelection, BacklinkVerification, CreatorProfileCard, type SubmissionPlan } from '@/components/ui';
import { useAuth } from '@/lib/auth/AuthContext';
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

export default function SubmitPage() {
  const { user } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [proprietarySoftware, setProprietarySoftware] = useState<ProprietarySoftware[]>([]);
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreatorPreview, setShowCreatorPreview] = useState(true);
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  
  // Search states
  const [categorySearch, setCategorySearch] = useState('');
  const [alternativeToSearch, setAlternativeToSearch] = useState('');
  
  // Plan selection state
  const [selectedPlan, setSelectedPlan] = useState<SubmissionPlan>('free');
  const [backlinkVerified, setBacklinkVerified] = useState(false);
  const [backlinkUrl, setBacklinkUrl] = useState<string | undefined>();
  const [sponsorPaymentId, setSponsorPaymentId] = useState<string | null>(null);
  
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([]);
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
    tag_ids: [] as string[],
    tech_stack_ids: [] as string[],
    submitter_name: '',
    submitter_email: '',
    screenshots: [] as string[],
  });
  
  // Filter categories and proprietary software based on search
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );
  
  const filteredProprietarySoftware = proprietarySoftware.filter(soft =>
    soft.name.toLowerCase().includes(alternativeToSearch.toLowerCase())
  );

  // Auto-fill user email if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        submitter_email: user.email || '',
        submitter_name: user.user_metadata?.name || prev.submitter_name,
      }));
      
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
  }, [user]);

  // Fetch categories and proprietary software on mount
  useEffect(() => {
    async function fetchData() {
      try {
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
        console.error('Error fetching form data:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Plan-specific validation
    if (selectedPlan === 'free' && !backlinkVerified) {
      setError('Please verify your backlink before submitting. Add the Open Source Finder badge to your README and click "Verify Backlink".');
      setIsSubmitting(false);
      return;
    }

    if (selectedPlan === 'sponsor' && !sponsorPaymentId) {
      setError('Please complete the payment to submit with the Sponsor plan.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          submission_plan: selectedPlan,
          backlink_verified: backlinkVerified,
          backlink_url: backlinkUrl,
          sponsor_payment_id: sponsorPaymentId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Show detailed error if available
        let errorMessage = result.error || 'Submission failed';
        if (result.debug?.hint) {
          errorMessage += ` (Hint: ${result.debug.hint})`;
        }
        if (result.debug?.message && result.debug.message !== result.error) {
          errorMessage += ` - ${result.debug.message}`;
        }
        throw new Error(errorMessage);
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData((prev) => {
      // If already selected, allow removal
      if (prev.category_ids.includes(categoryId)) {
        return { ...prev, category_ids: prev.category_ids.filter((c) => c !== categoryId) };
      }
      // Only add if under limit of 3
      if (prev.category_ids.length >= 3) {
        return prev;
      }
      return { ...prev, category_ids: [...prev.category_ids, categoryId] };
    });
  };

  const handleAlternativeToChange = (softwareId: string) => {
    setFormData((prev) => {
      // If already selected, allow removal
      if (prev.alternative_to_ids.includes(softwareId)) {
        return { ...prev, alternative_to_ids: prev.alternative_to_ids.filter((s) => s !== softwareId) };
      }
      // Only allow 1 alternative to selection
      if (prev.alternative_to_ids.length >= 1) {
        return prev;
      }
      return { ...prev, alternative_to_ids: [...prev.alternative_to_ids, softwareId] };
    });
  };

  const handleTechStackChange = (ids: string[]) => {
    // Limit to 10 tech stacks
    const limitedIds = ids.slice(0, 10);
    setFormData((prev) => ({
      ...prev,
      tech_stack_ids: limitedIds,
    }));
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For now, we'll use a data URL. In production, you'd upload to Supabase Storage
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

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className={`w-16 h-16 ${selectedPlan === 'sponsor' ? 'bg-emerald-500/10' : 'bg-brand/10'} rounded-full flex items-center justify-center mx-auto mb-6`}>
            {selectedPlan === 'sponsor' ? (
              <Crown className="w-8 h-8 text-emerald-500" />
            ) : (
              <CheckCircle className="w-8 h-8 text-brand" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-white mb-4 font-mono">
            {selectedPlan === 'sponsor' ? (
              <>🎉 You&apos;re Live!</>
            ) : (
              <>submission_confirmed<span className="text-brand">_</span></>
            )}
          </h1>
          
          {selectedPlan === 'sponsor' ? (
            <div className="space-y-4 mb-6">
              <p className="text-muted">
                Your project is now live and featured on Open Source Finder!
              </p>
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 text-left">
                <h3 className="text-emerald-500 font-semibold mb-2 text-sm">Your Sponsor Benefits:</h3>
                <ul className="text-sm text-muted space-y-2">
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    Featured on homepage for 7 days
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    Verified sponsor badge ✓
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    SEO dofollow links
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    Premium full-width card with screenshots
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    Included in weekly newsletter
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    Unlimited updates anytime
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-muted mb-6">
              We&apos;ve received your submission and will review it within approximately 1 week. 
              You&apos;ll receive an email once it&apos;s been approved.
            </p>
          )}
          
          <Link
            href="/"
            className={`inline-flex items-center px-6 py-3 ${selectedPlan === 'sponsor' ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-brand hover:bg-brand-light'} text-dark font-medium font-mono rounded-lg transition-colors`}
          >
            <Terminal className="w-4 h-4 mr-2" />
            cd ../home
          </Link>
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
            href="/"
            className="inline-flex items-center text-muted hover:text-brand mb-4 font-mono"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            cd ../home
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">
            Submit a Project<span className="text-brand">_</span>
          </h1>
          <p className="text-muted">
            Know a great open source alternative? Help the community by submitting it here.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Info - Now at the top */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold text-white mb-2 font-mono">
              <Terminal className="w-5 h-5 inline mr-2 text-brand" />
              // PERSONAL_INFO
            </h2>
            <p className="text-sm text-muted mb-6">
              Let us know who&apos;s submitting this project (optional but appreciated).
            </p>

            {/* Creator Card Toggle */}
            <div className="flex items-center justify-between bg-dark rounded-lg border border-border p-3 mb-6">
              <div className="flex items-center gap-2">
                {user ? (
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
                ) : (
                  <EyeOff className="w-4 h-4 text-muted" />
                )}
                <span className="text-xs text-muted">
                  {user 
                    ? (showCreatorPreview ? "Showing" : "Hiding") + " creator card"
                    : "Hiding creator card"
                  }
                </span>
              </div>
              {user ? (
                <Link
                  href="/dashboard/settings"
                  className="text-xs text-brand hover:underline font-medium"
                >
                  Customize
                </Link>
              ) : (
                <Link
                  href="/login?redirect=/submit&message=signin_required_for_creator_card"
                  className="text-xs text-brand hover:underline font-medium"
                >
                  Sign in to customize
                </Link>
              )}
            </div>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="submitter_name" className="block text-sm font-medium font-mono text-muted mb-2">
                  your_name
                </label>
                <input
                  type="text"
                  id="submitter_name"
                  value={formData.submitter_name}
                  onChange={(e) => setFormData({ ...formData, submitter_name: e.target.value })}
                  className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-transparent"
                  placeholder="e.g., John Doe"
                />
              </div>

              <div>
                <label htmlFor="submitter_email" className="block text-sm font-medium font-mono text-muted mb-2">
                  your_email
                </label>
                <input
                  type="email"
                  id="submitter_email"
                  value={formData.submitter_email}
                  onChange={(e) => setFormData({ ...formData, submitter_email: e.target.value })}
                  className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-transparent"
                  placeholder="e.g., john@example.com"
                />
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold text-white mb-6 font-mono">
              <Terminal className="w-5 h-5 inline mr-2 text-brand" />
              // BASIC_INFO
            </h2>
            
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
                  Detailed description for the About section. Supports bold, italic, links, and inline code only. Max 2000 characters.
                </p>
                <RichTextEditor
                  content={formData.description}
                  onChange={(html) => setFormData({ ...formData, description: html })}
                  placeholder="Describe what the project does and what makes it a good alternative. You can use formatting like bold, italic, and links..."
                  maxLength={2000}
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
              Select up to 3 categories that best describe this project.
              <span className={`ml-2 font-mono ${formData.category_ids.length >= 3 ? 'text-orange-400' : 'text-brand'}`}>
                ({formData.category_ids.length}/3)
              </span>
            </p>
            
            <input
              type="text"
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full px-4 py-2 mb-4 bg-dark border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-transparent font-mono text-sm"
            />
            
            <div className="max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {filteredCategories.map((category) => (
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
              <span className={`ml-2 font-mono ${formData.alternative_to_ids.length >= 1 ? 'text-orange-400' : 'text-brand'}`}>
                ({formData.alternative_to_ids.length}/1)
              </span>
            </p>
            
            <input
              type="text"
              value={alternativeToSearch}
              onChange={(e) => setAlternativeToSearch(e.target.value)}
              placeholder="Search proprietary software..."
              className="w-full px-4 py-2 mb-4 bg-dark border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-transparent font-mono text-sm"
            />
            
            <div className="max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {filteredProprietarySoftware.map((software) => (
                <label
                  key={software.id}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                    formData.alternative_to_ids.includes(software.id)
                      ? 'border-emerald-500 bg-emerald-500/10'
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
                      ? 'text-emerald-400'
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
              What technologies is this project built with? Select up to 10.
              <span className={`ml-2 font-mono ${formData.tech_stack_ids.length >= 10 ? 'text-orange-400' : 'text-brand'}`}>
                ({formData.tech_stack_ids.length}/10)
              </span>
            </p>
            
            <TechStackSelector
              selectedIds={formData.tech_stack_ids}
              onChange={handleTechStackChange}
              techStacks={techStacks}
            />
          </div>

          {/* Contact */}
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

          {/* Plan Selection */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <h2 className="text-xl font-semibold text-white mb-2 font-mono">
              <Terminal className="w-5 h-5 inline mr-2 text-brand" />
              // CHOOSE_YOUR_PLAN
            </h2>
            <p className="text-sm text-muted mb-6">
              Select a submission plan that works for your project.
            </p>
            
            <PlanSelection 
              selectedPlan={selectedPlan}
              onPlanSelect={setSelectedPlan}
            />
          </div>

          {/* Backlink Verification (Free Plan Only) */}
          {selectedPlan === 'free' && (
            <div className="bg-surface rounded-xl border border-brand/30 p-6">
              <h2 className="text-xl font-semibold text-white mb-2 font-mono">
                <Terminal className="w-5 h-5 inline mr-2 text-brand" />
                // BACKLINK_VERIFICATION
              </h2>
              <p className="text-sm text-muted mb-6">
                Free submissions require a backlink. Add our badge to your README to verify your submission.
              </p>
              
              <BacklinkVerification
                projectName={formData.name}
                githubUrl={formData.github}
                onVerificationComplete={(verified, url) => {
                  setBacklinkVerified(verified);
                  if (url) setBacklinkUrl(url);
                }}
              />
            </div>
          )}

          {/* Sponsor Payment (Sponsor Plan Only) */}
          {selectedPlan === 'sponsor' && (
            <div className="bg-surface rounded-xl border border-emerald-500/30 p-6">
              <h2 className="text-xl font-semibold text-white mb-2 font-mono">
                <Crown className="w-5 h-5 inline mr-2 text-emerald-500" />
                // SPONSOR_PAYMENT
              </h2>
              <p className="text-sm text-muted mb-6">
                Complete payment to activate your sponsor benefits immediately.
              </p>
              
              <div className="bg-dark/50 rounded-lg p-6 border border-emerald-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold">Sponsor Plan</h3>
                    <p className="text-sm text-muted">7 days featured + newsletter + instant approval + dofollow links</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-500">$19</p>
                    <p className="text-xs text-muted">one-time</p>
                  </div>
                </div>
                
                {sponsorPaymentId ? (
                  <div className="flex items-center gap-2 text-green-400 bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Payment completed!</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      // In production, this would open Stripe checkout
                      // For now, we'll simulate a successful payment
                      const mockPaymentId = `sp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                      setSponsorPaymentId(mockPaymentId);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-dark font-bold rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Crown className="w-5 h-5" />
                    Pay $19 - Become a Sponsor
                  </button>
                )}
                
                <p className="text-xs text-muted mt-3 text-center">
                  Secure payment powered by Stripe. No recurring charges.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-400 font-mono text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || (selectedPlan === 'free' && !backlinkVerified) || (selectedPlan === 'sponsor' && !sponsorPaymentId)}
            className={`w-full flex items-center justify-center px-6 py-4 font-medium font-mono rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              selectedPlan === 'sponsor' 
                ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-dark hover:opacity-90' 
                : 'bg-brand text-dark hover:bg-brand-light'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : selectedPlan === 'sponsor' ? (
              <>
                <Crown className="w-5 h-5 mr-2" />
                Launch as Sponsor<span className="text-dark/70">_</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Submit for Review<span className="text-dark/70">_</span>
              </>
            )}
          </button>
          
          {/* Submission info based on plan */}
          <div className={`text-center text-sm ${selectedPlan === 'sponsor' ? 'text-emerald-500/70' : 'text-muted'}`}>
            {selectedPlan === 'sponsor' ? (
              <p>✨ Your project will go live immediately upon submission</p>
            ) : (
              <p>📋 Your project will be reviewed within approximately 1 week</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
