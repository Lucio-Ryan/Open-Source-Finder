import { Metadata } from 'next';
import { AdSubmitForm } from '@/components/ui/AdSubmitForm';

export const metadata: Metadata = {
  title: 'Submit Card Ad - Advertise on OS Finder',
  description: 'Submit a card advertisement that blends into the alternatives grid on OS Finder.',
  alternates: {
    canonical: '/advertise/card',
  },
};

export default function CardAdSubmitPage() {
  return (
    <AdSubmitForm
      adType="card"
      title="Submit Card Ad"
      description="Blend into the alternatives grid. Your ad appears alongside open source projects in search results and listing pages."
    />
  );
}
