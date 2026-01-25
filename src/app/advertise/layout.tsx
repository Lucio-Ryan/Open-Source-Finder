import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Advertise on OPEN_SRC.ME',
  description: 'Advertise your product or service to developers and open source enthusiasts. Choose from banner, card, or popup ads.',
  alternates: {
    canonical: '/advertise',
  },
};

export default function AdvertiseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
