'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Loader2, 
  Trash2,
  Users,
  Shield,
  User,
  Crown
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: 'user' | 'admin' | 'moderator';
  created_at: string;
}

export default function AdminUsersPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || profile?.role !== 'admin')) {
      router.push('/admin');
    }
  }, [user, profile, authLoading, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users || []);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    if (profile?.role === 'admin') {
      fetchUsers();
    }
  }, [profile]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setActionLoading(userId);
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role: newRole }),
      });

      if (response.ok) {
        setUsers(prev =>
          prev.map(u => u.id === userId ? { ...u, role: newRole as any } : u)
        );
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update role');
      }
    } catch (error) {
      console.error('Failed to update role:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to delete user ${email}? This cannot be undone.`)) return;

    setActionLoading(userId);
    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(prev => prev.filter(u => u.id !== userId));
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-red-400" />;
      case 'moderator':
        return <Shield className="w-4 h-4 text-yellow-400" />;
      default:
        return <User className="w-4 h-4 text-muted" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/20 text-red-400';
      case 'moderator':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-surface text-muted';
    }
  };

  if (authLoading || !user || !profile || profile.role !== 'admin') {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/admin"
            className="inline-flex items-center text-muted hover:text-brand font-mono text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Link>
          <h1 className="text-3xl font-bold text-white font-mono">
            Users<span className="text-brand">_</span>
          </h1>
          <p className="text-muted font-mono text-sm mt-2">
            Manage user accounts and roles
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-brand animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted font-mono">No users found</p>
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-dark/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-mono text-muted uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-mono text-muted uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-mono text-muted uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-mono text-muted uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((userItem) => (
                  <tr key={userItem.id} className="hover:bg-dark/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center">
                          {getRoleIcon(userItem.role)}
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {userItem.name || 'Unnamed User'}
                            {userItem.id === user.id && (
                              <span className="ml-2 text-xs text-brand">(you)</span>
                            )}
                          </p>
                          <p className="text-sm text-muted">{userItem.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={userItem.role}
                        onChange={(e) => handleRoleChange(userItem.id, e.target.value)}
                        disabled={userItem.id === user.id || actionLoading === userItem.id}
                        className={`px-3 py-1.5 rounded-lg text-sm font-mono border-0 focus:outline-none focus:ring-2 focus:ring-brand/50 ${getRoleBadgeColor(userItem.role)} ${
                          userItem.id === user.id ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                        }`}
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">
                      {new Date(userItem.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(userItem.id, userItem.email)}
                        disabled={userItem.id === user.id || actionLoading === userItem.id}
                        className="p-2 text-muted hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={userItem.id === user.id ? 'Cannot delete yourself' : 'Delete user'}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
