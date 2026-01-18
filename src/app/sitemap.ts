import { MetadataRoute } from 'next';
import { 
  getAlternatives, 
  getCategories, 
  getTags, 
  getTechStacks, 
  getProprietarySoftware 
} from '@/lib/mongodb/queries';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ossfinder.com';

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
    const [alternatives, categories, tags, techStacks, proprietarySoftware] = await Promise.all([
      getAlternatives({ approved: true }),
      getCategories(),
      getTags(),
      getTechStacks(),
      getProprietarySoftware(),
    ]);

    // Static pages
    const staticPages = [
      '',
      '/alternatives',
      '/categories',
      '/self-hosted',
      '/tech-stacks',
      '/launches',
      '/about',
      '/submit',
      '/search',
    ].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : route === '/launches' ? 0.9 : 0.8,
    }));

    // Alternative pages
    const alternativePages = alternatives.map((alt) => ({
      url: `${baseUrl}/alternatives/${alt.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Category pages
    const categoryPages = categories.map((cat) => ({
      url: `${baseUrl}/categories/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
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
