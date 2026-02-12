import { Metadata } from 'next';
import Link from 'next/link';
import { Code, Star, ArrowRight } from 'lucide-react';
import { getLanguages } from '@/lib/mongodb/queries';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Open Source Projects by Programming Language | OPEN_SRC.ME',
  description: 'Browse open source alternatives organized by programming language. Find the best JavaScript, Python, Go, Rust, TypeScript, and more open source projects.',
  alternates: {
    canonical: 'https://opensrc.me/languages',
  },
};

// Language icons/colors for visual differentiation
const LANGUAGE_COLORS: Record<string, string> = {
  javascript: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  typescript: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  python: 'bg-green-500/10 text-green-400 border-green-500/20',
  go: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  rust: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  java: 'bg-red-500/10 text-red-400 border-red-500/20',
  php: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  ruby: 'bg-red-500/10 text-red-300 border-red-500/20',
  swift: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
  kotlin: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  csharp: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  cpp: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  c: 'bg-gray-500/10 text-gray-300 border-gray-500/20',
  dart: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  elixir: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
  scala: 'bg-red-500/10 text-red-500 border-red-500/20',
  haskell: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  lua: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  shell: 'bg-green-500/10 text-green-300 border-green-500/20',
};

function getLanguageColor(slug: string): string {
  return LANGUAGE_COLORS[slug] || 'bg-brand/10 text-brand border-brand/20';
}

function formatStars(stars: number): string {
  if (stars >= 1000000) return `${(stars / 1000000).toFixed(1)}M`;
  if (stars >= 1000) return `${(stars / 1000).toFixed(1)}k`.replace('.0k', 'k');
  return stars.toString();
}

export default async function LanguagesPage() {
  let languages: Awaited<ReturnType<typeof getLanguages>> = [];
  
  try {
    languages = await getLanguages();
  } catch (error) {
    console.error('Error fetching languages:', error);
  }

  const totalProjects = languages.reduce((sum, l) => sum + l.count, 0);
  const totalStars = languages.reduce((sum, l) => sum + l.totalStars, 0);

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-14 h-14 bg-brand/10 rounded-xl flex items-center justify-center border border-brand/20">
              <Code className="w-7 h-7 text-brand" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-mono text-white">
                languages<span className="text-brand">_</span>
              </h1>
              <p className="text-muted font-mono">
                <span className="text-brand">$</span> Browse open source projects by programming language
              </p>
            </div>
          </div>
          
          {/* Stats bar */}
          <div className="flex flex-wrap gap-4 sm:gap-8 mt-6 font-mono text-sm">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-brand" />
              <span className="text-muted">{languages.length} languages</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted">{totalProjects} projects</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-muted">{formatStars(totalStars)} total stars</span>
            </div>
          </div>
        </div>
      </div>

      {/* Language Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {languages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {languages.map((language) => (
              <Link
                key={language.id}
                href={`/languages/${language.slug}`}
                className="group bg-surface border border-border rounded-xl p-5 hover:border-brand/50 transition-all hover:shadow-lg hover:shadow-brand/5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border font-mono font-bold text-sm ${getLanguageColor(language.slug)}`}>
                      {language.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-lg font-mono font-semibold text-white group-hover:text-brand transition-colors">
                        {language.name}
                      </h2>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted group-hover:text-brand transition-colors" />
                </div>
                <div className="flex items-center gap-4 font-mono text-sm">
                  <span className="text-muted">
                    <span className="text-brand">{language.count}</span> projects
                  </span>
                  <span className="text-muted flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400" />
                    {formatStars(language.totalStars)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface border border-border rounded-lg">
            <Code className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted font-mono mb-4">No languages found yet.</p>
            <Link
              href="/submit"
              className="inline-flex items-center px-6 py-3 bg-brand text-dark font-mono font-medium rounded-lg hover:bg-brand-light transition-colors"
            >
              Submit a Project
            </Link>
          </div>
        )}
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Open Source Projects by Programming Language',
            description: 'Browse open source alternatives organized by programming language.',
            url: 'https://opensrc.me/languages',
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: languages.length,
              itemListElement: languages.map((lang, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: lang.name,
                url: `https://opensrc.me/languages/${lang.slug}`,
              })),
            },
          }),
        }}
      />
    </div>
  );
}
