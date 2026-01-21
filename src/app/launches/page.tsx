import { Metadata } from 'next';
import { getCategories, getProprietarySoftware } from '@/lib/mongodb/queries';
import { LaunchesPage } from '@/components/ui';

export const metadata: Metadata = {
  title: 'New Launches - Recently Added Open Source Alternatives',
  description: 'Discover the latest open source alternatives added to our directory. Browse new launches by time frame and vote for your favorites.',
  alternates: {
    canonical: '/launches',
  },
};

// Force dynamic rendering to access MongoDB at runtime
export const dynamic = 'force-dynamic';

export default async function LaunchesRoutePage() {
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let proprietarySoftware: Awaited<ReturnType<typeof getProprietarySoftware>> = [];

  try {
    [categories, proprietarySoftware] = await Promise.all([
      getCategories(),
      getProprietarySoftware(),
    ]);
  } catch (error) {
    console.error('Error fetching launches page data:', error);
  }

  // Transform to simpler format for the client component
  const simplifiedCategories = categories.map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));

  const simplifiedProprietary = proprietarySoftware.map(s => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
  }));

  return (
    <LaunchesPage 
      categories={simplifiedCategories} 
      proprietarySoftware={simplifiedProprietary} 
    />
  );
}