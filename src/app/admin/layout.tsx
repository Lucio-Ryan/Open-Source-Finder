import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin | OPEN_SRC.ME',
  description: 'Administrative panel for OPEN_SRC.ME.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
