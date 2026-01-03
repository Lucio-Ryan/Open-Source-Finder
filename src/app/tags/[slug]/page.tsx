import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Tag } from 'lucide-react';
import { AlternativeCard, SearchBar } from '@/components/ui';
import { getTags, getTagBySlug, getAlternativesByTag } from '@/lib/supabase/queries';

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const tags = await getTags();
  return tags.map((tag) => ({
    slug: tag.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = await getTagBySlug(params.slug);
  if (!tag) return { title: 'Not Found' };

  return {
    title: `${tag.name} Open Source Alternatives | OSS_Finder`,
    description: `Discover open source alternatives tagged with ${tag.name}`,
  };
}

export default async function TagPage({ params }: Props) {
  const [tag, tagAlternatives] = await Promise.all([
    getTagBySlug(params.slug),
    getAlternativesByTag(params.slug)
  ]);

  if (!tag) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/alternatives"
            className="inline-flex items-center font-mono text-muted hover:text-brand mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            cd ../tags
          </Link>
          <div className="flex items-center space-x-3 mb-2">
            <Tag className="w-6 h-6 text-brand" />
            <h1 className="text-3xl font-bold font-mono text-white">
              <span className="text-brand">#</span>{tag.name}<span className="text-brand">_</span>
            </h1>
          </div>
          <p className="font-mono text-muted mb-6">
            <span className="text-brand">found:</span> {tagAlternatives.length} alternatives
          </p>
          <div className="max-w-xl">
            <SearchBar placeholder={`Search ${tag.name.toLowerCase()} alternatives...`} />
          </div>
        </div>
      </div>

      {/* Alternatives Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tagAlternatives.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tagAlternatives.map((alternative) => (
              <AlternativeCard key={alternative.id} alternative={alternative} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface border border-border rounded-lg">
            <p className="font-mono text-muted mb-4">No alternatives found with this tag yet.</p>
            <Link
              href="/submit"
              className="inline-flex items-center px-6 py-3 bg-brand text-white font-mono font-medium rounded-lg hover:bg-brand/90 transition-colors"
            >
              Submit a Project
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
