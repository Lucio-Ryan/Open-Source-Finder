'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { Loader2, AlertCircle, Save, FileText } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';

interface Policy {
  id: string;
  type: string;
  title: string;
  content: string;
  updated_at: string;
}

export default function PoliciesAdminPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-brand hover:underline',
        },
      }),
      Placeholder.configure({
        placeholder: 'Write your policy content here...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-headings:text-white prose-p:text-muted prose-li:text-muted prose-strong:text-white max-w-none min-h-[500px] focus:outline-none p-4',
      },
    },
  });

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
    const fetchPolicies = async () => {
      try {
        const response = await fetch('/api/policies');
        if (response.ok) {
          const data = await response.json();
          setPolicies(data);
          if (data.length > 0) {
            setSelectedPolicy(data[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch policies:', error);
      } finally {
        setLoading(false);
      }
    };

    if (profile?.role === 'admin') {
      fetchPolicies();
    }
  }, [profile]);

  useEffect(() => {
    if (editor && selectedPolicy) {
      editor.commands.setContent(selectedPolicy.content);
    }
  }, [editor, selectedPolicy]);

  const handleSave = async () => {
    if (!selectedPolicy || !editor) return;

    setSaving(true);
    setMessage(null);

    try {
      const content = editor.getHTML();
      
      // Get auth token from cookie
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];

      if (!token) {
        setMessage({ type: 'error', text: 'Authentication token not found. Please log in again.' });
        setSaving(false);
        return;
      }

      const response = await fetch('/api/policies', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: selectedPolicy.type,
          title: selectedPolicy.title,
          content,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Policy saved successfully!' });
        // Update local state
        setPolicies(prev =>
          prev.map(p =>
            p.type === selectedPolicy.type
              ? { ...p, content, updated_at: new Date().toISOString() }
              : p
          )
        );
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save policy');
      }
    } catch (error) {
      console.error('Error saving policy:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to save policy. Please try again.' 
      });
    } finally {
      setSaving(false);
    }
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
          <p className="text-muted mb-4">You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <FileText className="w-8 h-8" />
            Manage Policies
          </h1>
          <p className="text-muted">Edit your site&apos;s legal policies and terms</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Policy Selection */}
          <div className="lg:col-span-1">
            <div className="bg-dark-lighter rounded-xl border border-border p-4">
              <h2 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
                Select Policy
              </h2>
              <div className="space-y-2">
                {policies.map((policy) => (
                  <button
                    key={policy.type}
                    onClick={() => setSelectedPolicy(policy)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedPolicy?.type === policy.type
                        ? 'bg-brand text-white'
                        : 'bg-dark hover:bg-dark-lighter text-muted hover:text-white'
                    }`}
                  >
                    <div className="font-medium">{policy.title}</div>
                    <div className="text-xs mt-1 opacity-70">
                      {new Date(policy.updated_at).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Editor Area */}
          <div className="lg:col-span-3">
            <div className="bg-dark-lighter rounded-xl border border-border overflow-hidden">
              {/* Toolbar */}
              <div className="bg-dark border-b border-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-white">
                    {selectedPolicy?.title}
                  </h2>
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
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

              {/* Editor Toolbar */}
              {editor && (
                <div className="bg-dark border-b border-border p-2 flex flex-wrap gap-1">
                  <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`px-3 py-1 rounded text-sm ${
                      editor.isActive('bold')
                        ? 'bg-brand text-white'
                        : 'bg-dark-lighter text-muted hover:text-white'
                    }`}
                  >
                    Bold
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`px-3 py-1 rounded text-sm ${
                      editor.isActive('italic')
                        ? 'bg-brand text-white'
                        : 'bg-dark-lighter text-muted hover:text-white'
                    }`}
                  >
                    Italic
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`px-3 py-1 rounded text-sm ${
                      editor.isActive('heading', { level: 1 })
                        ? 'bg-brand text-white'
                        : 'bg-dark-lighter text-muted hover:text-white'
                    }`}
                  >
                    H1
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`px-3 py-1 rounded text-sm ${
                      editor.isActive('heading', { level: 2 })
                        ? 'bg-brand text-white'
                        : 'bg-dark-lighter text-muted hover:text-white'
                    }`}
                  >
                    H2
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`px-3 py-1 rounded text-sm ${
                      editor.isActive('bulletList')
                        ? 'bg-brand text-white'
                        : 'bg-dark-lighter text-muted hover:text-white'
                    }`}
                  >
                    Bullet List
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`px-3 py-1 rounded text-sm ${
                      editor.isActive('orderedList')
                        ? 'bg-brand text-white'
                        : 'bg-dark-lighter text-muted hover:text-white'
                    }`}
                  >
                    Numbered List
                  </button>
                  <button
                    onClick={() => {
                      const url = window.prompt('Enter URL:');
                      if (url) {
                        editor.chain().focus().setLink({ href: url }).run();
                      }
                    }}
                    className={`px-3 py-1 rounded text-sm ${
                      editor.isActive('link')
                        ? 'bg-brand text-white'
                        : 'bg-dark-lighter text-muted hover:text-white'
                    }`}
                  >
                    Link
                  </button>
                </div>
              )}

              {/* Message Banner */}
              {message && (
                <div
                  className={`p-4 ${
                    message.type === 'success'
                      ? 'bg-green-500/10 text-green-400 border-b border-green-500/20'
                      : 'bg-red-500/10 text-red-400 border-b border-red-500/20'
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Editor Content */}
              <div className="bg-dark-lighter">
                <EditorContent editor={editor} />
              </div>
            </div>

            {/* Preview */}
            <div className="mt-6 bg-dark-lighter rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
              <div
                className="prose prose-invert prose-headings:text-white prose-p:text-muted prose-li:text-muted prose-strong:text-white max-w-none"
                dangerouslySetInnerHTML={{
                  __html: editor?.getHTML() || selectedPolicy?.content || '',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
