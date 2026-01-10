'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Eye, 
  EyeOff,
  Trash2,
  ExternalLink,
  Filter,
  RefreshCcw,
  Megaphone
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import type { Advertisement, AdType, AdStatus } from '@/types/database';

export default function AdminAdvertisementsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<AdStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<AdType | 'all'>('all');
  const [rejectionModal, setRejectionModal] = useState<{ id: string; name: string } | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (!authLoading && profile && profile.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
  }, [user, profile, authLoading, router]);

  const fetchAdvertisements = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (typeFilter !== 'all') params.set('type', typeFilter);
      
      const response = await fetch(`/api/admin/advertisements?${params}`);
      if (response.ok) {
        const data = await response.json();
        setAdvertisements(data.advertisements || []);
      }
    } catch (error) {
      console.error('Failed to fetch advertisements:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchAdvertisements();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, statusFilter, typeFilter]);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      const response = await fetch('/api/admin/advertisements', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'approve' }),
      });
      
      if (response.ok) {
        await fetchAdvertisements();
      }
    } catch (error) {
      console.error('Failed to approve:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectionModal) return;
    
    setActionLoading(rejectionModal.id);
    try {
      const response = await fetch('/api/admin/advertisements', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: rejectionModal.id, 
          action: 'reject',
          rejection_reason: rejectionReason || 'No reason provided'
        }),
      });
      
      if (response.ok) {
        await fetchAdvertisements();
        setRejectionModal(null);
        setRejectionReason('');
      }
    } catch (error) {
      console.error('Failed to reject:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleActive = async (id: string, currentlyActive: boolean) => {
    setActionLoading(id);
    try {
      const response = await fetch('/api/admin/advertisements', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id, 
          action: currentlyActive ? 'deactivate' : 'activate' 
        }),
      });
      
      if (response.ok) {
        await fetchAdvertisements();
      }
    } catch (error) {
      console.error('Failed to toggle active:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this advertisement?')) return;
    
    setActionLoading(id);
    try {
      const response = await fetch(`/api/admin/advertisements?id=${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await fetchAdvertisements();
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: AdStatus) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      approved: 'bg-green-500/20 text-green-400 border-green-500/30',
      rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return (
      <span className={`px-2 py-1 text-xs font-mono rounded border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const getTypeBadge = (type: AdType) => {
    const styles = {
      banner: 'bg-brand/20 text-brand border-brand/30',
      popup: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      card: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    };
    return (
      <span className={`px-2 py-1 text-xs font-mono rounded border ${styles[type]}`}>
        {type}
      </span>
    );
  };

  if (authLoading || !user || !profile) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  if (profile.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/admin"
            className="inline-flex items-center text-muted hover:text-brand font-mono text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            cd ../admin
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand/20 rounded-xl flex items-center justify-center">
                <Megaphone className="w-6 h-6 text-brand" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white font-mono">
                  Advertisements<span className="text-brand">_</span>
                </h1>
                <p className="text-muted font-mono text-sm">
                  Manage and approve advertisement submissions
                </p>
              </div>
            </div>
            <button
              onClick={fetchAdvertisements}
              className="flex items-center gap-2 px-4 py-2 text-muted hover:text-white border border-border hover:border-brand/50 rounded-lg font-mono text-sm transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted" />
            <span className="text-muted font-mono text-sm">Filters:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AdStatus | 'all')}
            className="px-3 py-2 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as AdType | 'all')}
            className="px-3 py-2 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
          >
            <option value="all">All Types</option>
            <option value="banner">Banner</option>
            <option value="popup">Popup</option>
            <option value="card">Card</option>
          </select>
        </div>

        {/* Advertisements List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand animate-spin" />
          </div>
        ) : advertisements.length === 0 ? (
          <div className="text-center py-20">
            <Megaphone className="w-16 h-16 text-muted/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No Advertisements</h2>
            <p className="text-muted font-mono text-sm">
              {statusFilter !== 'all' || typeFilter !== 'all' 
                ? 'No advertisements match your filters.'
                : 'No advertisement submissions yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {advertisements.map((ad) => (
              <div
                key={ad.id}
                className="bg-surface border border-border rounded-xl p-6 hover:border-brand/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Ad Info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {ad.company_logo || ad.icon_url ? (
                      <Image
                        src={ad.company_logo || ad.icon_url!}
                        alt={ad.company_name}
                        width={48}
                        height={48}
                        className="rounded-lg border border-border"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-brand/10 border border-brand/20 rounded-lg flex items-center justify-center text-brand font-bold">
                        {ad.company_name.charAt(0)}
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-white">{ad.company_name}</h3>
                        {getTypeBadge(ad.ad_type)}
                        {getStatusBadge(ad.status)}
                        {ad.is_active && ad.status === 'approved' && (
                          <span className="px-2 py-1 text-xs font-mono rounded border bg-green-500/10 text-green-400 border-green-500/20">
                            LIVE
                          </span>
                        )}
                      </div>
                      <p className="text-muted text-sm font-mono mb-2">{ad.name}</p>
                      <p className="text-muted/80 text-sm line-clamp-2">{ad.description}</p>
                      
                      <div className="flex items-center gap-4 mt-3 text-xs font-mono text-muted/60">
                        <span>Email: {ad.submitter_email}</span>
                        <a 
                          href={ad.destination_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-brand hover:underline"
                        >
                          View Landing <ExternalLink className="w-3 h-3" />
                        </a>
                        <span>Created: {new Date(ad.created_at).toLocaleDateString()}</span>
                      </div>
                      
                      {ad.rejection_reason && (
                        <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs font-mono">
                          Rejection reason: {ad.rejection_reason}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {ad.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(ad.id)}
                          disabled={actionLoading === ad.id}
                          className="flex items-center gap-1 px-3 py-2 bg-green-500/10 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/20 transition-colors disabled:opacity-50"
                        >
                          {actionLoading === ad.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          <span className="text-sm font-mono">Approve</span>
                        </button>
                        <button
                          onClick={() => setRejectionModal({ id: ad.id, name: ad.name })}
                          disabled={actionLoading === ad.id}
                          className="flex items-center gap-1 px-3 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" />
                          <span className="text-sm font-mono">Reject</span>
                        </button>
                      </>
                    )}
                    
                    {ad.status === 'approved' && (
                      <button
                        onClick={() => handleToggleActive(ad.id, ad.is_active)}
                        disabled={actionLoading === ad.id}
                        className={`flex items-center gap-1 px-3 py-2 border rounded-lg transition-colors disabled:opacity-50 ${
                          ad.is_active 
                            ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/20'
                            : 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20'
                        }`}
                      >
                        {actionLoading === ad.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : ad.is_active ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                        <span className="text-sm font-mono">
                          {ad.is_active ? 'Deactivate' : 'Activate'}
                        </span>
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDelete(ad.id)}
                      disabled={actionLoading === ad.id}
                      className="flex items-center gap-1 px-3 py-2 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors disabled:opacity-50"
                    >
                      {actionLoading === ad.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {rejectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Reject Advertisement<span className="text-brand">_</span>
            </h3>
            <p className="text-muted text-sm mb-4">
              Rejecting: <span className="text-white">{rejectionModal.name}</span>
            </p>
            <div className="mb-4">
              <label className="block text-sm font-mono text-muted mb-2">
                Rejection Reason
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                placeholder="Provide a reason for rejection..."
                className="w-full px-3 py-2 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 resize-none"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setRejectionModal(null);
                  setRejectionReason('');
                }}
                className="px-4 py-2 text-muted hover:text-white border border-border rounded-lg font-mono text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading === rejectionModal.id}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg font-mono text-sm hover:bg-red-500/30 transition-colors disabled:opacity-50"
              >
                {actionLoading === rejectionModal.id && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
