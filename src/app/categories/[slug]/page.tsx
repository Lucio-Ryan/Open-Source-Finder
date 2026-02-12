import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { SearchBar, AlternativesList, Breadcrumbs } from '@/components/ui';
import { getCategoryBySlug, getAlternativesByCategory, getCategories, getProprietarySoftware } from '@/lib/mongodb/queries';
import { generateCategoryMetadata } from '@/lib/seo/metadata';
import { buildCategoryPageSchemas } from '@/lib/seo/structured-data';

// Enable ISR - revalidate every 60 seconds
export const revalidate = 60;
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

    return generateCategoryMetadata({
      name: category.name,
      slug: category.slug,
      description: category.description,
      count: category.count,
    });
  } catch (error) {
    console.error('Error generating metadata:', error);
    return { title: 'Category | OPEN_SRC.ME' };
  }
}

export default async function CategoryPage({ params }: Props) {
  let category: Awaited<ReturnType<typeof getCategoryBySlug>> = null;
  let categoryAlternatives: Awaited<ReturnType<typeof getAlternativesByCategory>> = [];
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let proprietarySoftware: Awaited<ReturnType<typeof getProprietarySoftware>> = [];
  
  // Use Promise.allSettled to ensure one failure doesn't affect others
  const results = await Promise.allSettled([
    getCategoryBySlug(params.slug),
    getAlternativesByCategory(params.slug),
    getCategories(),
    getProprietarySoftware(),
  ]);
  
  if (results[0].status === 'fulfilled') {
    category = results[0].value;
  } else {
    console.error('Error fetching category:', results[0].reason);
  }
  
  if (results[1].status === 'fulfilled') {
    categoryAlternatives = results[1].value;
  } else {
    console.error('Error fetching category alternatives:', results[1].reason);
  }
  
  if (results[2].status === 'fulfilled') {
    categories = results[2].value;
  } else {
    console.error('Error fetching categories:', results[2].reason);
  }
  
  if (results[3].status === 'fulfilled') {
    proprietarySoftware = results[3].value;
  } else {
    console.error('Error fetching proprietary software:', results[3].reason);
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

  // Build structured data
  const schemas = buildCategoryPageSchemas({
    name: category.name,
    slug: category.slug,
    description: category.description,
    alternatives: categoryAlternatives.map(alt => ({
      name: alt.name,
      slug: alt.slug,
      description: alt.short_description || alt.description?.replace(/<[^>]*>/g, '').slice(0, 150),
      icon_url: alt.icon_url,
    })),
  });

  return (
    <div className="min-h-screen bg-dark">
      {/* JSON-LD Structured Data */}
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <div className="mb-3">
            <Breadcrumbs items={[
              { label: 'categories', href: '/categories' },
              { label: category.slug, href: `/categories/${category.slug}` },
            ]} />
          </div>
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
          <p className="text-muted mb-2">
            {category.description}
          </p>
          <p className="text-sm text-muted font-mono mb-6">
            <span className="text-brand">found:</span> {categoryAlternatives.length} open source alternatives
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
