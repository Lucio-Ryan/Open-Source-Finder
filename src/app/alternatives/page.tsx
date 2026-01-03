import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Filter, Terminal } from 'lucide-react';
import { AlternativeCard, SearchBar } from '@/components/ui';
import { getAlternatives } from '@/lib/supabase/queries';

export const metadata: Metadata = {
  title: 'All Open Source Alternatives | OSS_Finder',
  description: 'Browse all open source alternatives to proprietary software. Filter by category, tags, and more.',
};

export const revalidate = 60;

export default async function AlternativesPage() {
  const alternatives = await getAlternatives({ approved: true, sortBy: 'health_score' });

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-surface/50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/"
            className="inline-flex items-center text-muted hover:text-brand font-mono text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            cd ../home
          </Link>
          <div className="flex items-center space-x-3 mb-2">
            <Terminal className="w-8 h-8 text-brand" />
            <h1 className="text-3xl font-bold text-white">
              All Alternatives<span className="text-brand">_</span>
            </h1>
          </div>
          <p className="text-muted font-mono text-sm mb-6">
            <span className="text-brand">$</span> Browse {alternatives.length}+ curated open source alternatives
          </p>
          <div className="max-w-xl">
            <SearchBar placeholder="Search alternatives..." />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-surface rounded-xl border border-border p-6 sticky top-24">
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="w-5 h-5 text-brand" />
                <h2 className="font-mono text-white">// Filters</h2>
              </div>
              
              <div className="space-y-6">
                {/* Sort By */}
                <div>
                  <label className="block text-xs font-mono text-muted mb-2">
                    Sort By
                  </label>
                  <select className="w-full px-3 py-2.5 bg-dark border border-border rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50">
                    <option value="healthScore">Health Score</option>
                    <option value="stars">GitHub Stars</option>
                    <option value="recent">Recently Updated</option>
                    <option value="name">Name (A-Z)</option>
                  </select>
                </div>

                {/* Self-Hosted */}
                <div>
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-border bg-dark text-brand focus:ring-brand/50"
                    />
                    <span className="text-sm font-mono text-muted group-hover:text-white transition-colors">Self-Hosted Only</span>
                  </label>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-mono text-muted mb-2">
                    Popular Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['self-hosted', 'privacy-focused', 'ai-powered'].map((tag) => (
                      <button
                        key={tag}
                        className="px-2 py-1 text-xs font-mono bg-dark border border-border text-muted rounded hover:border-brand/30 hover:text-brand transition-colors"
                      >
                        #{tag.replace('-', '_')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted font-mono text-sm">
                <span className="text-brand">found:</span> {alternatives.length} alternatives
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {alternatives.map((alternative) => (
                <AlternativeCard key={alternative.id} alternative={alternative} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
