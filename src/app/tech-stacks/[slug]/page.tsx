import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Code } from 'lucide-react';
import { SearchBar, AlternativesList } from '@/components/ui';
import { getTechStacks, getTechStackBySlug, getAlternativesByTechStack } from '@/lib/mongodb/queries';

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
    const techStack = await getTechStackBySlug(params.slug);
    if (!techStack) return { title: 'Not Found' };

    return {
      title: `${techStack.name} Open Source Alternatives | OS Finder`,
      description: `Discover open source alternatives built with ${techStack.name}`,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return { title: 'Tech Stack | OS Finder' };
  }
}

export default async function TechStackPage({ params }: Props) {
  let techStack: Awaited<ReturnType<typeof getTechStackBySlug>> = null;
  let alternatives: Awaited<ReturnType<typeof getAlternativesByTechStack>> = [];
  
  try {
    [techStack, alternatives] = await Promise.all([
      getTechStackBySlug(params.slug),
      getAlternativesByTechStack(params.slug)
    ]);
  } catch (error) {
    console.error('Error fetching tech stack page data:', error);
  }

  if (!techStack) {
    notFound();
  }

  const techAlternatives = alternatives;

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-surface text-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/tech-stacks"
            className="inline-flex items-center text-muted hover:text-brand mb-4 font-mono"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            cd ../tech-stacks
          </Link>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-14 h-14 bg-surface-light rounded-xl flex items-center justify-center border border-border">
              <Code className="w-7 h-7 text-brand" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-mono">{techStack.name}<span className="text-brand">_</span></h1>
              <p className="text-muted font-mono">
                <span className="text-brand">found:</span> {techAlternatives.length} alternatives
              </p>
            </div>
          </div>
          <div className="max-w-xl">
            <SearchBar placeholder={`Search ${techStack.name} alternatives...`} />
          </div>
        </div>
      </div>

      {/* Alternatives Grid with Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {techAlternatives.length > 0 ? (
          <AlternativesList alternatives={techAlternatives} />
        ) : (
          <div className="text-center py-16 bg-surface border border-border rounded-lg">
            <p className="text-muted mb-4 font-mono"><span className="text-brand">$</span> No alternatives found with this tech stack yet.</p>
            <Link
              href="/submit"
              className="inline-flex items-center px-6 py-3 bg-brand text-dark font-medium rounded-lg hover:bg-brand-dark transition-colors font-mono"
            >
              Submit a Project
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
