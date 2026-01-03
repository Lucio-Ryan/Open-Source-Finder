'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Shield, 
  Loader2, 
  LogOut, 
  Layers, 
  Tags, 
  Code2, 
  FileCheck, 
  Users,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

interface DashboardStats {
  totalAlternatives: number;
  pendingSubmissions: number;
  totalCategories: number;
  totalTechStacks: number;
  totalUsers: number;
}

export default function AdminDashboardPage() {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (profile?.role === 'admin') {
      fetchStats();
    }
  }, [profile]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (authLoading || !user || !profile) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  if (profile.role !== 'admin') {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-muted mb-4">You don&apos;t have permission to access the admin dashboard.</p>
          <Link href="/dashboard" className="text-brand hover:underline">
            Go to your dashboard
          </Link>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      href: '/admin/submissions',
      icon: FileCheck,
      label: 'Submissions',
      description: 'Review and approve pending submissions',
      count: stats?.pendingSubmissions,
      highlight: true,
    },
    {
      href: '/admin/categories',
      icon: Layers,
      label: 'Categories',
      description: 'Manage alternative categories',
      count: stats?.totalCategories,
    },
    {
      href: '/admin/tech-stacks',
      icon: Code2,
      label: 'Tech Stacks',
      description: 'Manage technology stacks',
      count: stats?.totalTechStacks,
    },
    {
      href: '/admin/tags',
      icon: Tags,
      label: 'Tags',
      description: 'Manage tags for alternatives',
    },
    {
      href: '/admin/users',
      icon: Users,
      label: 'Users',
      description: 'Manage user accounts and roles',
      count: stats?.totalUsers,
    },
  ];

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-red-400 font-mono text-sm mb-1">// ADMIN DASHBOARD</p>
                <h1 className="text-3xl font-bold text-white font-mono">
                  Admin Panel<span className="text-brand">_</span>
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="px-4 py-2 text-muted hover:text-white border border-border hover:border-brand/50 rounded-lg font-mono text-sm transition-colors"
              >
                User Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-muted hover:text-white border border-border hover:border-red-500/50 rounded-lg font-mono text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-surface border border-border rounded-xl p-5">
            <p className="text-muted font-mono text-sm">Total Alternatives</p>
            <p className="text-3xl font-bold text-white mt-1">
              {loading ? '...' : stats?.totalAlternatives || 0}
            </p>
          </div>
          <div className="bg-surface border border-yellow-500/30 rounded-xl p-5">
            <p className="text-yellow-400 font-mono text-sm">Pending Review</p>
            <p className="text-3xl font-bold text-yellow-400 mt-1">
              {loading ? '...' : stats?.pendingSubmissions || 0}
            </p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-5">
            <p className="text-muted font-mono text-sm">Categories</p>
            <p className="text-3xl font-bold text-white mt-1">
              {loading ? '...' : stats?.totalCategories || 0}
            </p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-5">
            <p className="text-muted font-mono text-sm">Tech Stacks</p>
            <p className="text-3xl font-bold text-white mt-1">
              {loading ? '...' : stats?.totalTechStacks || 0}
            </p>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group bg-surface border rounded-xl p-6 hover:border-brand/50 transition-all ${
                item.highlight && stats?.pendingSubmissions ? 'border-yellow-500/50' : 'border-border'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  item.highlight && stats?.pendingSubmissions
                    ? 'bg-yellow-500/20'
                    : 'bg-brand/10'
                }`}>
                  <item.icon className={`w-6 h-6 ${
                    item.highlight && stats?.pendingSubmissions
                      ? 'text-yellow-400'
                      : 'text-brand'
                  }`} />
                </div>
                {item.count !== undefined && (
                  <span className={`px-3 py-1 rounded-full text-sm font-mono ${
                    item.highlight && stats?.pendingSubmissions
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-surface border border-border text-muted'
                  }`}>
                    {item.count}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-brand transition-colors mb-2">
                {item.label}
              </h3>
              <p className="text-muted text-sm mb-4">{item.description}</p>
              <div className="flex items-center text-brand text-sm font-mono">
                Manage
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
