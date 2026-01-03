import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { AlternativeCard, SearchBar } from '@/components/ui';
import { getCategoryBySlug, getAlternativesByCategory, getCategories } from '@/lib/supabase/queries';

interface Props {
  params: { slug: string };
}

export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return { title: 'Not Found' };

  return {
    title: `${category.name} Open Source Alternatives | OSS_Finder`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const [category, categoryAlternatives] = await Promise.all([
    getCategoryBySlug(params.slug),
    getAlternativesByCategory(params.slug),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/categories"
            className="inline-flex items-center text-muted hover:text-brand font-mono mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            cd ../categories
          </Link>
          <h1 className="text-3xl font-bold text-white font-mono mb-2">
            {category.name}<span className="text-brand">_</span>
          </h1>
          <p className="text-muted mb-6">
            {category.description}
          </p>
          <div className="max-w-xl">
            <SearchBar placeholder={`Search ${category.name.toLowerCase()} alternatives...`} />
          </div>
        </div>
      </div>

      {/* Alternatives Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted font-mono">
            <span className="text-brand">found:</span> {categoryAlternatives.length} alternatives
          </p>
        </div>

        {categoryAlternatives.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryAlternatives.map((alternative) => (
              <AlternativeCard key={alternative.id} alternative={alternative} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface border border-border rounded-lg">
            <p className="text-muted font-mono mb-4">No alternatives found in this category yet.</p>
            <Link
              href="/submit"
              className="inline-flex items-center px-6 py-3 bg-brand text-dark font-mono font-medium rounded-lg hover:shadow-glow transition-all"
            >
              Submit a Project
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
