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

// Enable ISR - revalidate every 60 seconds
export const revalidate = 60;

export default async function LaunchesRoutePage() {
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let proprietarySoftware: Awaited<ReturnType<typeof getProprietarySoftware>> = [];

  // Use Promise.allSettled to ensure one failure doesn't affect others
  const results = await Promise.allSettled([
    getCategories(),
    getProprietarySoftware(),
  ]);
  
  if (results[0].status === 'fulfilled') {
    categories = results[0].value;
  } else {
    console.error('Error fetching categories:', results[0].reason);
  }
  
  if (results[1].status === 'fulfilled') {
    proprietarySoftware = results[1].value;
  } else {
    console.error('Error fetching proprietary software:', results[1].reason);
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