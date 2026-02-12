'use client';

import Link from 'next/link';
import { ArrowRight, Code, Tag, Layers, Monitor } from 'lucide-react';

/**
 * Internal Link Graph Architecture
 * 
 * Hub-and-spoke model with category pages as hubs.
 * Distributes link equity and establishes topical relationships.
 */

// ============ TYPES ============

interface CategoryLink {
  name: string;
  slug: string;
  count?: number;
}

interface LanguageLink {
  name: string;
  slug: string;
  count?: number;
}

interface TagLink {
  name: string;
  slug: string;
}

interface TechStackLink {
  name: string;
  slug: string;
  type?: string;
}

interface AlternativeLink {
  name: string;
  slug: string;
  stars?: number;
  description?: string;
  icon_url?: string | null;
}

// ============ BREADCRUMB COMPONENT ============

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="font-mono text-xs text-muted">
      <ol className="flex items-center flex-wrap gap-1">
        <li>
          <Link href="/" className="hover:text-brand transition-colors">
            ~
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.href || item.label} className="flex items-center gap-1">
            <span className="text-border">/</span>
            {index === items.length - 1 || !item.href ? (
              <span className="text-white">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-brand transition-colors">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// ============ RELATED ALTERNATIVES SECTION ============

export function RelatedAlternatives({
  alternatives,
  title = '// related_alternatives',
  maxItems = 4,
}: {
  alternatives: AlternativeLink[];
  title?: string;
  maxItems?: number;
}) {
  if (alternatives.length === 0) return null;
  
  const displayed = alternatives.slice(0, maxItems);

  return (
    <div className="bg-surface rounded-xl border border-border p-4 sm:p-5">
      <h3 className="text-sm font-mono text-brand mb-3">{title}</h3>
      <div className="space-y-3">
        {displayed.map((alt) => (
          <Link
            key={alt.slug}
            href={`/alternatives/${alt.slug}`}
            className="flex items-center gap-3 group py-1"
          >
            {alt.icon_url ? (
              <img
                src={alt.icon_url}
                alt=""
                className="w-8 h-8 rounded-lg object-cover flex-shrink-0 border border-border"
                loading="lazy"
              />
            ) : (
              <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center text-brand font-bold text-xs flex-shrink-0 font-mono">
                {alt.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-mono text-sm text-white group-hover:text-brand transition-colors truncate">
                {alt.name}
              </p>
              {alt.stars !== undefined && alt.stars > 0 && (
                <p className="font-mono text-xs text-muted">
                  ★ {alt.stars >= 1000 ? `${(alt.stars / 1000).toFixed(1)}k` : alt.stars}
                </p>
              )}
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-muted group-hover:text-brand transition-colors flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}

// ============ CATEGORY LINKS SECTION ============

export function CategoryLinks({
  categories,
  currentSlug,
  title = '// categories',
}: {
  categories: CategoryLink[];
  currentSlug?: string;
  title?: string;
}) {
  if (categories.length === 0) return null;

  return (
    <div className="bg-surface rounded-xl border border-border p-4 sm:p-5">
      <h3 className="text-sm font-mono text-brand mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium font-mono transition-colors ${
              cat.slug === currentSlug
                ? 'bg-brand text-dark'
                : 'bg-brand/10 text-brand hover:bg-brand/20'
            }`}
          >
            {cat.name}
            {cat.count !== undefined && (
              <span className="ml-1 opacity-60">({cat.count})</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

// ============ LANGUAGE LINKS SECTION ============

export function LanguageLinks({
  languages,
  currentSlug,
  title = '// languages',
}: {
  languages: LanguageLink[];
  currentSlug?: string;
  title?: string;
}) {
  if (languages.length === 0) return null;

  return (
    <div className="bg-surface rounded-xl border border-border p-4 sm:p-5">
      <h3 className="text-sm font-mono text-brand mb-3 flex items-center gap-2">
        <Code className="w-4 h-4" />
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {languages.map((lang) => (
          <Link
            key={lang.slug}
            href={`/languages/${lang.slug}`}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium font-mono transition-colors ${
              lang.slug === currentSlug
                ? 'bg-brand text-dark'
                : 'bg-surface-light text-muted hover:text-brand hover:bg-brand/10 border border-border'
            }`}
          >
            {lang.name}
            {lang.count !== undefined && (
              <span className="ml-1 opacity-60">({lang.count})</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

// ============ TAG LINKS SECTION ============

export function TagLinks({
  tags,
  currentSlug,
  title = '// tags',
}: {
  tags: TagLink[];
  currentSlug?: string;
  title?: string;
}) {
  if (tags.length === 0) return null;

  return (
    <div className="bg-surface rounded-xl border border-border p-4 sm:p-5">
      <h3 className="text-sm font-mono text-brand mb-3 flex items-center gap-2">
        <Tag className="w-4 h-4" />
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag.slug}
            href={`/tags/${tag.slug}`}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium font-mono transition-colors ${
              tag.slug === currentSlug
                ? 'bg-brand text-dark'
                : 'bg-surface text-muted hover:text-brand hover:bg-brand/10 border border-border'
            }`}
          >
            <span className="text-brand/60">#</span>{tag.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

// ============ TECH STACK LINKS SECTION ============

export function TechStackLinks({
  techStacks,
  currentSlug,
  title = '// tech_stack',
}: {
  techStacks: TechStackLink[];
  currentSlug?: string;
  title?: string;
}) {
  if (techStacks.length === 0) return null;

  return (
    <div className="bg-surface rounded-xl border border-border p-4 sm:p-5">
      <h3 className="text-sm font-mono text-brand mb-3 flex items-center gap-2">
        <Layers className="w-4 h-4" />
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {techStacks.map((tech) => (
          <Link
            key={tech.slug}
            href={`/tech-stacks/${tech.slug}`}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium font-mono transition-colors ${
              tech.slug === currentSlug
                ? 'bg-brand text-dark'
                : 'bg-brand/10 text-brand hover:bg-brand/20'
            }`}
          >
            {tech.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

// ============ FOOTER NAVIGATION LINKS ============

export function FooterSEOLinks({
  popularCategories,
  popularLanguages,
}: {
  popularCategories: CategoryLink[];
  popularLanguages: LanguageLink[];
}) {
  return (
    <div className="border-t border-border bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Popular Categories */}
          <div>
            <h3 className="font-mono text-sm text-brand mb-3">// popular_categories</h3>
            <ul className="space-y-1.5">
              {popularCategories.slice(0, 10).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="font-mono text-xs text-muted hover:text-brand transition-colors"
                  >
                    {cat.name} ({cat.count})
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Languages */}
          <div>
            <h3 className="font-mono text-sm text-brand mb-3">// popular_languages</h3>
            <ul className="space-y-1.5">
              {popularLanguages.slice(0, 10).map((lang) => (
                <li key={lang.slug}>
                  <Link
                    href={`/languages/${lang.slug}`}
                    className="font-mono text-xs text-muted hover:text-brand transition-colors"
                  >
                    {lang.name} ({lang.count})
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-mono text-sm text-brand mb-3">// explore</h3>
            <ul className="space-y-1.5">
              <li><Link href="/alternatives" className="font-mono text-xs text-muted hover:text-brand transition-colors">All Alternatives</Link></li>
              <li><Link href="/categories" className="font-mono text-xs text-muted hover:text-brand transition-colors">All Categories</Link></li>
              <li><Link href="/languages" className="font-mono text-xs text-muted hover:text-brand transition-colors">By Language</Link></li>
              <li><Link href="/tech-stacks" className="font-mono text-xs text-muted hover:text-brand transition-colors">By Tech Stack</Link></li>
              <li><Link href="/self-hosted" className="font-mono text-xs text-muted hover:text-brand transition-colors">Self-Hosted</Link></li>
              <li><Link href="/launches" className="font-mono text-xs text-muted hover:text-brand transition-colors">Latest Launches</Link></li>
              <li><Link href="/alternatives-to" className="font-mono text-xs text-muted hover:text-brand transition-colors">Alternatives To...</Link></li>
              <li><Link href="/submit" className="font-mono text-xs text-muted hover:text-brand transition-colors">Submit a Project</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ POPULARITY INDICATOR ============

export function PopularityInCategory({
  rank,
  totalInCategory,
  categoryName,
  categorySlug,
}: {
  rank: number;
  totalInCategory: number;
  categoryName: string;
  categorySlug: string;
}) {
  const percentage = Math.round((1 - (rank - 1) / totalInCategory) * 100);
  
  return (
    <div className="bg-surface rounded-xl border border-border p-4">
      <h3 className="text-sm font-mono text-brand mb-2">// popularity</h3>
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-xs text-muted">
          Rank #{rank} of {totalInCategory} in{' '}
          <Link href={`/categories/${categorySlug}`} className="text-brand hover:underline">
            {categoryName}
          </Link>
        </span>
      </div>
      <div className="w-full bg-surface-light rounded-full h-2">
        <div
          className="bg-brand rounded-full h-2 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="font-mono text-xs text-muted mt-1">Top {100 - percentage}%</p>
    </div>
  );
}
