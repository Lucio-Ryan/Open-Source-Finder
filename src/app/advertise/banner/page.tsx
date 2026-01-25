import { Metadata } from 'next';
import { AdSubmitForm } from '@/components/ui/AdSubmitForm';

export const metadata: Metadata = {
  title: 'Submit Banner Ad - Advertise on OPEN_SRC.ME',
  description: 'Submit a banner advertisement to be displayed below the header on all pages of OPEN_SRC.ME.',
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
