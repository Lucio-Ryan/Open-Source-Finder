/**
 * Schema.org Structured Data Generation
 * 
 * Generates JSON-LD structured data for all page types:
 * - SoftwareApplication for individual project pages
 * - ItemList for category and language listing pages
 * - BreadcrumbList for all pages
 * - WebSite with SearchAction for homepage
 * - Organization for site-wide branding
 */

const SITE_NAME = 'OPEN_SRC.ME';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://opensrc.me';

// ============ TYPES ============

export interface SoftwareAppInput {
  name: string;
  slug: string;
  description: string;
  short_description?: string | null;
  website: string;
  github?: string;
  stars?: number;
  license?: string | null;
  is_self_hosted?: boolean;
  icon_url?: string | null;
  screenshots?: string[];
  categories?: { name: string; slug: string }[];
  health_score?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ItemListInput {
  name: string;
  description: string;
  url: string;
  items: {
    name: string;
    url: string;
    description?: string;
    position?: number;
    image?: string;
  }[];
}

export interface BreadcrumbInput {
  name: string;
  url: string;
}

// ============ SCHEMA GENERATORS ============

/**
 * Generate SoftwareApplication schema for project detail pages
 * @see https://schema.org/SoftwareApplication
 */
export function generateSoftwareApplicationSchema(app: SoftwareAppInput) {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    description: (app.short_description || app.description || '').replace(/<[^>]*>/g, '').slice(0, 300),
    url: app.website,
    applicationCategory: app.categories?.[0]?.name || 'Software',
    operatingSystem: app.is_self_hosted ? 'Self-Hosted' : 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  // Add optional fields
  if (app.icon_url) {
    schema.image = app.icon_url;
  }

  if (app.license) {
    schema.license = `https://spdx.org/licenses/${app.license}`;
  }

  if (app.github) {
    schema.codeRepository = app.github;
    schema.downloadUrl = app.github;
  }

  if (app.screenshots && app.screenshots.length > 0) {
    schema.screenshot = app.screenshots;
  }

  if (app.health_score) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: String(Math.min(parseFloat((app.health_score / 20).toFixed(1)), 5.0)),
      bestRating: '5',
      worstRating: '1',
      ratingCount: app.stars || 1,
    };
  }

  if (app.categories && app.categories.length > 0) {
    schema.applicationSubCategory = app.categories.map(c => c.name);
  }

  if (app.created_at) {
    schema.datePublished = app.created_at;
  }

  if (app.updated_at) {
    schema.dateModified = app.updated_at;
  }

  return schema;
}

/**
 * Generate ItemList schema for listing pages (categories, languages, etc.)
 * @see https://schema.org/ItemList
 */
export function generateItemListSchema(list: ItemListInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: list.name,
    description: list.description,
    url: list.url.startsWith('http') ? list.url : `${SITE_URL}${list.url}`,
    numberOfItems: list.items.length,
    itemListElement: list.items.map((item, index) => ({
      '@type': 'ListItem',
      position: item.position || index + 1,
      name: item.name,
      url: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
      ...(item.description && { description: item.description }),
      ...(item.image && { image: item.image }),
    })),
  };
}

/**
 * Generate BreadcrumbList schema for navigation
 * @see https://schema.org/BreadcrumbList
 */
export function generateBreadcrumbSchema(breadcrumbs: BreadcrumbInput[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url.startsWith('http') ? crumb.url : `${SITE_URL}${crumb.url}`,
    })),
  };
}

/**
 * Generate CollectionPage schema for aggregation pages
 * @see https://schema.org/CollectionPage
 */
export function generateCollectionPageSchema(collection: {
  name: string;
  description: string;
  url: string;
  itemCount: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.name,
    description: collection.description,
    url: collection.url.startsWith('http') ? collection.url : `${SITE_URL}${collection.url}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: collection.itemCount,
    },
  };
}

/**
 * Generate FAQ schema for pages with Q&A content
 * @see https://schema.org/FAQPage
 */
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// ============ COMPOSITE SCHEMA BUILDERS ============

/**
 * Build complete structured data for an alternative detail page
 */
export function buildAlternativePageSchemas(alt: SoftwareAppInput) {
  const schemas = [];

  // SoftwareApplication
  schemas.push(generateSoftwareApplicationSchema(alt));

  // BreadcrumbList
  const breadcrumbs: BreadcrumbInput[] = [
    { name: 'Home', url: '/' },
    { name: 'Alternatives', url: '/alternatives' },
  ];
  
  if (alt.categories && alt.categories[0]) {
    breadcrumbs.push({
      name: alt.categories[0].name,
      url: `/categories/${alt.categories[0].slug}`,
    });
  }
  
  breadcrumbs.push({ name: alt.name, url: `/alternatives/${alt.slug}` });
  schemas.push(generateBreadcrumbSchema(breadcrumbs));

  return schemas;
}

/**
 * Build complete structured data for a category page
 */
export function buildCategoryPageSchemas(category: {
  name: string;
  slug: string;
  description: string;
  alternatives: { name: string; slug: string; description?: string; icon_url?: string | null }[];
}) {
  const schemas = [];

  // ItemList
  schemas.push(generateItemListSchema({
    name: `${category.name} Open Source Alternatives`,
    description: category.description,
    url: `/categories/${category.slug}`,
    items: category.alternatives.map((alt, i) => ({
      name: alt.name,
      url: `/alternatives/${alt.slug}`,
      description: alt.description,
      position: i + 1,
      image: alt.icon_url || undefined,
    })),
  }));

  // BreadcrumbList
  schemas.push(generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Categories', url: '/categories' },
    { name: category.name, url: `/categories/${category.slug}` },
  ]));

  // CollectionPage
  schemas.push(generateCollectionPageSchema({
    name: `${category.name} Open Source Alternatives`,
    description: category.description,
    url: `/categories/${category.slug}`,
    itemCount: category.alternatives.length,
  }));

  return schemas;
}

/**
 * Build complete structured data for a language page
 */
export function buildLanguagePageSchemas(language: {
  name: string;
  slug: string;
  description: string;
  alternatives: { name: string; slug: string; description?: string }[];
}) {
  const schemas = [];

  // ItemList
  schemas.push(generateItemListSchema({
    name: `${language.name} Open Source Projects`,
    description: language.description,
    url: `/languages/${language.slug}`,
    items: language.alternatives.map((alt, i) => ({
      name: alt.name,
      url: `/alternatives/${alt.slug}`,
      description: alt.description,
      position: i + 1,
    })),
  }));

  // BreadcrumbList
  schemas.push(generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Languages', url: '/languages' },
    { name: language.name, url: `/languages/${language.slug}` },
  ]));

  return schemas;
}

/**
 * Build complete structured data for "alternatives-to" page
 */
export function buildAlternativesToPageSchemas(software: {
  name: string;
  slug: string;
  description: string;
  alternatives: { name: string; slug: string; description?: string }[];
}) {
  const schemas = [];

  // ItemList
  schemas.push(generateItemListSchema({
    name: `Open Source Alternatives to ${software.name}`,
    description: software.description,
    url: `/alternatives-to/${software.slug}`,
    items: software.alternatives.map((alt, i) => ({
      name: alt.name,
      url: `/alternatives/${alt.slug}`,
      description: alt.description,
      position: i + 1,
    })),
  }));

  // BreadcrumbList
  schemas.push(generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Alternatives To', url: '/alternatives-to' },
    { name: software.name, url: `/alternatives-to/${software.slug}` },
  ]));

  return schemas;
}
