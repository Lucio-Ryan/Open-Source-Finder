import { Metadata } from 'next';
import { AdSubmitForm } from '@/components/ui/AdSubmitForm';

export const metadata: Metadata = {
  title: 'Submit Banner Ad - Advertise on OS Finder',
  description: 'Submit a banner advertisement to be displayed below the header on all pages of OS Finder.',
  alternates: {
    canonical: '/advertise/banner',
  },
};

export default function BannerAdSubmitPage() {
  return (
    <AdSubmitForm
      adType="banner"
      title="Submit Banner Ad"
      description="Premium placement below the header on every page. Maximum visibility for your brand."
    />
  );
}
