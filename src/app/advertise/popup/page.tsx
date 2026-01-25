import { Metadata } from 'next';
import { AdSubmitForm } from '@/components/ui/AdSubmitForm';

export const metadata: Metadata = {
  title: 'Submit Popup Ad - Advertise on OPEN_SRC.ME',
  description: 'Submit a popup advertisement card to be displayed in the bottom-right corner of OPEN_SRC.ME.',
  alternates: {
    canonical: '/advertise/popup',
  },
};

export default function PopupAdSubmitPage() {
  return (
    <AdSubmitForm
      adType="popup"
      title="Submit Popup Ad"
      description="Floating card in the bottom-right corner. Rotates between up to 5 advertisers for fair exposure."
    />
  );
}
