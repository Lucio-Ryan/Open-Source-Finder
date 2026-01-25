import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submit an Open Source Alternative | OPEN_SRC.ME',
  description: 'Submit a new open source alternative to OPEN_SRC.ME and help developers find freedom-respecting software.',
  alternates: {
    canonical: '/submit',
  },
};

export default function SubmitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
