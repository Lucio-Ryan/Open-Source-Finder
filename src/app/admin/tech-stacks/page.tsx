'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Loader2, 
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Code2
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

interface TechStack {
  id: string;
  name: string;
  slug: string;
  type: string;
  created_at: string;
}

const TYPE_OPTIONS = [
  'Language', 'Framework', 'Library', 'Database', 'Tool', 
  'Platform', 'Runtime', 'Infrastructure', 'Cloud', 'Other'
];

export default function AdminTechStacksPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStack, setEditingStack] = useState<TechStack | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Tool',
  });

  useEffect(() => {
    if (!authLoading && (!user || profile?.role !== 'admin')) {
      router.push('/admin');
    }
  }, [user, profile, authLoading, router]);

  useEffect(() => {
    const fetchTechStacks = async () => {
      try {
        const response = await fetch('/api/admin/tech-stacks');
        if (response.ok) {
          const data = await response.json();
          setTechStacks(data.techStacks || []);
        }
      } catch (error) {
        console.error('Failed to fetch tech stacks:', error);
      } finally {
        setLoading(false);
      }
    };

    if (profile?.role === 'admin') {
      fetchTechStacks();
    }
  }, [profile]);

  const openCreateModal = () => {
    setEditingStack(null);
    setFormData({ name: '', type: 'Tool' });
    setShowModal(true);
  };

  const openEditModal = (stack: TechStack) => {
    setEditingStack(stack);
    setFormData({
      name: stack.name,
      type: stack.type,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name) return;

    setSaving(true);
    try {
      const method = editingStack ? 'PUT' : 'POST';
      const body = editingStack
        ? { id: editingStack.id, ...formData }
        : formData;

      const response = await fetch('/api/admin/tech-stacks', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        if (editingStack) {
          setTechStacks(prev =>
            prev.map(t => t.id === editingStack.id ? data.techStack : t)
          );
        } else {
          setTechStacks(prev => [...prev, data.techStack]);
        }
        setShowModal(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save tech stack');
      }
    } catch (error) {
      console.error('Failed to save tech stack:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tech stack?')) return;

    setDeleting(id);
    try {
      const response = await fetch(`/api/admin/tech-stacks?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTechStacks(prev => prev.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete tech stack:', error);
    } finally {
      setDeleting(null);
    }
  };

  if (authLoading || !user || !profile || profile.role !== 'admin') {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  // Group tech stacks by type
  const groupedStacks = techStacks.reduce((acc, stack) => {
    const type = stack.type || 'Other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(stack);
    return acc;
  }, {} as Record<string, TechStack[]>);

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white font-mono">
                Tech Stacks<span className="text-brand">_</span>
              </h1>
              <p className="text-muted font-mono text-sm mt-2">
                Manage technology stacks and frameworks
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2 bg-brand text-dark rounded-lg font-mono text-sm hover:bg-brand/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Tech Stack
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-brand animate-spin" />
          </div>
        ) : techStacks.length === 0 ? (
          <div className="text-center py-12">
            <Code2 className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted font-mono">No tech stacks found</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedStacks).map(([type, stacks]) => (
              <div key={type}>
                <h2 className="text-lg font-mono text-brand mb-4">// {type}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {stacks.map((stack) => (
                    <div
                      key={stack.id}
                      className="bg-surface border border-border rounded-lg p-4 hover:border-brand/30 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{stack.name}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditModal(stack)}
                            className="p-1 text-muted hover:text-brand transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(stack.id)}
                            disabled={deleting === stack.id}
                            className="p-1 text-muted hover:text-red-400 transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <span className="text-xs text-muted font-mono">/{stack.slug}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white font-mono">
                {editingStack ? 'Edit Tech Stack' : 'New Tech Stack'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-muted hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-mono text-muted mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white placeholder-muted focus:outline-none focus:border-brand transition-colors"
                  placeholder="Tech stack name"
                />
              </div>

              <div>
                <label className="block text-sm font-mono text-muted mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white focus:outline-none focus:border-brand transition-colors"
                >
                  {TYPE_OPTIONS.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-muted hover:text-white border border-border rounded-lg font-mono text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.name}
                className="flex items-center gap-2 px-4 py-2 bg-brand text-dark rounded-lg font-mono text-sm hover:bg-brand/90 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
