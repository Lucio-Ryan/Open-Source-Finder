'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Crown, Megaphone, ArrowRight } from 'lucide-react';
import { Suspense } from 'react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const id = searchParams.get('id');
  
  const isSponsor = type === 'sponsor';
  const isAdvertisement = type === 'advertisement';

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface border border-border rounded-xl p-8 text-center">
        <div className={`w-20 h-20 ${isSponsor ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-brand/10 border-brand/30'} border rounded-full flex items-center justify-center mx-auto mb-6`}>
          {isSponsor ? (
            <Crown className="w-10 h-10 text-emerald-500" />
          ) : isAdvertisement ? (
            <Megaphone className="w-10 h-10 text-brand" />
          ) : (
            <CheckCircle className="w-10 h-10 text-brand" />
          )}
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">
          Payment Successful!<span className="text-brand">_</span>
        </h1>
        
        {isSponsor && (
          <div className="space-y-4 mb-8">
            <p className="text-muted">
              🎉 Congratulations! Your project is now live as a Sponsor!
            </p>
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 text-left">
              <h3 className="text-emerald-500 font-semibold mb-2 text-sm">Your Benefits:</h3>
              <ul className="text-sm text-muted space-y-2">
                <li>✓ Featured on homepage for 7 days</li>
                <li>✓ Verified sponsor badge</li>
                <li>✓ SEO dofollow links</li>
                <li>✓ Premium full-width card</li>
                <li>✓ Newsletter feature</li>
                <li>✓ Unlimited updates</li>
              </ul>
            </div>
          </div>
        )}
        
        {isAdvertisement && (
          <div className="space-y-4 mb-8">
            <p className="text-muted">
              Your advertisement is now live and will run for 7 days!
            </p>
            <div className="bg-brand/10 border border-brand/30 rounded-lg p-4 text-left">
              <h3 className="text-brand font-semibold mb-2 text-sm">Ad Status:</h3>
              <ul className="text-sm text-muted space-y-2">
                <li>✓ Payment confirmed</li>
                <li>✓ Advertisement activated</li>
                <li>✓ 7 days of visibility</li>
              </ul>
            </div>
          </div>
        )}

        {!isSponsor && !isAdvertisement && (
          <p className="text-muted mb-8">
            Your payment has been processed successfully. Thank you for your purchase!
          </p>
        )}
        
        <div className="flex flex-col gap-3">
          {isSponsor && (
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-dark font-mono font-medium rounded-lg hover:bg-emerald-400 transition-colors"
            >
              View Your Listing
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
          
          {isAdvertisement && (
            <Link
              href="/dashboard/advertisements"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand text-dark font-mono font-medium rounded-lg hover:bg-brand-light transition-colors"
            >
              View Ad Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
          
          <Link
            href="/"
            className={`inline-flex items-center justify-center gap-2 px-6 py-3 ${isSponsor || isAdvertisement ? 'bg-surface border border-border text-white hover:border-brand/50' : 'bg-brand text-dark hover:bg-brand-light'} font-mono rounded-lg transition-colors`}
          >
            {isSponsor || isAdvertisement ? 'Go Home' : 'Continue'}
            {!isSponsor && !isAdvertisement && <ArrowRight className="w-4 h-4" />}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
