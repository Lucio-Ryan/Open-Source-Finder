/**
 * Automated SEO Metadata Generation System
 * 
 * Generates complete SEO metadata for every page type including:
 * - Meta titles optimized for CTR (50-60 chars)
 * - Meta descriptions (150-160 chars)
 * - Open Graph tags
 * - Twitter Card data
 * - Canonical URLs
 * - JSON-LD breadcrumb data
 */

import { Metadata } from 'next';

const SITE_NAME = 'OPEN_SRC.ME';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://opensrc.me';
const TWITTER_HANDLE = '@opensrcme';

// ============ TYPES ============

export type PageType = 'alternative' | 'category' | 'language' | 'tag' | 'tech-stack' | 'alternatives-to' | 'static';

export interface AlternativeMetaInput {
  name: string;
  slug: string;
  description: string;
  short_description?: string | null;
  stars?: number;
  license?: string | null;
  is_self_hosted?: boolean;
  icon_url?: string | null;
  categories?: { name: string; slug: string }[];
  alternative_to?: { name: string }[];
}

export interface CategoryMetaInput {
  name: string;
  slug: string;
  description: string;
  count?: number;
}

export interface LanguageMetaInput {
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

export interface TagMetaInput {
  name: string;
  slug: string;
  count?: number;
}

export interface TechStackMetaInput {
  name: string;
  slug: string;
  type?: string;
  count?: number;
}

export interface ProprietaryMetaInput {
  name: string;
  slug: string;
  description: string;
  count?: number;
}

// ============ META TITLE GENERATORS ============

/**
 * Generate an optimized meta title (50-60 characters target)
 */
function truncateTitle(title: string, maxLength: number = 60): string {
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength - 3).trim() + '...';
}

/**
 * Generate an optimized meta description (150-160 characters)
 */
function truncateDescription(desc: string, maxLength: number = 160): string {
  // Strip HTML tags
  const text = desc.replace(/<[^>]*>/g, '').trim();
  if (text.length <= maxLength) return text;
  // Cut at last word boundary
  const truncated = text.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > maxLength * 0.7 ? truncated.substring(0, lastSpace) : truncated) + '...';
}

// ============ PAGE-SPECIFIC METADATA GENERATORS ============

/**
 * Generate metadata for an alternative/project detail page
 */
export function generateAlternativeMetadata(alt: AlternativeMetaInput): Metadata {
  const starsText = alt.stars ? ` (${formatStars(alt.stars)} stars)` : '';
  const selfHostedText = alt.is_self_hosted ? ' Self-Hosted' : '';
  const licenseText = alt.license ? ` ${alt.license}` : ' Open Source';
  
  // Build title: "ProjectName - Free Open Source Alternative | OPEN_SRC.ME"
  const title = truncateTitle(`${alt.name} -${selfHostedText}${licenseText} Alternative`);

  // Build description with key selling points
  const rawDesc = alt.short_description || alt.description;
  const cleanDesc = rawDesc.replace(/<[^>]*>/g, '').trim();
  
  let description: string;
  const alternativeToNames = alt.alternative_to?.map(a => a.name).join(', ');
  if (alternativeToNames) {
    description = truncateDescription(
      `${alt.name} is a free, open source alternative to ${alternativeToNames}.${starsText} ${cleanDesc}`
    );
  } else {
    description = truncateDescription(
      `${alt.name}${starsText} - ${cleanDesc}`
    );
  }

  const canonicalUrl = `${SITE_URL}/alternatives/${alt.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      title: `${alt.name} - Open Source Alternative | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: `${SITE_URL}/alternatives/${alt.slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${alt.name} - Open Source Alternative`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${alt.name} - Open Source Alternative`,
      description,
      creator: TWITTER_HANDLE,
      images: [`${SITE_URL}/alternatives/${alt.slug}/twitter-image`],
    },
    keywords: buildAlternativeKeywords(alt),
  };
}

/**
 * Generate metadata for a category landing page
 */
export function generateCategoryMetadata(category: CategoryMetaInput): Metadata {
  const countText = category.count ? `${category.count}+ ` : '';
  const title = truncateTitle(`${countText}Best ${category.name} Open Source Alternatives`);
  const description = truncateDescription(
    category.description ||
    `Discover the best open source ${category.name.toLowerCase()} tools. Compare ${countText}free alternatives with GitHub stats, features, and community ratings.`
  );
  const canonicalUrl = `${SITE_URL}/categories/${category.slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'website',
      title: `${category.name} Open Source Alternatives | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [{
        url: `${SITE_URL}/categories/${category.slug}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `${category.name} Open Source Alternatives`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} Open Source Alternatives`,
      description,
      creator: TWITTER_HANDLE,
    },
    keywords: [
      `${category.name.toLowerCase()} open source`,
      `${category.name.toLowerCase()} alternatives`,
      `free ${category.name.toLowerCase()} software`,
      `open source ${category.name.toLowerCase()} tools`,
      'FOSS', 'self-hosted',
    ],
  };
}

/**
 * Generate metadata for a programming language filter page
 */
export function generateLanguageMetadata(language: LanguageMetaInput): Metadata {
  const countText = language.count ? `${language.count}+ ` : '';
  const title = truncateTitle(`${countText}Best ${language.name} Open Source Projects`);
  const description = truncateDescription(
    language.description ||
    `Discover ${countText}open source projects built with ${language.name}. Compare GitHub stats, features, and find the best ${language.name} alternatives to proprietary software.`
  );
  const canonicalUrl = `${SITE_URL}/languages/${language.slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'website',
      title: `${language.name} Open Source Projects | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [{
        url: `${SITE_URL}/languages/${language.slug}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `${language.name} Open Source Projects`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${language.name} Open Source Projects`,
      description,
      creator: TWITTER_HANDLE,
    },
    keywords: [
      `${language.name.toLowerCase()} open source`,
      `${language.name.toLowerCase()} projects`,
      `${language.name.toLowerCase()} alternatives`,
      `best ${language.name.toLowerCase()} software`,
      'open source', 'FOSS', 'GitHub',
    ],
  };
}

/**
 * Generate metadata for a tag page
 */
export function generateTagMetadata(tag: TagMetaInput): Metadata {
  const countText = tag.count ? `${tag.count}+ ` : '';
  const title = truncateTitle(`${countText}${tag.name} Open Source Alternatives`);
  const description = truncateDescription(
    `Discover ${countText}open source alternatives tagged with ${tag.name}. Compare free, community-driven tools with GitHub stats and ratings.`
  );
  const canonicalUrl = `${SITE_URL}/tags/${tag.slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'website',
      title: `${tag.name} Open Source Alternatives | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary',
      title: `${tag.name} Open Source Alternatives`,
      description,
      creator: TWITTER_HANDLE,
    },
  };
}

/**
 * Generate metadata for a tech stack page
 */
export function generateTechStackMetadata(tech: TechStackMetaInput): Metadata {
  const countText = tech.count ? `${tech.count}+ ` : '';
  const typeText = tech.type ? ` (${tech.type})` : '';
  const title = truncateTitle(`${countText}Open Source Projects Built with ${tech.name}`);
  const description = truncateDescription(
    `Discover ${countText}open source alternatives built with ${tech.name}${typeText}. Compare projects by GitHub stats, health score, and community activity.`
  );
  const canonicalUrl = `${SITE_URL}/tech-stacks/${tech.slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'website',
      title: `${tech.name} Open Source Projects | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary',
      title: `${tech.name} Open Source Projects`,
      description,
      creator: TWITTER_HANDLE,
    },
  };
}

/**
 * Generate metadata for "alternatives-to" proprietary software pages
 */
export function generateAlternativesToMetadata(software: ProprietaryMetaInput): Metadata {
  const countText = software.count ? `${software.count}+ ` : '';
  const title = truncateTitle(`${countText}Best Open Source Alternatives to ${software.name}`);
  const description = truncateDescription(
    software.description ||
    `Looking for open source alternatives to ${software.name}? Compare ${countText}free, privacy-respecting tools with GitHub stats. Find the best replacement today.`
  );
  const canonicalUrl = `${SITE_URL}/alternatives-to/${software.slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'website',
      title: `Open Source Alternatives to ${software.name} | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [{
        url: `${SITE_URL}/alternatives-to/${software.slug}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `Open Source Alternatives to ${software.name}`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Open Source Alternatives to ${software.name}`,
      description,
      creator: TWITTER_HANDLE,
    },
    keywords: [
      `${software.name.toLowerCase()} alternatives`,
      `${software.name.toLowerCase()} open source`,
      `free ${software.name.toLowerCase()} alternative`,
      `replace ${software.name.toLowerCase()}`,
      'open source', 'FOSS', 'privacy',
    ],
  };
}

// ============ HELPER FUNCTIONS ============

/**
 * Format star count for display in meta descriptions
 */
function formatStars(stars: number): string {
  if (stars >= 1000) {
    return `${(stars / 1000).toFixed(1)}k`.replace('.0k', 'k');
  }
  return stars.toString();
}

/**
 * Build keyword list for an alternative
 */
function buildAlternativeKeywords(alt: AlternativeMetaInput): string[] {
  const keywords: string[] = [
    `${alt.name.toLowerCase()} open source`,
    `${alt.name.toLowerCase()} alternative`,
    `${alt.name.toLowerCase()} free`,
  ];

  if (alt.alternative_to) {
    alt.alternative_to.forEach(p => {
      keywords.push(`${p.name.toLowerCase()} alternative`);
      keywords.push(`${p.name.toLowerCase()} open source alternative`);
    });
  }

  if (alt.categories) {
    alt.categories.forEach(c => {
      keywords.push(`open source ${c.name.toLowerCase()}`);
    });
  }

  if (alt.is_self_hosted) keywords.push('self-hosted');
  if (alt.license) keywords.push(alt.license.toLowerCase());
  keywords.push('open source', 'FOSS', 'free software');

  return Array.from(new Set(keywords));
}

/**
 * Generate breadcrumb data for JSON-LD
 */
export function generateBreadcrumbs(
  items: { name: string; url: string }[]
): { '@context': string; '@type': string; itemListElement: any[] } {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}
