import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Donate | OPEN_SRC.ME',
  description: 'Support OPEN_SRC.ME and help us maintain the largest community-curated database of open source alternatives.',
  alternates: {
    canonical: '/donate',
  },
};

export default function DonateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
