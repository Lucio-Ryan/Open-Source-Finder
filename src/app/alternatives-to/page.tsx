import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SearchBar } from '@/components/ui';
import { getProprietarySoftware } from '@/lib/mongodb/queries';

// Force dynamic rendering to access MongoDB at runtime
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'All Proprietary Software | OS_Finder',
  description: 'Browse all proprietary software and discover their open source alternatives.',
};

export default async function AllProprietarySoftwarePage() {
  const proprietarySoftware = await getProprietarySoftware();

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-brand font-mono text-sm mb-3">// PROPRIETARY_SOFTWARE</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Find Alternatives to<span className="text-brand">_</span>
          </h1>
          <p className="text-muted font-mono max-w-2xl mb-8">
            Browse popular proprietary software and discover their open source replacements.
          </p>
          
          <div className="max-w-xl">
            <SearchBar placeholder="Search proprietary software..." />
          </div>
        </div>
      </div>

      {/* Software Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <p className="text-muted font-mono text-sm">
            {proprietarySoftware.length} proprietary software listed
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {proprietarySoftware.map((software) => (
            <Link
              key={software.slug}
              href={`/alternatives-to/${software.slug}`}
              className="group p-5 bg-surface border border-border rounded-xl hover:border-brand/50 transition-all"
            >
              <div className="mb-3">
                <h3 className="font-semibold text-white group-hover:text-brand transition-colors truncate">
                  {software.name}
                </h3>
              </div>
              <p className="text-sm text-muted line-clamp-2 mb-3 font-mono">
                {software.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-brand">
                  {software.alternative_count} {software.alternative_count === 1 ? 'alternative' : 'alternatives'}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {proprietarySoftware.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted font-mono">No proprietary software found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
