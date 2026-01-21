'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';

function PaymentErrorContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');
  
  const getErrorMessage = () => {
    switch (reason) {
      case 'missing_token':
        return 'Missing payment information. Please try again.';
      case 'capture_failed':
        return 'Payment capture failed. Your payment was not completed.';
      case 'capture_error':
        return 'An error occurred while processing your payment.';
      default:
        return 'An unexpected error occurred with your payment.';
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface border border-border rounded-xl p-8 text-center">
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">
          Payment Failed<span className="text-red-500">_</span>
        </h1>
        
        <p className="text-muted mb-8">
          {getErrorMessage()}
        </p>
        
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-8 text-left">
          <h3 className="text-red-500 font-semibold mb-2 text-sm">What you can do:</h3>
          <ul className="text-sm text-muted space-y-2">
            <li>• Check your PayPal account for any issues</li>
            <li>• Ensure you have sufficient funds</li>
            <li>• Try again in a few minutes</li>
            <li>• Contact support if the issue persists</li>
          </ul>
        </div>
        
        <div className="flex flex-col gap-3">
          <Link
            href="/submit"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand text-dark font-mono font-medium rounded-lg hover:bg-brand-light transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Try Again
          </Link>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-surface border border-border text-white font-mono rounded-lg hover:border-brand/50 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <PaymentErrorContent />
    </Suspense>
  );
}
