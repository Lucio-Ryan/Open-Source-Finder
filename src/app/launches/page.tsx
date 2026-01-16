import { Metadata } from 'next';
import { LaunchesPage } from '@/components/ui/LaunchesPage';
import { getCategories, getProprietarySoftware } from '@/lib/mongodb/queries';

export const metadata: Metadata = {
  title: 'Launches - Discover New Open Source Alternatives',
  description: 'Discover the newest open source alternatives launched today, this week, or this month. Browse by category and find replacements for proprietary software. Product Hunt style launch feed for open source projects.',
  alternates: {
    canonical: '/launches',
  },
  openGraph: {
    title: 'Launches - Discover New Open Source Alternatives',
    description: 'Discover the newest open source alternatives launched today, this week, or this month. Browse by category and find replacements for proprietary software.',
    type: 'website',
  },
};

export const revalidate = 60;

export default async function LaunchesPageRoute() {
  const [categories, proprietarySoftware] = await Promise.all([
    getCategories(),
    getProprietarySoftware(),
  ]);

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
