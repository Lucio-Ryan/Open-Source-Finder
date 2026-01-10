import { Metadata } from 'next';
import { AdSubmitForm } from '@/components/ui/AdSubmitForm';

export const metadata: Metadata = {
  title: 'Submit Banner Ad - Advertise on OSS Finder',
  description: 'Submit a banner advertisement to be displayed below the header on all pages of OSS Finder.',
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
