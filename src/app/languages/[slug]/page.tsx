import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Code, Star, GitFork } from 'lucide-react';
import { SearchBar, AlternativesList } from '@/components/ui';
import { getLanguageBySlug, getAlternativesByLanguage, getLanguages, getCategories } from '@/lib/mongodb/queries';
import { generateLanguageMetadata } from '@/lib/seo/metadata';
import { buildLanguagePageSchemas } from '@/lib/seo/structured-data';

// Enable ISR - revalidate every 60 seconds
export const revalidate = 60;
// Allow dynamic paths not generated at build time
export const dynamicParams = true;

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const language = await getLanguageBySlug(params.slug);
    if (!language) return { title: 'Not Found' };

    return generateLanguageMetadata({
      name: language.name,
      slug: language.slug,
      count: language.count,
    });
  } catch (error) {
    console.error('Error generating metadata:', error);
    return { title: 'Language | OPEN_SRC.ME' };
  }
}

// Language descriptions for SEO content
const LANGUAGE_DESCRIPTIONS: Record<string, string> = {
  javascript: 'JavaScript is the most popular programming language for web development, powering both frontend and backend applications with frameworks like React, Node.js, and Vue.',
  typescript: 'TypeScript adds static typing to JavaScript, making it ideal for large-scale applications. Many modern open source projects choose TypeScript for better developer experience and code quality.',
  python: 'Python is renowned for its readability and versatility, widely used in web development, data science, AI/ML, and automation. Its rich ecosystem of libraries makes it a top choice for open source projects.',
  go: 'Go (Golang) is designed by Google for building fast, reliable, and efficient software. Its simplicity and powerful concurrency model make it ideal for cloud services, CLIs, and DevOps tooling.',
  rust: 'Rust focuses on safety, speed, and concurrency without a garbage collector. It\'s increasingly popular for systems programming, WebAssembly, and performance-critical applications.',
  java: 'Java is a mature, cross-platform language widely used in enterprise software, Android development, and backend services. Its vast ecosystem and strong typing make it reliable for large-scale projects.',
  php: 'PHP powers a significant portion of the web, with frameworks like Laravel and WordPress leading the ecosystem. It remains a popular choice for web applications and content management.',
  ruby: 'Ruby, with its elegant syntax and the Rails framework, is beloved for rapid web development. Its emphasis on developer happiness drives many successful open source projects.',
  swift: 'Swift is Apple\'s modern programming language for iOS, macOS, and server-side development. Its safety features and performance make it the go-to choice for Apple ecosystem projects.',
  kotlin: 'Kotlin is a modern language that runs on the JVM, officially supported for Android development by Google. Its concise syntax and interoperability with Java make it increasingly popular.',
  csharp: 'C# is a versatile, modern language from Microsoft, used for Windows development, game development (Unity), and cross-platform applications via .NET.',
  cpp: 'C++ is a powerful systems programming language used for high-performance applications, game engines, embedded systems, and operating systems.',
  dart: 'Dart is optimized for building cross-platform mobile, web, and desktop applications, primarily through the Flutter framework.',
  elixir: 'Elixir leverages the Erlang VM for building scalable, fault-tolerant systems. It\'s popular for real-time applications and distributed systems.',
  shell: 'Shell scripting (Bash) is fundamental to system administration, DevOps, and automation. Many open source tools provide shell-based interfaces and scripts.',
};

// Language colors for visual styling
const LANGUAGE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  javascript: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
  typescript: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  python: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
  go: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
  rust: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
  java: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  php: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
  ruby: { bg: 'bg-red-500/10', text: 'text-red-300', border: 'border-red-500/20' },
  swift: { bg: 'bg-orange-500/10', text: 'text-orange-300', border: 'border-orange-500/20' },
  kotlin: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
};

function getColors(slug: string) {
  return LANGUAGE_COLORS[slug] || { bg: 'bg-brand/10', text: 'text-brand', border: 'border-brand/20' };
}

function formatStars(stars: number): string {
  if (stars >= 1000000) return `${(stars / 1000000).toFixed(1)}M`;
  if (stars >= 1000) return `${(stars / 1000).toFixed(1)}k`.replace('.0k', 'k');
  return stars.toString();
}

export default async function LanguagePage({ params }: Props) {
  let language: Awaited<ReturnType<typeof getLanguageBySlug>> = null;
  let languageAlternatives: Awaited<ReturnType<typeof getAlternativesByLanguage>> = [];
  let allLanguages: Awaited<ReturnType<typeof getLanguages>> = [];
  let categories: Awaited<ReturnType<typeof getCategories>> = [];

  const results = await Promise.allSettled([
    getLanguageBySlug(params.slug),
    getAlternativesByLanguage(params.slug),
    getLanguages(),
    getCategories(),
  ]);

  if (results[0].status === 'fulfilled') language = results[0].value;
  if (results[1].status === 'fulfilled') languageAlternatives = results[1].value;
  if (results[2].status === 'fulfilled') allLanguages = results[2].value;
  if (results[3].status === 'fulfilled') categories = results[3].value;

  if (!language) {
    notFound();
  }

  const colors = getColors(language.slug);
  const description = LANGUAGE_DESCRIPTIONS[language.slug] || 
    `Discover open source projects built with ${language.name}. Compare alternatives by GitHub stars, health score, and community activity.`;

  // Get unique categories from the alternatives for cross-linking
  const relatedCategories = new Map<string, { name: string; slug: string; count: number }>();
  languageAlternatives.forEach(alt => {
    alt.categories?.forEach(cat => {
      const existing = relatedCategories.get(cat.slug);
      if (existing) {
        existing.count++;
      } else {
        relatedCategories.set(cat.slug, { name: cat.name, slug: cat.slug, count: 1 });
      }
    });
  });
  const topCategories = Array.from(relatedCategories.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Other languages for sidebar cross-linking
  const otherLanguages = allLanguages
    .filter(l => l.slug !== language!.slug)
    .slice(0, 10);

  // Aggregate stats
  const totalStars = languageAlternatives.reduce((sum, alt) => sum + (alt.stars || 0), 0);
  const totalForks = languageAlternatives.reduce((sum, alt) => sum + (alt.forks || 0), 0);
  const avgHealthScore = languageAlternatives.length > 0
    ? Math.round(languageAlternatives.reduce((sum, alt) => sum + (alt.health_score || 0), 0) / languageAlternatives.length)
    : 0;

  // Build structured data
  const schemas = buildLanguagePageSchemas({
    name: language.name,
    slug: language.slug,
    description: description,
    alternatives: languageAlternatives.map(alt => ({
      name: alt.name,
      slug: alt.slug,
      description: alt.short_description || alt.description?.replace(/<[^>]*>/g, '').slice(0, 150),
    })),
  });

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Link
            href="/languages"
            className="inline-flex items-center text-muted hover:text-brand mb-4 font-mono text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            cd ../languages
          </Link>

          <div className="flex items-start gap-4 mb-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center border font-mono font-bold text-lg ${colors.bg} ${colors.text} ${colors.border}`}>
              {language.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold font-mono text-white">
                {language.name}<span className="text-brand">_</span>
              </h1>
              <p className="text-muted font-mono mt-1">
                <span className="text-brand">found:</span> {languageAlternatives.length} open source projects
              </p>
            </div>
          </div>

          {/* Language description for SEO */}
          <p className="text-muted text-sm sm:text-base max-w-3xl mb-6">
            {description}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 sm:gap-6 font-mono text-sm">
            <div className="flex items-center gap-2">
              <Code className={`w-4 h-4 ${colors.text}`} />
              <span className="text-muted">{languageAlternatives.length} projects</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-muted">{formatStars(totalStars)} total stars</span>
            </div>
            <div className="flex items-center gap-2">
              <GitFork className="w-4 h-4 text-blue-400" />
              <span className="text-muted">{formatStars(totalForks)} total forks</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted">avg health: <span className="text-brand">{avgHealthScore}/100</span></span>
            </div>
          </div>

          <div className="max-w-xl mt-6">
            <SearchBar placeholder={`Search ${language.name} alternatives...`} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {languageAlternatives.length > 0 ? (
              <AlternativesList alternatives={languageAlternatives} />
            ) : (
              <div className="text-center py-16 bg-surface border border-border rounded-lg">
                <Code className="w-12 h-12 text-muted mx-auto mb-4" />
                <p className="text-muted mb-4 font-mono">
                  <span className="text-brand">$</span> No {language.name} alternatives found yet.
                </p>
                <Link
                  href="/submit"
                  className="inline-flex items-center px-6 py-3 bg-brand text-dark font-mono font-medium rounded-lg hover:bg-brand-light transition-colors"
                >
                  Submit a {language.name} Project
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Categories */}
            {topCategories.length > 0 && (
              <div className="bg-surface rounded-xl border border-border p-5">
                <h2 className="text-sm font-mono text-brand mb-3">// related_categories</h2>
                <div className="flex flex-wrap gap-2">
                  {topCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/categories/${cat.slug}`}
                      className="px-2.5 py-1 bg-brand/10 text-brand rounded-lg hover:bg-brand/20 transition-colors text-xs font-medium font-mono"
                    >
                      {cat.name} ({cat.count})
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Other Languages */}
            {otherLanguages.length > 0 && (
              <div className="bg-surface rounded-xl border border-border p-5">
                <h2 className="text-sm font-mono text-brand mb-3">// other_languages</h2>
                <div className="space-y-2">
                  {otherLanguages.map((lang) => {
                    const langColors = getColors(lang.slug);
                    return (
                      <Link
                        key={lang.slug}
                        href={`/languages/${lang.slug}`}
                        className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-surface-light transition-colors group"
                      >
                        <span className="font-mono text-sm text-muted group-hover:text-white transition-colors">
                          {lang.name}
                        </span>
                        <span className={`text-xs font-mono ${langColors.text}`}>
                          {lang.count}
                        </span>
                      </Link>
                    );
                  })}
                </div>
                <Link
                  href="/languages"
                  className="block mt-3 text-center text-xs font-mono text-muted hover:text-brand transition-colors"
                >
                  View all languages →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* JSON-LD Structured Data */}
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </div>
  );
}
