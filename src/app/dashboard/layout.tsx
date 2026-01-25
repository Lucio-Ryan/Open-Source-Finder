import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | OPEN_SRC.ME',
  description: 'Manage your open source alternative submissions, sponsored features, and account settings on OPEN_SRC.ME.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
