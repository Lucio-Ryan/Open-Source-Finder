'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Eye, Clock, CheckCircle, XCircle, Loader2, LogOut, Settings, Sparkles, Zap, Megaphone, X } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { NotificationsPanel, PayPalButton } from '@/components/ui';

interface UserAlternative {
  id: string;
  name: string;
  slug: string;
  description: string;
  approved: boolean;
  rejection_reason: string | null;
  rejected_at: string | null;
  created_at: string;
  icon_url: string | null;
  submission_plan: 'free' | 'sponsor' | null;
  sponsor_featured_until: string | null;
  sponsor_priority_until: string | null;
}

interface BoostModalState {
  isOpen: boolean;
  alternativeId: string | null;
  alternativeName: string | null;
}

export default function DashboardPage() {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [alternatives, setAlternatives] = useState<UserAlternative[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgradingId, setUpgradingId] = useState<string | null>(null);
  const [upgradeSuccess, setUpgradeSuccess] = useState<string | null>(null);
  const [boostModal, setBoostModal] = useState<BoostModalState>({
    isOpen: false,
    alternativeId: null,
    alternativeName: null,
  });
  const [boostError, setBoostError] = useState<string | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (boostModal.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [boostModal.isOpen]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchUserAlternatives = async () => {
      if (!user?.id) return;

      // Fetch user alternatives via API
      const response = await fetch(`/api/profile/alternatives`);
      const result = await response.json();
      
      if (result.error) {
        console.error('Error fetching alternatives:', result.error);
      }
      
      if (result.alternatives) {
        setAlternatives(result.alternatives as UserAlternative[]);
      }
      setLoading(false);
    };

    if (user) {
      fetchUserAlternatives();
    }
  }, [user]);

  const handleUpgradeToSponsor = async (alternativeId: string, alternativeName: string) => {
    // Open boost modal instead of confirm dialog
    setBoostModal({
      isOpen: true,
      alternativeId,
      alternativeName,
    });
    setBoostError(null);
  };

  const closeBoostModal = () => {
    setBoostModal({
      isOpen: false,
      alternativeId: null,
      alternativeName: null,
    });
    setBoostError(null);
  };

  const handleBoostPaymentSuccess = async (captureData: { captureId: string }) => {
    if (!boostModal.alternativeId) return;
    
    setUpgradingId(boostModal.alternativeId);
    
    try {
      const response = await fetch(`/api/alternatives/${boostModal.alternativeId}/upgrade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_id: captureData.captureId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upgrade');
      }

      // Update local state
      setAlternatives(prev => prev.map(alt => {
        if (alt.id === boostModal.alternativeId) {
          return {
            ...alt,
            submission_plan: 'sponsor',
            approved: true,
            sponsor_featured_until: result.features.featured_until,
            sponsor_priority_until: result.features.priority_until,
          };
        }
        return alt;
      }));

      setUpgradeSuccess(boostModal.alternativeId);
      closeBoostModal();
      setTimeout(() => setUpgradeSuccess(null), 5000);
    } catch (error) {
      console.error('Error upgrading:', error);
      setBoostError(error instanceof Error ? error.message : 'Failed to upgrade. Please try again.');
    } finally {
      setUpgradingId(null);
    }
  };

  // Check if alternative has active sponsor features
  const hasActiveSponsor = (alt: UserAlternative) => {
    const now = new Date();
    const featuredUntil = alt.sponsor_featured_until ? new Date(alt.sponsor_featured_until) : null;
    const priorityUntil = alt.sponsor_priority_until ? new Date(alt.sponsor_priority_until) : null;
    return (featuredUntil && featuredUntil > now) || (priorityUntil && priorityUntil > now);
  };

  // Format remaining sponsor time
  const formatSponsorTimeRemaining = (dateStr: string | null) => {
    if (!dateStr) return null;
    const endDate = new Date(dateStr);
    const now = new Date();
    if (endDate <= now) return null;
    
    const diffMs = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} remaining`;
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  const displayName = profile?.name || user.name || user.email?.split('@')[0];

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-brand font-mono text-xs sm:text-sm mb-1 sm:mb-2">// DASHBOARD</p>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white font-mono truncate">
                Welcome, {displayName}<span className="text-brand">_</span>
              </h1>
              <p className="text-muted font-mono text-xs sm:text-sm mt-1 sm:mt-2 truncate">
                {user.email}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {/* <Link
                href="/dashboard/advertisements"
                className="flex items-center gap-2 px-4 py-2 text-muted hover:text-white border border-border hover:border-brand/50 rounded-lg font-mono text-sm transition-colors"
              >
                <Megaphone className="w-4 h-4" />
                My Ads
              </Link> */}
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-muted hover:text-white border border-border hover:border-brand/50 rounded-lg font-mono text-xs sm:text-sm transition-colors touch-manipulation"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden xs:inline">Settings</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-muted hover:text-white border border-border hover:border-red-500/50 rounded-lg font-mono text-xs sm:text-sm transition-colors touch-manipulation"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden xs:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Notifications Panel for Creators */}
        {alternatives.filter(a => a.approved).length > 0 && (
          <NotificationsPanel className="mb-6 sm:mb-8" />
        )}

        {/* Actions */}
        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white font-mono">
            Your Alternatives<span className="text-brand">_</span>
          </h2>
          <Link
            href="/submit"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-brand text-dark font-mono text-sm font-medium rounded-lg hover:bg-brand-light transition-all hover:shadow-glow touch-manipulation"
          >
            <Plus className="w-4 h-4" />
            Submit New
          </Link>
        </div>

        {/* Alternatives List */}
        {loading ? (
          <div className="flex items-center justify-center py-12 sm:py-16">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-brand animate-spin" />
          </div>
        ) : alternatives.length === 0 ? (
          <div className="bg-surface border border-border rounded-xl p-8 sm:p-12 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand/10 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-brand" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">No alternatives yet</h3>
            <p className="text-muted font-mono text-xs sm:text-sm mb-4 sm:mb-6">
              Submit your first open source alternative to get started.
            </p>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-brand text-dark font-mono font-medium rounded-lg hover:bg-brand-light transition-all hover:shadow-glow touch-manipulation"
            >
              <Plus className="w-4 h-4" />
              Submit Alternative
            </Link>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {alternatives.map((alt) => {
              const isActiveSponsor = hasActiveSponsor(alt);
              const sponsorTimeRemaining = formatSponsorTimeRemaining(alt.sponsor_featured_until || alt.sponsor_priority_until);
              
              return (
              <div
                key={alt.id}
                className={`bg-surface border rounded-xl p-4 sm:p-5 hover:border-brand/30 transition-colors relative ${
                  alt.rejected_at ? 'border-red-500/30' : isActiveSponsor ? 'border-emerald-500/30' : 'border-border'
                }`}
              >
                {/* Sponsor Badge */}
                {isActiveSponsor && (
                  <div className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-0.5 bg-emerald-500 text-dark text-[10px] sm:text-xs font-bold rounded font-mono z-10">
                    <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    Sponsored
                  </div>
                )}
                
                {/* Success Message */}
                {upgradeSuccess === alt.id && (
                  <div className="absolute inset-0 bg-green-500/10 border border-green-500/50 rounded-xl flex items-center justify-center z-20">
                    <div className="bg-surface border border-green-500 rounded-lg px-4 py-3 text-center">
                      <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                      <p className="text-green-400 font-mono text-sm">Upgraded to Sponsor!</p>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    {alt.icon_url ? (
                      <Image
                        src={alt.icon_url}
                        alt={alt.name}
                        width={48}
                        height={48}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover border border-border flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand/10 rounded-lg flex items-center justify-center text-brand font-bold flex-shrink-0 text-sm sm:text-base">
                        {alt.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base text-white truncate">{alt.name}</h3>
                      <p className="text-muted font-mono text-xs sm:text-sm line-clamp-1 max-w-full sm:max-w-md">
                        {alt.description.replace(/<[^>]*>/g, '').slice(0, 100)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 flex-wrap">
                    {/* Sponsor Time Remaining */}
                    {isActiveSponsor && sponsorTimeRemaining && (
                      <span className="text-[10px] sm:text-xs font-mono text-emerald-500">
                        {sponsorTimeRemaining}
                      </span>
                    )}
                    
                    <span
                      className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-mono ${
                        alt.approved
                          ? 'bg-brand/10 text-brand'
                          : alt.rejected_at
                          ? 'bg-red-500/10 text-red-500'
                          : 'bg-yellow-500/10 text-yellow-500'
                      }`}
                    >
                      {alt.approved ? (
                        <>
                          <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span className="hidden xs:inline">Approved</span>
                          <span className="xs:hidden">✓</span>
                        </>
                      ) : alt.rejected_at ? (
                        <>
                          <XCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span className="hidden xs:inline">Rejected</span>
                          <span className="xs:hidden">✗</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span className="hidden xs:inline">Pending</span>
                          <span className="xs:hidden">...</span>
                        </>
                      )}
                    </span>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {/* Upgrade to Sponsor Button */}
                      {!isActiveSponsor && !alt.rejected_at && (
                        <button
                          onClick={() => handleUpgradeToSponsor(alt.id, alt.name)}
                          disabled={upgradingId === alt.id}
                          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-dark border border-emerald-500/30 hover:border-emerald-500 rounded-lg font-mono text-[10px] sm:text-xs font-medium transition-all disabled:opacity-50 touch-manipulation"
                          title="Upgrade to Sponsor Plan"
                        >
                          {upgradingId === alt.id ? (
                            <Loader2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin" />
                          ) : (
                            <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          )}
                          <span className="hidden xs:inline">{upgradingId === alt.id ? 'Upgrading...' : 'Boost $19'}</span>
                          <span className="xs:hidden">$19</span>
                        </button>
                      )}
                      {alt.approved && (
                        <Link
                          href={`/alternatives/${alt.slug}`}
                          className="p-1.5 sm:p-2 text-muted hover:text-white border border-border hover:border-brand/50 rounded-lg transition-colors touch-manipulation"
                          title="View"
                        >
                          <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Link>
                      )}
                      {/* Only sponsors can edit their listings (unlimited times) */}
                      {(alt.submission_plan === 'sponsor' || alt.rejected_at) && (
                        <Link
                          href={`/dashboard/edit/${alt.id}`}
                          className="p-1.5 sm:p-2 text-muted hover:text-brand border border-border hover:border-brand/50 rounded-lg transition-colors touch-manipulation"
                          title={alt.rejected_at ? "Edit & Resubmit" : "Edit"}
                        >
                          <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rejection Reason Banner */}
                {alt.rejection_reason && (
                  <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-xs sm:text-sm text-red-400">
                      <strong className="font-mono">Rejection Reason:</strong> {alt.rejection_reason}
                    </p>
                    <p className="text-[10px] sm:text-xs text-red-400/70 mt-1">
                      You can edit your submission and resubmit for review.
                    </p>
                  </div>
                )}
                
                {/* Sponsor Benefits Info */}
                {isActiveSponsor && (
                  <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                    <div className="flex items-center gap-2 text-emerald-500 text-xs sm:text-sm font-mono mb-1">
                      <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Active Sponsor Benefits
                    </div>
                    <ul className="text-[10px] sm:text-xs text-emerald-500/80 space-y-0.5 sm:space-y-1">
                      <li>• Featured on home page</li>
                      <li>• Priority in search results</li>
                      <li>• Included in newsletter</li>
                    </ul>
                  </div>
                )}
              </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Boost Modal */}
      {boostModal.isOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-40 p-0 sm:p-4">
          <div className="bg-surface border border-border rounded-t-xl sm:rounded-xl w-full sm:max-w-lg relative max-h-[90vh] sm:max-h-[80vh] flex flex-col">
            <button
              onClick={closeBoostModal}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 text-muted hover:text-white transition-colors z-10 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1">
              {/* Header Section */}
              <div className="p-4 sm:p-6 border-b border-border">
                <div className="flex items-center gap-3 sm:gap-4 pr-8">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-white font-mono truncate">
                      Boost {boostModal.alternativeName}
                    </h3>
                    <p className="text-muted text-xs sm:text-sm">
                      Get more visibility for your project
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefits Section */}
              <div className="p-4 sm:p-6 border-b border-border">
                <h4 className="text-xs sm:text-sm font-mono text-muted mb-2 sm:mb-3">// SPONSOR_BENEFITS</h4>
                <ul className="text-xs sm:text-sm text-white space-y-1.5 sm:space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 flex-shrink-0" />
                    <span>Featured on home page</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 flex-shrink-0" />
                    <span>Top of search results for 7 days</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 flex-shrink-0" />
                    <span>Included in weekly newsletter</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 flex-shrink-0" />
                    <span>Auto-approve if pending review</span>
                  </li>
                </ul>
              </div>

              {/* Payment Section - Separate Card */}
              <div className="p-4 sm:p-6">
                <div className="bg-white rounded-lg p-4 sm:p-6 border border-emerald-500/30">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div>
                    <h5 className="text-gray-900 font-semibold text-sm sm:text-base">Sponsor Boost</h5>
                    <p className="text-xs sm:text-sm text-gray-600">7 days of premium features</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl sm:text-2xl font-bold text-emerald-600">$19</p>
                    <p className="text-[10px] sm:text-xs text-gray-500">one-time</p>
                  </div>
                </div>

                {boostError && (
                  <div className="p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                    <p className="text-red-600 text-xs sm:text-sm">{boostError}</p>
                  </div>
                )}

                <PayPalButton
                  paymentType="boost_alternative"
                  amount="19"
                  alternativeId={boostModal.alternativeId || undefined}
                  projectName={boostModal.alternativeName || undefined}
                  onSuccess={handleBoostPaymentSuccess}
                  onError={(error) => setBoostError(error)}
                  onCancel={() => setBoostError('Payment was cancelled. Please try again.')}
                />
                </div>
              
                <p className="text-[10px] sm:text-xs text-muted text-center mt-3 sm:mt-4">
                  Secure payment powered by PayPal
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
