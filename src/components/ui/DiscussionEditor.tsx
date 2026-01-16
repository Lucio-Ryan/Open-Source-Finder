'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Code, Undo, Redo } from 'lucide-react';

interface DiscussionEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minHeight?: string;
}

export default function DiscussionEditor({ 
  content, 
  onChange, 
  placeholder = 'Start typing...', 
  disabled = false,
  minHeight = '100px'
}: DiscussionEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false, // Disable headings for comments
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-brand hover:text-brand-light underline',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm max-w-none focus:outline-none px-4 py-3 text-white font-mono text-sm',
        style: `min-height: ${minHeight}`,
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable: !disabled,
  });

  const addLink = () => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL (include https://)', previousUrl || '');
    
    if (url === null) return;
    
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // Ensure URL has a protocol
    let finalUrl = url;
    if (!/^https?:\/\//i.test(url) && !url.startsWith('/')) {
      finalUrl = 'https://' + url;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: finalUrl }).run();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-border rounded-lg bg-dark overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-2 border-b border-border bg-surface/50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
          className={`p-1.5 rounded hover:bg-dark transition-colors ${
            editor.isActive('bold') ? 'bg-brand/20 text-brand' : 'text-muted hover:text-white'
          } disabled:opacity-30 disabled:cursor-not-allowed`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
          className={`p-1.5 rounded hover:bg-dark transition-colors ${
            editor.isActive('italic') ? 'bg-brand/20 text-brand' : 'text-muted hover:text-white'
          } disabled:opacity-30 disabled:cursor-not-allowed`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={disabled}
          className={`p-1.5 rounded hover:bg-dark transition-colors ${
            editor.isActive('code') ? 'bg-brand/20 text-brand' : 'text-muted hover:text-white'
          } disabled:opacity-30 disabled:cursor-not-allowed`}
          title="Inline Code"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-border mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
          className={`p-1.5 rounded hover:bg-dark transition-colors ${
            editor.isActive('bulletList') ? 'bg-brand/20 text-brand' : 'text-muted hover:text-white'
          } disabled:opacity-30 disabled:cursor-not-allowed`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
          className={`p-1.5 rounded hover:bg-dark transition-colors ${
            editor.isActive('orderedList') ? 'bg-brand/20 text-brand' : 'text-muted hover:text-white'
          } disabled:opacity-30 disabled:cursor-not-allowed`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-border mx-1" />

        <button
          type="button"
          onClick={addLink}
          disabled={disabled}
          className={`p-1.5 rounded hover:bg-dark transition-colors ${
            editor.isActive('link') ? 'bg-brand/20 text-brand' : 'text-muted hover:text-white'
          } disabled:opacity-30 disabled:cursor-not-allowed`}
          title="Add Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <div className="flex-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={disabled || !editor.can().undo()}
          className="p-1.5 rounded hover:bg-dark transition-colors text-muted hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={disabled || !editor.can().redo()}
          className="p-1.5 rounded hover:bg-dark transition-colors text-muted hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
