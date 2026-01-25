import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment | OPEN_SRC.ME',
  description: 'Payment processing and order confirmation.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
