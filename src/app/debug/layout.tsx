import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Debug | OPEN_SRC.ME',
  description: 'System debug information and diagnostics.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DebugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
