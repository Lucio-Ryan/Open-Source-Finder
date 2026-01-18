import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { AlternativeCard, SearchBar } from '@/components/ui';
import { getProprietarySoftware, getProprietaryBySlug, getAlternativesFor } from '@/lib/mongodb/queries';

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  try {
    // Skip static generation if MONGODB_URI is not available (e.g., during build)
    if (!process.env.MONGODB_URI) {
      return [];
    }
    const software = await getProprietarySoftware();
    return software.map((s) => ({
      slug: s.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const software = await getProprietaryBySlug(params.slug);
  if (!software) return { title: 'Not Found' };

  return {
    title: `Open Source Alternatives to ${software.name} | OS_Finder`,
    description: `Discover the best open source alternatives to ${software.name}. ${software.description}`,
  };
}

export default async function AlternativesToPage({ params }: Props) {
  const [software, alternatives] = await Promise.all([
    getProprietaryBySlug(params.slug),
    getAlternativesFor(params.slug)
  ]);

  if (!software) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/alternatives"
            className="inline-flex items-center text-muted hover:text-brand mb-4 font-mono"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            cd ../alternatives
          </Link>
          <h1 className="text-4xl font-bold font-mono text-white mb-4">
            alternatives_to/<span className="text-orange-400">{software.name}</span><span className="text-brand">_</span>
          </h1>
          <p className="text-muted max-w-2xl mb-6 font-mono">
            {software.description}
          </p>
          <div className="max-w-xl">
            <SearchBar placeholder={`Search alternatives to ${software.name}...`} />
          </div>
        </div>
      </div>

      {/* Alternatives Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted font-mono">
            <span className="text-brand">found:</span> <span className="text-white">{alternatives.length}</span> open source alternatives
          </p>
        </div>

        {alternatives.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alternatives.map((alternative) => (
              <AlternativeCard key={alternative.id} alternative={alternative} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface rounded-xl border border-border">
            <p className="text-muted mb-4 font-mono">// no alternatives found for {software.name} yet</p>
            <Link
              href="/submit"
              className="inline-flex items-center px-6 py-3 bg-brand text-white font-medium rounded-lg hover:bg-brand/90 transition-colors font-mono"
            >
              submit_alternative
            </Link>
          </div>
        )}

        {/* Other Proprietary Software */}
        <OtherProprietarySoftware currentSlug={software.slug} />
      </div>
    </div>
  );
}

async function OtherProprietarySoftware({ currentSlug }: { currentSlug: string }) {
  const allSoftware = await getProprietarySoftware();
  const otherSoftware = allSoftware.filter((s) => s.slug !== currentSlug);

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-white mb-6 font-mono">
        <span className="text-muted">// other_proprietary</span>
      </h2>
      <div className="flex flex-wrap gap-3">
        {otherSoftware.map((s) => (
          <Link
            key={s.id}
            href={`/alternatives-to/${s.slug}`}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-muted hover:border-brand hover:text-orange-400 transition-colors font-mono"
          >
            {s.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
