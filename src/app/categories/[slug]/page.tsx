import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { SearchBar, AlternativesList } from '@/components/ui';
import { getCategoryBySlug, getAlternativesByCategory, getCategories, getProprietarySoftware } from '@/lib/mongodb/queries';

// Force dynamic rendering to access MongoDB at runtime
export const dynamic = 'force-dynamic';
// Allow dynamic paths not generated at build time
export const dynamicParams = true;

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  // Return empty array to skip static generation - all pages will be dynamically rendered
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const category = await getCategoryBySlug(params.slug);
    if (!category) return { title: 'Not Found' };

    return {
      title: `${category.name} Open Source Alternatives | OS Finder`,
      description: category.description,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return { title: 'Category | OS Finder' };
  }
}

export default async function CategoryPage({ params }: Props) {
  let category: Awaited<ReturnType<typeof getCategoryBySlug>> = null;
  let categoryAlternatives: Awaited<ReturnType<typeof getAlternativesByCategory>> = [];
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let proprietarySoftware: Awaited<ReturnType<typeof getProprietarySoftware>> = [];
  
  try {
    [category, categoryAlternatives, categories, proprietarySoftware] = await Promise.all([
      getCategoryBySlug(params.slug),
      getAlternativesByCategory(params.slug),
      getCategories(),
      getProprietarySoftware(),
    ]);
  } catch (error) {
    console.error('Error fetching category page data:', error);
  }

  if (!category) {
    notFound();
  }

  // Transform to simpler format for the client component
  const simplifiedCategories = categories.map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));

  const simplifiedProprietary = proprietarySoftware.map(s => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
  }));

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

      {/* Alternatives Grid with Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {categoryAlternatives.length > 0 ? (
          <AlternativesList 
            alternatives={categoryAlternatives}
            categories={simplifiedCategories}
            proprietarySoftware={simplifiedProprietary}
          />
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
