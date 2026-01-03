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
  AlertCircle,
  X,
  Save,
  Layers
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  created_at: string;
}

const ICON_OPTIONS = [
  'Folder', 'Code', 'Database', 'Server', 'Globe', 'Lock', 'Shield',
  'Zap', 'MessageSquare', 'Mail', 'Calendar', 'FileText', 'Image',
  'Video', 'Music', 'Headphones', 'Camera', 'Monitor', 'Smartphone',
  'Tablet', 'Laptop', 'Cloud', 'Download', 'Upload', 'RefreshCw',
  'Settings', 'Sliders', 'Terminal', 'Box', 'Package', 'Archive',
  'Bookmark', 'Heart', 'Star', 'Users', 'User', 'Building', 'Home',
  'Map', 'Navigation', 'Compass', 'Clock', 'Bell', 'Search', 'Filter'
];

export default function AdminCategoriesPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'Folder',
  });

  useEffect(() => {
    if (!authLoading && (!user || profile?.role !== 'admin')) {
      router.push('/admin');
    }
  }, [user, profile, authLoading, router]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    if (profile?.role === 'admin') {
      fetchCategories();
    }
  }, [profile]);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', icon: 'Folder' });
    setShowModal(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.description) return;

    setSaving(true);
    try {
      const method = editingCategory ? 'PUT' : 'POST';
      const body = editingCategory
        ? { id: editingCategory.id, ...formData }
        : formData;

      const response = await fetch('/api/admin/categories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        if (editingCategory) {
          setCategories(prev =>
            prev.map(c => c.id === editingCategory.id ? data.category : c)
          );
        } else {
          setCategories(prev => [...prev, data.category]);
        }
        setShowModal(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save category');
      }
    } catch (error) {
      console.error('Failed to save category:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    setDeleting(id);
    try {
      const response = await fetch(`/api/admin/categories?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCategories(prev => prev.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
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
                Categories<span className="text-brand">_</span>
              </h1>
              <p className="text-muted font-mono text-sm mt-2">
                Manage alternative categories
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2 bg-brand text-dark rounded-lg font-mono text-sm hover:bg-brand/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-brand animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <Layers className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted font-mono">No categories found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-surface border border-border rounded-xl p-5 hover:border-brand/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center">
                    <Layers className="w-5 h-5 text-brand" />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(category)}
                      className="p-2 text-muted hover:text-brand transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      disabled={deleting === category.id}
                      className="p-2 text-muted hover:text-red-400 transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold text-white mb-1">{category.name}</h3>
                <p className="text-muted text-sm line-clamp-2">{category.description}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted font-mono">
                  <span>Icon: {category.icon}</span>
                  <span>•</span>
                  <span>/{category.slug}</span>
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
                {editingCategory ? 'Edit Category' : 'New Category'}
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
                  placeholder="Category name"
                />
              </div>

              <div>
                <label className="block text-sm font-mono text-muted mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white placeholder-muted focus:outline-none focus:border-brand transition-colors resize-none"
                  placeholder="Category description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-mono text-muted mb-2">Icon</label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white focus:outline-none focus:border-brand transition-colors"
                >
                  {ICON_OPTIONS.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
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
                disabled={saving || !formData.name || !formData.description}
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
