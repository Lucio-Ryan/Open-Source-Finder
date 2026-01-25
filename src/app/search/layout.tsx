import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Open Source Alternatives | OPEN_SRC.ME',
  description: 'Search for open source alternatives to your favorite proprietary software tools.',
  alternates: {
    canonical: '/search',
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
