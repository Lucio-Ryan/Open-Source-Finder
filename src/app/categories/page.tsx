import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, FolderOpen } from 'lucide-react';
import { CategoryCard } from '@/components/ui';
import { getCategories } from '@/lib/mongodb/queries';

export const metadata: Metadata = {
  title: 'Browse Open Source Software by Category',
  description: 'Explore open source alternatives organized by category. Find free tools for project management, communication, design, development, business software, and 50+ other categories.',
  alternates: {
    canonical: '/categories',
  },
};

// Enable ISR - revalidate every 60 seconds
export const revalidate = 60;

export default async function CategoriesPage() {
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  
  try {
    categories = await getCategories();
  } catch (error) {
    console.error('Error fetching categories page data:', error);
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-surface/50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Link
            href="/"
            className="inline-flex items-center text-muted hover:text-brand font-mono text-xs sm:text-sm mb-3 sm:mb-4 transition-colors touch-manipulation py-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            cd ../home
          </Link>
          <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
            <FolderOpen className="w-6 h-6 sm:w-8 sm:h-8 text-brand" />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              Categories<span className="text-brand">_</span>
            </h1>
          </div>
          <p className="text-muted font-mono text-xs sm:text-sm">
            <span className="text-brand">$</span> ls -la /categories | sort
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
}
