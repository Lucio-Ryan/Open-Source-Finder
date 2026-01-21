'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import { Suspense } from 'react';

function PaymentCancelledContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface border border-border rounded-xl p-8 text-center">
        <div className="w-20 h-20 bg-yellow-500/10 border border-yellow-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-yellow-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">
          Payment Cancelled<span className="text-yellow-500">_</span>
        </h1>
        
        <p className="text-muted mb-8">
          Your payment was cancelled. No charges have been made to your account.
        </p>
        
        <div className="bg-surface-light border border-border rounded-lg p-4 mb-8 text-left">
          <h3 className="text-white font-semibold mb-2 text-sm">Don&apos;t worry!</h3>
          <ul className="text-sm text-muted space-y-2">
            <li>• Your submission is still saved</li>
            <li>• You can complete payment anytime</li>
            <li>• No data has been lost</li>
          </ul>
        </div>
        
        <div className="flex flex-col gap-3">
          <Link
            href="/submit"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand text-dark font-mono font-medium rounded-lg hover:bg-brand-light transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </Link>
          
          <Link
            href="/dashboard/advertisements"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-surface border border-border text-white font-mono rounded-lg hover:border-brand/50 transition-colors"
          >
            Go to Dashboard
          </Link>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-muted hover:text-white font-mono transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelledPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <PaymentCancelledContent />
    </Suspense>
  );
}
