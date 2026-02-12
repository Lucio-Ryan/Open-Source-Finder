import { MetadataRoute } from 'next';
import { 
  getAlternatives, 
  getCategories, 
  getTags, 
  getTechStacks, 
  getProprietarySoftware,
  getLanguages,
} from '@/lib/mongodb/queries';

// Enable ISR - revalidate sitemap every 3600 seconds (1 hour)
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://opensrc.me';

  // Return only static pages if MongoDB is not available
  if (!process.env.MONGODB_URI) {
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 1,
      },
    ];
  }

  try {
    // Fetch all data from MongoDB
    const [alternatives, categories, tags, techStacks, proprietarySoftware, languages] = await Promise.all([
      getAlternatives({ approved: true }),
      getCategories(),
      getTags(),
      getTechStacks(),
      getProprietarySoftware(),
      getLanguages(),
    ]);

    // Static pages with appropriate priorities and change frequencies
    const staticPages = [
      { route: '', changeFrequency: 'daily' as const, priority: 1 },
      { route: '/alternatives', changeFrequency: 'daily' as const, priority: 0.9 },
      { route: '/categories', changeFrequency: 'weekly' as const, priority: 0.9 },
      { route: '/languages', changeFrequency: 'weekly' as const, priority: 0.8 },
      { route: '/self-hosted', changeFrequency: 'daily' as const, priority: 0.8 },
      { route: '/tech-stacks', changeFrequency: 'weekly' as const, priority: 0.7 },
      { route: '/launches', changeFrequency: 'daily' as const, priority: 0.9 },
      { route: '/alternatives-to', changeFrequency: 'weekly' as const, priority: 0.8 },
      { route: '/about', changeFrequency: 'monthly' as const, priority: 0.4 },
      { route: '/submit', changeFrequency: 'monthly' as const, priority: 0.6 },
      { route: '/search', changeFrequency: 'weekly' as const, priority: 0.7 },
      { route: '/donate', changeFrequency: 'monthly' as const, priority: 0.3 },
    ].map((page) => ({
      url: `${baseUrl}${page.route}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }));

    // Alternative pages - highest priority content
    const alternativePages = alternatives.map((alt) => ({
      url: `${baseUrl}/alternatives/${alt.slug}`,
      lastModified: alt.updated_at ? new Date(alt.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Category pages - hub pages with high priority
    const categoryPages = categories.map((cat) => ({
      url: `${baseUrl}/categories/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Language pages - programmatic SEO pages
    const languagePages = languages.map((lang) => ({
      url: `${baseUrl}/languages/${lang.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Tag pages
    const tagPages = tags.map((tag) => ({
      url: `${baseUrl}/tags/${tag.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }));

    // Tech stack pages
    const techStackPages = techStacks.map((tech) => ({
      url: `${baseUrl}/tech-stacks/${tech.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }));

    // Alternatives-to pages
    const alternativesToPages = proprietarySoftware.map((software) => ({
      url: `${baseUrl}/alternatives-to/${software.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    return [
      ...staticPages,
      ...alternativePages,
      ...categoryPages,
      ...languagePages,
      ...tagPages,
      ...techStackPages,
      ...alternativesToPages,
    ];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return minimal sitemap on error
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 1,
      },
    ];
  }
}
