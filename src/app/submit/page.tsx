'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, Terminal, Loader2, Upload, X, Crown, Sparkles, Eye, EyeOff, Save, Trash2, LogIn, User, Globe, Github, FileText, Camera, Twitter, Linkedin, Youtube, MessageCircle, Settings, TrendingUp } from 'lucide-react';
import { RichTextEditor, TechStackSelector, PlanSelection, BacklinkVerification, CreatorProfileCard, PayPalButton, BioEditor, ClaimProject, type SubmissionPlan } from '@/components/ui';
import { useAuth } from '@/lib/auth/AuthContext';
import type { CreatorProfile } from '@/lib/mongodb/queries';

const DRAFT_STORAGE_KEY = 'osf_submit_draft';

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
  const [selectedPlan, setSelectedPlan] = useState<SubmissionPlan>('sponsor');
  const [sponsorPaymentId, setSponsorPaymentId] = useState<string | null>(null);
  
  // Backlink verification state (for free plan)
  const [backlinkVerified, setBacklinkVerified] = useState(false);
  const [backlinkUrl, setBacklinkUrl] = useState<string | undefined>();
  
  // Duplicate check state
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);
  const [duplicateChecked, setDuplicateChecked] = useState(false);
  
  // Claim existing alternative state
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [existingAlternative, setExistingAlternative] = useState<{
    id: string;
    name: string;
    slug: string;
    github: string;
    hasOwner: boolean;
    approved: boolean;
  } | null>(null);
  const [canClaim, setCanClaim] = useState(false);
  
  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  
  // Draft state
  const [draftLoading, setDraftLoading] = useState(false);
  const [draftSaving, setDraftSaving] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [draftLastSaved, setDraftLastSaved] = useState<Date | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  
  // Auth modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  
  const router = useRouter();
  const { signIn, signUp, profile, updateProfile, refreshProfile } = useAuth();
  
  // Profile settings modal state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const [profileFormData, setProfileFormData] = useState({
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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showPaymentModal || showAuthModal || showProfileModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showPaymentModal, showAuthModal]);

  // Save form data to localStorage for persistence across auth
  const saveFormToStorage = useCallback(() => {
    const dataToSave = {
      formData,
      selectedPlan,
      sponsorPaymentId,
      iconPreview,
      screenshotPreviews,
    };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(dataToSave));
  }, [formData, selectedPlan, sponsorPaymentId, iconPreview, screenshotPreviews]);

  // Load form data from localStorage (for after auth)
  useEffect(() => {
    const savedData = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.formData) {
          setFormData(prev => ({
            ...prev,
            ...parsed.formData,
            // Preserve user email if logged in
            submitter_email: user?.email || parsed.formData.submitter_email || '',
            submitter_name: user?.name || parsed.formData.submitter_name || '',
          }));
        }
        if (parsed.selectedPlan) setSelectedPlan(parsed.selectedPlan);
        if (parsed.sponsorPaymentId) setSponsorPaymentId(parsed.sponsorPaymentId);
        if (parsed.iconPreview) setIconPreview(parsed.iconPreview);
        if (parsed.screenshotPreviews) setScreenshotPreviews(parsed.screenshotPreviews);
        
        // Clear localStorage after loading
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch (err) {
        console.error('Error loading saved form data:', err);
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      }
    }
  }, [user]);

  // Handle auth modal sign in
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      // Save form data before auth
      saveFormToStorage();

      if (authMode === 'login') {
        const { error } = await signIn(authEmail, authPassword);
        if (error) {
          setAuthError(error.message);
          setAuthLoading(false);
          return;
        }
      } else {
        const { error } = await signUp(authEmail, authPassword, authName);
        if (error) {
          setAuthError(error.message);
          setAuthLoading(false);
          return;
        }
      }

      // Close modal and refresh - the useEffect will load saved data
      setShowAuthModal(false);
      router.refresh();
    } catch (err) {
      setAuthError('An unexpected error occurred');
    } finally {
      setAuthLoading(false);
    }
  };

  // Open auth modal and save form data
  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setAuthError(null);
    setAuthEmail('');
    setAuthPassword('');
    setAuthName('');
    setShowAuthModal(true);
  };

  // Open profile settings modal
  const openProfileModal = () => {
    if (profile) {
      setProfileFormData({
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
    setProfileMessage(null);
    setShowProfileModal(true);
  };

  // Handle profile avatar change
  const handleProfileAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setProfileMessage({ type: 'error', text: 'Please select an image file' });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setProfileMessage({ type: 'error', text: 'Image must be less than 2MB' });
      return;
    }

    setUploadingAvatar(true);
    setProfileMessage(null);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProfileFormData({ ...profileFormData, avatar_url: base64 });
        setUploadingAvatar(false);
      };
      reader.onerror = () => {
        setProfileMessage({ type: 'error', text: 'Failed to read image file' });
        setUploadingAvatar(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setProfileMessage({ type: 'error', text: 'Failed to upload image' });
      setUploadingAvatar(false);
    }
  };

  const removeProfileAvatar = () => {
    setProfileFormData({ ...profileFormData, avatar_url: '' });
    if (profileFileInputRef.current) {
      profileFileInputRef.current.value = '';
    }
  };

  // Handle profile settings save
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage(null);

    const { error } = await updateProfile(profileFormData);

    if (error) {
      setProfileMessage({ type: 'error', text: error.message });
    } else {
      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
      // Refresh creator profile for the preview
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setCreatorProfile(data);
        }
      } catch (err) {
        console.error('Failed to refresh creator profile:', err);
      }
      // Close modal after short delay
      setTimeout(() => {
        setShowProfileModal(false);
      }, 1500);
    }

    setProfileSaving(false);
  };

  // Auto-fill user email if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        submitter_email: user.email || '',
        submitter_name: user.name || prev.submitter_name,
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
      
      // Load existing draft if user is signed in
      const loadDraft = async () => {
        setDraftLoading(true);
        try {
          const res = await fetch('/api/submit/draft');
          if (res.ok) {
            const data = await res.json();
            if (data.draft) {
              setHasDraft(true);
              // Populate form data from draft
              setFormData({
                name: data.draft.name || '',
                website: data.draft.website || '',
                github: data.draft.github || '',
                short_description: data.draft.short_description || '',
                description: data.draft.description || '',
                long_description: data.draft.long_description || '',
                icon_url: data.draft.icon_url || '',
                license: data.draft.license || '',
                is_self_hosted: data.draft.is_self_hosted || false,
                category_ids: data.draft.category_ids || [],
                alternative_to_ids: data.draft.alternative_to_ids || [],
                tag_ids: data.draft.tag_ids || [],
                tech_stack_ids: data.draft.tech_stack_ids || [],
                submitter_name: data.draft.submitter_name || user.name || '',
                submitter_email: data.draft.submitter_email || user.email || '',
                screenshots: data.draft.screenshots || [],
              });
              // Set plan and payment state
              setSelectedPlan(data.draft.submission_plan || 'free');
              if (data.draft.sponsor_payment_id) {
                setSponsorPaymentId(data.draft.sponsor_payment_id);
              }
              // Set icon preview if exists
              if (data.draft.icon_url) {
                setIconPreview(data.draft.icon_url);
              }
              // Set screenshot previews if exists
              if (data.draft.screenshots?.length > 0) {
                setScreenshotPreviews(data.draft.screenshots);
              }
              // Set last saved time
              if (data.draft.updated_at) {
                setDraftLastSaved(new Date(data.draft.updated_at));
              }
            }
          }
        } catch (err) {
          console.error('Failed to load draft:', err);
        } finally {
          setDraftLoading(false);
        }
      };
      
      loadDraft();
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

  // Check for duplicate name/github when fields change
  const checkDuplicate = async () => {
    if (!formData.name && !formData.github) {
      setDuplicateError(null);
      setDuplicateChecked(false);
      setExistingAlternative(null);
      setCanClaim(false);
      return false;
    }

    setCheckingDuplicate(true);
    setDuplicateError(null);
    setExistingAlternative(null);
    setCanClaim(false);

    try {
      const res = await fetch('/api/submit/check-duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          github: formData.github,
        }),
      });

      const data = await res.json();

      if (data.duplicate) {
        setDuplicateError(data.errors.join('. '));
        setDuplicateChecked(true);
        setError(data.errors.join('. '));
        
        // Check if user can claim this alternative
        if (data.existingAlternative) {
          setExistingAlternative(data.existingAlternative);
          setCanClaim(data.canClaim && user !== null);
        }
        
        return false;
      } else {
        setDuplicateError(null);
        setDuplicateChecked(true);
        setExistingAlternative(null);
        setCanClaim(false);
        return true;
      }
    } catch (err) {
      console.error('Error checking duplicate:', err);
      setError('Failed to check for duplicates. Please try again.');
      return false;
    } finally {
      setCheckingDuplicate(false);
    }
  };

  // Reset duplicate check when name or github changes
  useEffect(() => {
    setDuplicateChecked(false);
    setDuplicateError(null);
    setExistingAlternative(null);
    setCanClaim(false);
  }, [formData.name, formData.github]);

  // Save draft function
  const saveDraft = useCallback(async () => {
    if (!user) return;
    
    setDraftSaving(true);
    setDraftSaved(false);
    
    try {
      const res = await fetch('/api/submit/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          submission_plan: selectedPlan,
          sponsor_payment_id: sponsorPaymentId,
          sponsor_paid: !!sponsorPaymentId,
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setDraftSaved(true);
        setHasDraft(true);
        setDraftLastSaved(new Date(data.draft.updated_at));
        // Reset saved indicator after 3 seconds
        setTimeout(() => setDraftSaved(false), 3000);
      } else {
        console.error('Failed to save draft');
      }
    } catch (err) {
      console.error('Error saving draft:', err);
    } finally {
      setDraftSaving(false);
    }
  }, [user, formData, selectedPlan, sponsorPaymentId]);

  // Delete draft function
  const deleteDraft = async () => {
    if (!user) return;
    
    try {
      const res = await fetch('/api/submit/draft', {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setHasDraft(false);
        setDraftLastSaved(null);
        // Reset form
        setFormData({
          name: '',
          website: '',
          github: '',
          short_description: '',
          description: '',
          long_description: '',
          icon_url: '',
          license: '',
          is_self_hosted: false,
          category_ids: [],
          alternative_to_ids: [],
          tag_ids: [],
          tech_stack_ids: [],
          submitter_name: user.name || '',
          submitter_email: user.email || '',
          screenshots: [],
        });
        setSelectedPlan('free');
        setSponsorPaymentId(null);
        setIconPreview(null);
        setScreenshotPreviews([]);
      }
    } catch (err) {
      console.error('Error deleting draft:', err);
    }
  };

  // Check if all required fields for payment are filled
  const canShowPayment = formData.name && 
    formData.website && 
    formData.github && 
    formData.short_description && 
    formData.description && 
    formData.license && 
    formData.alternative_to_ids.length > 0 &&
    duplicateChecked &&
    !duplicateError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate required fields
    if (!formData.license) {
      setError('Please specify a license for your project.');
      setIsSubmitting(false);
      return;
    }

    if (formData.alternative_to_ids.length === 0) {
      setError('Please select which proprietary software this is an alternative to.');
      setIsSubmitting(false);
      return;
    }

    // Plan-specific validation
    if (selectedPlan === 'free' && !backlinkVerified) {
      setError('Please verify your backlink before submitting. Add the Open Source Finder badge to your README and click "Verify Backlink".');
      setIsSubmitting(false);
      return;
    }

    // For sponsor plan, payment must be completed first via PayPal button
    if (selectedPlan === 'sponsor' && !sponsorPaymentId) {
      setError('Please complete PayPal payment before submitting.');
      setIsSubmitting(false);
      return;
    }

    // Free plan submission or sponsor with completed payment
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          submission_plan: selectedPlan,
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

      // Delete draft after successful submission
      if (user && hasDraft) {
        try {
          await fetch('/api/submit/draft', { method: 'DELETE' });
        } catch (err) {
          console.error('Failed to delete draft after submission:', err);
        }
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
        // Only allow up to 3 alternatives
        if (prev.alternative_to_ids.length >= 3) {
          return prev;
        }
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
                Your project is now live and featured on OPEN_SRC.ME!
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
              We&apos;ve received your submission and will review it within approximately 1 month. 
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
      <div id="submit-form" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Personal Info */}
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
                <button
                  type="button"
                  onClick={openProfileModal}
                  className="text-xs text-brand hover:underline font-medium"
                >
                  Customize
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="text-xs text-brand hover:underline font-medium"
                >
                  Sign in to customize
                </button>
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
              <span className={`ml-2 font-mono ${formData.category_ids.length >= 3 ? 'text-emerald-400' : 'text-brand'}`}>
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
              // ALTERNATIVE_TO *
            </h2>
            <p className="text-sm text-muted mb-4">
              Select which proprietary software this is an alternative to. <span className="text-muted">(Required)</span>
              <span className="ml-2 font-mono text-brand">
                ({formData.alternative_to_ids.length}/3)
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
                      ? 'text-brand'
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
              <span className={`ml-2 font-mono ${formData.tech_stack_ids.length >= 10 ? 'text-emerald-400' : 'text-brand'}`}>
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
                  license *
                </label>
                <input
                  type="text"
                  id="license"
                  required
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
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2 font-mono">
                    <Terminal className="w-5 h-5 inline mr-2 text-brand" />
                    // BACKLINK_VERIFICATION
                  </h2>
                  <p className="text-sm text-muted mb-4">
                    To submit with the free plan, add a backlink to Open Source Finder in your README.
                    This helps us grow and discover more open source alternatives!
                  </p>
                </div>

                <div className="ml-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlan('sponsor');
                      setError(null);
                    }}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium bg-emerald-500 text-dark rounded-md hover:bg-emerald-600 transition"
                  >
                    Switch to Sponsor (skip backlink)
                  </button>
                </div>
              </div>

              <BacklinkVerification
                projectName={formData.name || 'your-project'}
                githubUrl={formData.github}
                onVerificationComplete={(verified, url) => {
                  setBacklinkVerified(verified);
                  setBacklinkUrl(url);
                }}
              />
            </div>
          )}

          {/* Error Message with Claim Option */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-400 font-mono text-sm">{error}</p>
              
              {/* Show claim button if the alternative can be claimed */}
              {canClaim && existingAlternative && user && (
                <div className="mt-4 pt-4 border-t border-red-500/20">
                  <p className="text-white text-sm mb-3">
                    Are you the owner of this project? You can claim it to get ownership.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowClaimModal(true)}
                    className="px-4 py-2 bg-red-500 text-white font-mono font-semibold rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    Claim This Project
                  </button>
                </div>
              )}
              
              {/* Show login prompt if can claim but not logged in */}
              {existingAlternative && !existingAlternative.hasOwner && !user && (
                <div className="mt-4 pt-4 border-t border-red-500/20">
                  <p className="text-white text-sm mb-3">
                    Are you the owner of this project? Log in to claim ownership.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowAuthModal(true)}
                    className="px-4 py-2 bg-brand text-dark font-mono font-semibold rounded-lg hover:bg-brand-light transition-colors text-sm"
                  >
                    Log In to Claim
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Claim Project Modal */}
          {showClaimModal && existingAlternative && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <div className="max-w-lg w-full">
                <ClaimProject
                  existingAlternative={existingAlternative}
                  onClaimSuccess={() => {
                    setShowClaimModal(false);
                    // Redirect to dashboard after successful claim
                    router.push('/dashboard');
                  }}
                  onCancel={() => setShowClaimModal(false)}
                />
              </div>
            </div>
          )}

          {/* Payment Modal */}
          {showPaymentModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-40 pt-8">
              <div className="bg-surface border border-border rounded-xl max-w-lg w-full relative max-h-[80vh] flex flex-col mx-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="absolute top-4 right-4 text-muted hover:text-white transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>
                
                {/* Scrollable Content */}
                <div className="overflow-y-auto flex-1">
                  {/* Header Section */}
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center">
                        <Crown className="w-6 h-6 text-emerald-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white font-mono">
                          Sponsor {formData.name}
                        </h3>
                        <p className="text-muted text-sm">
                          Get instant approval and premium features
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Benefits Section */}
                  <div className="p-6 border-b border-border">
                    <h4 className="text-sm font-mono text-muted mb-3">// SPONSOR_BENEFITS</h4>
                    <p className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                      Average sponsored listings get 4,800 clicks/month
                    </p>
                    <ul className="text-sm text-white space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        Instant approval
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        SEO boost with dofollow links
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        Featured on homepage
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                         Newsletter feature
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                         Unlimited updates
                      </li>
                        <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                         Priority in search results
                      </li>
                    </ul>
                  </div>

                  {/* Payment Section */}
                  <div className="p-6">
                    <div className="bg-white rounded-lg p-6 border border-emerald-500/30">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h5 className="text-gray-900 font-semibold">Sponsored Listing</h5>
                        </div>
                        <div className="text-right">
                          {couponApplied ? (
                            <>
                              <p className="text-sm text-gray-400 line-through">${'49'}</p>
                              <p className="text-2xl font-bold text-emerald-600">${(49 * (1 - couponDiscount)).toFixed(2)}</p>
                            </>
                          ) : (
                            <p className="text-2xl font-bold text-emerald-600">$49</p>
                          )}
                          <p className="text-xs text-gray-500">one-time</p>
                        </div>
                      </div>

                      {/* Coupon Code Input */}
                      <div className="mb-4">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => {
                              setCouponCode(e.target.value.toUpperCase());
                              setCouponError(null);
                            }}
                            placeholder="Coupon code"
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-gray-900"
                            disabled={couponApplied}
                          />
                          {couponApplied ? (
                            <button
                              type="button"
                              onClick={() => {
                                setCouponApplied(false);
                                setCouponDiscount(0);
                                setCouponCode('');
                              }}
                              className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                            >
                              Remove
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                // Validate coupon code
                                const validCoupons: Record<string, number> = { 'LAUNCH60': 0.60, 'LISTEDDISCOUNT': 0.60, 'PH30OFF': 0.30 };
                                const discount = validCoupons[couponCode.trim().toUpperCase()];
                                if (discount) {
                                  setCouponApplied(true);
                                  setCouponDiscount(discount);
                                  setCouponError(null);
                                } else {
                                  setCouponError('Invalid coupon code');
                                }
                              }}
                              className="px-4 py-2 text-sm font-medium text-emerald-600 border border-emerald-300 rounded-lg hover:bg-emerald-50"
                            >
                              Apply
                            </button>
                          )}
                        </div>
                        {couponError && (
                          <p className="text-red-500 text-xs mt-1">{couponError}</p>
                        )}
                        {couponApplied && (
                          <p className="text-emerald-600 text-xs mt-1">✓ Coupon applied: {Math.round(couponDiscount * 100)}% off</p>
                        )}
                      </div>

                      {paymentError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                          <p className="text-red-600 text-sm">{paymentError}</p>
                        </div>
                      )}

                      <PayPalButton
                        paymentType="sponsor_submission"
                        amount={couponApplied ? (49 * (1 - couponDiscount)).toFixed(2) : "49"}
                        projectName={formData.name}
                        couponCode={couponApplied ? couponCode : undefined}
                        onSuccess={async (data) => {
                          setSponsorPaymentId(data.captureId);
                          setError(null);
                          setShowPaymentModal(false);
                          
                          // Auto-save draft with payment info
                          if (user) {
                            try {
                              await fetch('/api/submit/draft', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  ...formData,
                                  submission_plan: selectedPlan,
                                  sponsor_payment_id: data.captureId,
                                  sponsor_paid: true,
                                }),
                              });
                              setDraftSaved(true);
                              setHasDraft(true);
                              setDraftLastSaved(new Date());
                              setTimeout(() => setDraftSaved(false), 3000);
                            } catch (err) {
                              console.error('Failed to auto-save draft after payment:', err);
                            }
                          }
                        }}
                        onError={(error) => setPaymentError(error)}
                        onCancel={() => setPaymentError('Payment was cancelled. Please try again.')}
                      />
                    </div>
                    
                    <p className="text-xs text-muted text-center mt-4">
                      Secure payment powered by PayPal
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Draft Button - Only for signed-in users */}
          {user && (
            <div className="bg-surface rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Save className={`w-5 h-5 ${draftSaved ? 'text-emerald-500' : 'text-muted'}`} />
                  <div>
                    <span className="text-sm font-medium text-white font-mono">
                      {draftLoading ? 'Loading draft...' : hasDraft ? 'Draft saved' : 'No draft saved'}
                    </span>
                    {draftLastSaved && (
                      <p className="text-xs text-muted">
                        Last saved: {draftLastSaved.toLocaleString()}
                      </p>
                    )}
                    {draftSaved && (
                      <p className="text-xs text-emerald-500">
                        ✓ Draft saved successfully
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {hasDraft && (
                    <button
                      type="button"
                      onClick={deleteDraft}
                      className="inline-flex items-center px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-1.5" />
                      Delete Draft
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={saveDraft}
                    disabled={draftSaving}
                    className="inline-flex items-center px-4 py-1.5 bg-brand/10 text-brand hover:bg-brand/20 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    {draftSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-1.5" />
                        Save Draft
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sign-in prompt for draft feature - Only for non-signed-in users */}
          {!user && (
            <div className="bg-surface rounded-xl border border-brand/30 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Save className="w-5 h-5 text-brand" />
                  <div>
                    <span className="text-sm font-medium text-white font-mono">
                      Save as Draft
                    </span>
                    <p className="text-xs text-muted">
                      Sign in to save your progress and continue later
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="inline-flex items-center px-4 py-1.5 bg-brand text-dark hover:bg-brand-light rounded-lg transition-colors text-sm font-medium"
                >
                  <LogIn className="w-4 h-4 mr-1.5" />
                  Sign In
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type={selectedPlan === 'sponsor' && !sponsorPaymentId ? 'button' : 'submit'}
            disabled={isSubmitting || (selectedPlan === 'free' && !backlinkVerified) || checkingDuplicate}
            onClick={async (e) => {
              if (selectedPlan === 'sponsor' && !sponsorPaymentId) {
                e.preventDefault();
                
                // Clear previous errors
                setError(null);
                setDuplicateError(null);
                
                // Check if all required fields are filled
                if (!formData.name || !formData.website || !formData.github || !formData.short_description || !formData.description || !formData.license || formData.alternative_to_ids.length === 0) {
                  setError('Please complete all required fields: project name, website, GitHub URL, descriptions, license, and select at least one alternative.');
                  return;
                }
                
                // Always run duplicate check
                const duplicateCheckResult = await checkDuplicate();
                
                // If duplicate check failed, error is already set by checkDuplicate
                if (!duplicateCheckResult) {
                  return;
                }
                
                // Require sign in for sponsor plan payment
                if (!user) {
                  openAuthModal('login');
                  return;
                }
                
                // If all checks passed, open payment modal
                setShowPaymentModal(true);
                setPaymentError(null);
              }
            }}
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
            ) : checkingDuplicate ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Checking availability...
              </>
            ) : selectedPlan === 'sponsor' ? (
              <>
                {sponsorPaymentId ? 'Launch as Sponsor' : 'Complete Payment'}<span className="text-dark/70">_</span>
              </>
            ) : (
              <>
                Submit for Review<span className="text-dark/70">_</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-xl max-w-md w-full relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-muted hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogIn className="w-6 h-6 text-brand" />
                </div>
                <h3 className="text-xl font-bold text-white font-mono">
                  {authMode === 'login' ? 'Sign In' : 'Create Account'}<span className="text-brand">_</span>
                </h3>
                <p className="text-sm text-muted mt-2">
                  {authMode === 'login' 
                    ? 'Sign in to save your submission as a draft' 
                    : 'Create an account to save your progress'}
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm font-mono">
                    {authError}
                  </div>
                )}

                {/* OAuth Buttons */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = '/api/auth/github?returnTo=/submit';
                    }}
                    className="w-full py-2.5 bg-[#24292f] hover:bg-[#32383f] text-white font-mono font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-2.5 active:scale-[0.98] border border-[#444c56]"
                  >
                    <Github className="w-5 h-5" />
                    Continue with GitHub
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = '/api/auth/google?returnTo=/submit';
                    }}
                    className="w-full py-2.5 bg-white hover:bg-gray-100 text-gray-800 font-mono font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-2.5 active:scale-[0.98] border border-gray-300"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                  </button>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-surface px-3 text-muted font-mono">or continue with email</span>
                  </div>
                </div>

                {authMode === 'signup' && (
                  <div>
                    <label htmlFor="auth-name" className="block text-sm font-mono text-muted mb-2">
                      Name
                    </label>
                    <input
                      id="auth-name"
                      type="text"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white font-mono focus:outline-none focus:border-brand transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="auth-email" className="block text-sm font-mono text-muted mb-2">
                    Email
                  </label>
                  <input
                    id="auth-email"
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white font-mono focus:outline-none focus:border-brand transition-colors"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="auth-password" className="block text-sm font-mono text-muted mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="auth-password"
                      type={showAuthPassword ? 'text' : 'password'}
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white font-mono focus:outline-none focus:border-brand transition-colors pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAuthPassword(!showAuthPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                    >
                      {showAuthPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 bg-brand text-dark font-mono font-semibold rounded-lg hover:bg-brand-light transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {authLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {authMode === 'login' ? 'Sign In_' : 'Create Account_'}
                </button>

                <p className="text-center text-sm font-mono text-muted">
                  {authMode === 'login' ? (
                    <>
                      Don&apos;t have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('signup');
                          setAuthError(null);
                        }}
                        className="text-brand hover:text-brand-light transition-colors"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('login');
                          setAuthError(null);
                        }}
                        className="text-brand hover:text-brand-light transition-colors"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Profile Settings Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-xl max-w-2xl w-full relative max-h-[90vh] flex flex-col">
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 text-muted hover:text-white transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center">
                  <Settings className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-mono">
                    Profile Settings<span className="text-brand">_</span>
                  </h3>
                  <p className="text-sm text-muted">
                    Customize your creator profile
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {profileMessage && (
                  <div
                    className={`p-3 rounded-lg border ${
                      profileMessage.type === 'success'
                        ? 'bg-green-500/10 border-green-500/20 text-green-400'
                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}
                  >
                    {profileMessage.text}
                  </div>
                )}

                {/* Profile Picture */}
                <div>
                  <label className="block text-gray-300 font-mono text-sm mb-2">
                    <Camera className="w-4 h-4 inline mr-2" />
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-4">
                    {profileFormData.avatar_url ? (
                      <div className="relative">
                        <Image
                          src={profileFormData.avatar_url}
                          alt="Profile picture"
                          width={64}
                          height={64}
                          className="w-16 h-16 rounded-full object-cover border-2 border-brand/30"
                        />
                        <button
                          type="button"
                          onClick={removeProfileAvatar}
                          className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-dark border-2 border-dashed border-border rounded-full flex items-center justify-center text-gray-500">
                        <User className="w-8 h-8" />
                      </div>
                    )}
                    <div>
                      <input
                        ref={profileFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfileAvatarChange}
                        className="hidden"
                        id="profile-avatar-upload"
                      />
                      <label
                        htmlFor="profile-avatar-upload"
                        className={`inline-flex items-center gap-2 px-3 py-1.5 bg-dark border border-border rounded-lg cursor-pointer hover:border-brand transition-colors text-sm ${
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
                            {profileFormData.avatar_url ? 'Change' : 'Upload'}
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="profile-name" className="block text-gray-300 font-mono text-sm mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Display Name
                  </label>
                  <input
                    type="text"
                    id="profile-name"
                    value={profileFormData.name}
                    onChange={(e) => setProfileFormData({ ...profileFormData, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-4 py-2.5 bg-dark border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand transition-colors"
                    maxLength={100}
                  />
                </div>

                {/* Bio */}
                <div>
                  <label htmlFor="profile-bio" className="block text-gray-300 font-mono text-sm mb-2">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Bio
                  </label>
                  <BioEditor
                    content={profileFormData.bio}
                    onChange={(html) => setProfileFormData({ ...profileFormData, bio: html })}
                    placeholder="Tell us about yourself..."
                    maxLength={500}
                  />
                </div>

                {/* Website */}
                <div>
                  <label htmlFor="profile-website" className="block text-gray-300 font-mono text-sm mb-2">
                    <Globe className="w-4 h-4 inline mr-2" />
                    Website
                  </label>
                  <input
                    type="url"
                    id="profile-website"
                    value={profileFormData.website}
                    onChange={(e) => setProfileFormData({ ...profileFormData, website: e.target.value })}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-4 py-2.5 bg-dark border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand transition-colors"
                  />
                </div>

                {/* GitHub Username */}
                <div>
                  <label htmlFor="profile-github" className="block text-gray-300 font-mono text-sm mb-2">
                    <Github className="w-4 h-4 inline mr-2" />
                    GitHub Username
                  </label>
                  <div className="flex items-center">
                    <span className="px-3 py-2.5 bg-dark border border-border border-r-0 rounded-l-lg text-gray-500 text-sm">
                      github.com/
                    </span>
                    <input
                      type="text"
                      id="profile-github"
                      value={profileFormData.github_username}
                      onChange={(e) => setProfileFormData({ ...profileFormData, github_username: e.target.value })}
                      placeholder="username"
                      className="flex-1 px-4 py-2.5 bg-dark border border-border rounded-r-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand transition-colors"
                      maxLength={39}
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div className="pt-4 border-t border-border">
                  <h4 className="text-sm font-mono text-brand mb-4">// social_links</h4>
                  
                  {/* Twitter/X */}
                  <div className="mb-4">
                    <label htmlFor="profile-twitter" className="block text-gray-300 font-mono text-sm mb-2">
                      <Twitter className="w-4 h-4 inline mr-2" />
                      Twitter / X
                    </label>
                    <div className="flex items-center">
                      <span className="px-3 py-2.5 bg-dark border border-border border-r-0 rounded-l-lg text-gray-500 text-sm">
                        x.com/
                      </span>
                      <input
                        type="text"
                        id="profile-twitter"
                        value={profileFormData.twitter_username}
                        onChange={(e) => setProfileFormData({ ...profileFormData, twitter_username: e.target.value })}
                        placeholder="username"
                        className="flex-1 px-4 py-2.5 bg-dark border border-border rounded-r-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand transition-colors"
                        maxLength={15}
                      />
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div className="mb-4">
                    <label htmlFor="profile-linkedin" className="block text-gray-300 font-mono text-sm mb-2">
                      <Linkedin className="w-4 h-4 inline mr-2" />
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      id="profile-linkedin"
                      value={profileFormData.linkedin_url}
                      onChange={(e) => setProfileFormData({ ...profileFormData, linkedin_url: e.target.value })}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="w-full px-4 py-2.5 bg-dark border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand transition-colors"
                    />
                  </div>

                  {/* YouTube */}
                  <div className="mb-4">
                    <label htmlFor="profile-youtube" className="block text-gray-300 font-mono text-sm mb-2">
                      <Youtube className="w-4 h-4 inline mr-2" />
                      YouTube Channel
                    </label>
                    <input
                      type="url"
                      id="profile-youtube"
                      value={profileFormData.youtube_url}
                      onChange={(e) => setProfileFormData({ ...profileFormData, youtube_url: e.target.value })}
                      placeholder="https://youtube.com/@yourchannel"
                      className="w-full px-4 py-2.5 bg-dark border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand transition-colors"
                    />
                  </div>

                  {/* Discord */}
                  <div>
                    <label htmlFor="profile-discord" className="block text-gray-300 font-mono text-sm mb-2">
                      <MessageCircle className="w-4 h-4 inline mr-2" />
                      Discord Username
                    </label>
                    <input
                      type="text"
                      id="profile-discord"
                      value={profileFormData.discord_username}
                      onChange={(e) => setProfileFormData({ ...profileFormData, discord_username: e.target.value })}
                      placeholder="username"
                      className="w-full px-4 py-2.5 bg-dark border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand transition-colors"
                      maxLength={32}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(false)}
                    className="px-4 py-2 text-muted hover:text-white transition-colors mr-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="px-5 py-2 bg-brand text-dark font-mono font-semibold rounded-lg hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {profileSaving ? (
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
