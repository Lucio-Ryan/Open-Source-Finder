'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle, 
  CreditCard,
  ExternalLink,
  AlertCircle,
  Loader2,
  Edit2,
  Calendar,
  X
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { PayPalButton } from '@/components/ui';
import type { Advertisement } from '@/types/database';

interface UserAd extends Advertisement {
  id: string;
}

export default function AdvertisementDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [ads, setAds] = useState<UserAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payingAdId, setPayingAdId] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState<UserAd | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showPaymentModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showPaymentModal]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/dashboard/advertisements');
      return;
    }

    if (user) {
      fetchMyAds();
    }
  }, [user, authLoading, router]);

  const fetchMyAds = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/advertisements/my-ads');
      
      if (!response.ok) {
        throw new Error('Failed to fetch advertisements');
      }
      
      const data = await response.json();
      setAds(data.advertisements || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load advertisements');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (adId: string, captureData: { captureId: string; amount: string; expiresAt?: string }) => {
    // Update local state immediately
    setAds(prevAds => prevAds.map(a => {
      if (a.id === adId) {
        return {
          ...a,
          paid_at: new Date().toISOString(),
          payment_id: captureData.captureId,
          payment_amount: parseFloat(captureData.amount),
          expires_at: captureData.expiresAt || null,
          is_active: true,
        };
      }
      return a;
    }));
    setPayingAdId(null);
  };

  const getPaymentType = (adType: string): 'ad_banner' | 'ad_card' | 'ad_popup' => {
    switch (adType) {
      case 'banner': return 'ad_banner';
      case 'card': return 'ad_card';
      case 'popup': return 'ad_popup';
      default: return 'ad_card';
    }
  };

  const getDaysRemaining = (expiresAt: string | null): number | null => {
    if (!expiresAt) return null;
    const now = new Date();
    const expires = new Date(expiresAt);
    if (expires <= now) return 0;
    return Math.ceil((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getStatusBadge = (ad: UserAd) => {
    // Expired
    const daysRemaining = getDaysRemaining(ad.expires_at);
    if (ad.paid_at && daysRemaining === 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-500/10 border border-gray-500/30 text-gray-400 text-xs font-mono rounded">
          <Clock className="w-3 h-3" />
          Expired
        </span>
      );
    }
    
    // If approved but not paid
    if (ad.status === 'approved' && !ad.paid_at) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-brand/10 border border-brand/30 text-brand text-xs font-mono rounded">
          <CreditCard className="w-3 h-3" />
          Payment Required
        </span>
      );
    }
    
    // If approved, paid, and active - show days remaining
    if (ad.status === 'approved' && ad.paid_at && ad.is_active && daysRemaining !== null && daysRemaining > 0) {
      return (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-mono rounded">
            <CheckCircle className="w-3 h-3" />
            Live
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono rounded">
            <Calendar className="w-3 h-3" />
            {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left
          </span>
        </div>
      );
    }
    
    // Pending review
    if (ad.status === 'pending') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-mono rounded">
          <Clock className="w-3 h-3" />
          Pending Review
        </span>
      );
    }
    
    // Rejected
    if (ad.status === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono rounded">
          <XCircle className="w-3 h-3" />
          Rejected
        </span>
      );
    }
    
    return null;
  };

  const getPrice = (adType: string) => {
    return adType === 'banner' ? 49 : 99;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted font-mono">Loading your advertisements...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-surface/50 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-muted hover:text-brand font-mono text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">
                My Advertisements<span className="text-brand">_</span>
              </h1>
              <p className="text-muted font-mono text-sm mt-2">
                Manage your advertisement submissions and payments
              </p>
            </div>
            <Link
              href="/advertise"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand text-dark font-mono text-sm font-medium rounded-lg hover:bg-brand-light transition-all"
            >
              <Plus className="w-4 h-4" />
              New Advertisement
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span className="font-mono text-sm">{error}</span>
            </div>
          </div>
        )}

        {ads.length === 0 ? (
          <div className="bg-surface border border-border rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-brand/10 border border-brand/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-8 h-8 text-brand" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              No advertisements yet
            </h2>
            <p className="text-muted font-mono text-sm mb-8">
              Submit your first advertisement to promote your product or service.
            </p>
            <Link
              href="/advertise"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-dark font-mono text-sm font-medium rounded-lg hover:bg-brand-light transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Advertisement
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {ads.map((ad) => (
              <div key={ad.id} className="space-y-4">
                {/* Ad Info Card */}
                <div
                  className="bg-surface border border-border rounded-xl p-6 hover:border-brand/30 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Ad Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-white truncate">
                          {ad.name}
                        </h3>
                        {getStatusBadge(ad)}
                      </div>
                      <p className="text-muted font-mono text-sm mb-3 line-clamp-2">
                        {ad.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted">
                        <span className="px-2 py-1 bg-surface-light border border-border rounded">
                          {ad.ad_type === 'banner' ? 'Banner Ad' : 'Grid Card Ad'}
                        </span>
                        <span>
                          {ad.company_name}
                        </span>
                        <a
                          href={ad.destination_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-brand hover:text-brand-light transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Destination
                        </a>
                        <span>
                          Submitted {new Date(ad.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 lg:flex-shrink-0">
                      {/* Show edit button for rejected ads */}
                      {ad.status === 'rejected' && (
                        <Link
                          href={`/dashboard/advertisements/edit/${ad.id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border text-white font-mono text-sm rounded-lg hover:border-brand/50 transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit & Resubmit
                        </Link>
                      )}

                      {/* Show payment button for approved but unpaid ads */}
                      {ad.status === 'approved' && !ad.paid_at && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAd(ad);
                            setShowPaymentModal(true);
                            setPaymentError(null);
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand/90 text-dark font-mono text-sm font-medium rounded-lg transition-all"
                        >
                          <CreditCard className="w-4 h-4" />
                          Complete Payment - ${getPrice(ad.ad_type)}
                        </button>
                      )}

                      {/* Show activated badge with days remaining for paid ads */}
                      {ad.paid_at && ad.payment_amount && (
                        <div className="flex flex-col items-center gap-1">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-mono font-medium rounded-lg">
                            <CheckCircle className="w-4 h-4" />
                            Activated
                          </span>
                          {getDaysRemaining(ad.expires_at) !== null && getDaysRemaining(ad.expires_at)! > 0 && (
                            <span className="text-blue-400 text-xs font-mono">
                              {getDaysRemaining(ad.expires_at)} day{getDaysRemaining(ad.expires_at) !== 1 ? 's' : ''} remaining
                            </span>
                          )}
                          {getDaysRemaining(ad.expires_at) === 0 && (
                            <span className="text-gray-400 text-xs font-mono">
                              Expired
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Show rejection reason if rejected */}
                  {ad.status === 'rejected' && (
                    <div className="mt-4 p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                      <p className="text-red-400 font-mono text-xs">
                        <strong>Reason:</strong> {ad.rejection_reason || 'Your advertisement did not meet our guidelines. Please edit and resubmit.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedAd && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-40 pt-8">
          <div className="bg-surface border border-border rounded-xl max-w-lg w-full relative max-h-[80vh] flex flex-col mx-4">
            <button
              onClick={() => {
                setShowPaymentModal(false);
                setSelectedAd(null);
                setPaymentError(null);
              }}
              className="absolute top-4 right-4 text-muted hover:text-white transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1">
              {/* Header Section */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-brand" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white font-mono">
                      {selectedAd.name}
                    </h3>
                    <p className="text-muted text-sm">
                      Complete payment to activate your ad
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefits Section */}
              <div className="p-6 border-b border-border">
                <h4 className="text-sm font-mono text-muted mb-3">// AD_BENEFITS</h4>
                <ul className="text-sm text-white space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand" />
                    7 days visibility on the platform
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand" />
                    {selectedAd.ad_type === 'banner' ? 'Prominent banner placement' : 'Featured card in listings'}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand" />
                    Click tracking and analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand" />
                    Instant activation after approval
                  </li>
                </ul>
              </div>

              {/* Payment Section */}
              <div className="p-6">
                <div className="bg-white rounded-lg p-6 border border-brand/30">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h5 className="text-gray-900 font-semibold">
                        {selectedAd.ad_type === 'banner' ? 'Banner Advertisement' : 'Card Advertisement'}
                      </h5>
                      <p className="text-sm text-gray-600">7 days of visibility</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-brand">${getPrice(selectedAd.ad_type)}</p>
                      <p className="text-xs text-gray-500">one-time</p>
                    </div>
                  </div>

                  {paymentError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                      <p className="text-red-600 text-sm">{paymentError}</p>
                    </div>
                  )}

                  {payingAdId === selectedAd.id ? (
                    <div className="flex items-center justify-center py-4 text-gray-600">
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Processing payment...
                    </div>
                  ) : (
                    <PayPalButton
                      paymentType={getPaymentType(selectedAd.ad_type)}
                      amount={String(getPrice(selectedAd.ad_type))}
                      advertisementId={selectedAd.id}
                      projectName={selectedAd.name}
                      onSuccess={(data) => {
                        handlePaymentSuccess(selectedAd.id, data);
                        setShowPaymentModal(false);
                        setSelectedAd(null);
                      }}
                      onError={(error) => setPaymentError(error)}
                      onCancel={() => setPaymentError('Payment was cancelled. Please try again.')}
                    />
                  )}
                </div>
                
                <p className="text-xs text-muted text-center mt-4">
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
