import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Server, Shield, Wrench, Unlock } from 'lucide-react';
import { SearchBar } from '@/components/ui';
import { getSelfHostedAlternatives } from '@/lib/supabase/queries';
import { SelfHostedGrid } from './SelfHostedGrid';

export const metadata: Metadata = {
  title: 'Self-Hosted Open Source Software - Privacy & Control',
  description: 'Discover self-hosted open source alternatives you can run on your own servers. Complete control over your data, enhanced privacy, and freedom from vendor lock-in. 100+ solutions available.',
  alternates: {
    canonical: '/self-hosted',
  },
};

export const revalidate = 60;

export default async function SelfHostedPage() {
  const selfHostedAlternatives = await getSelfHostedAlternatives();

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="relative bg-surface/50 border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/"
            className="inline-flex items-center text-muted hover:text-brand font-mono text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            cd ../home
          </Link>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-14 h-14 bg-brand/10 border border-brand/30 rounded-xl flex items-center justify-center">
              <Server className="w-7 h-7 text-brand" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Self-Hosted<span className="text-brand">_</span>
              </h1>
              <p className="text-muted font-mono text-sm">
                {selfHostedAlternatives.length} solutions available
              </p>
            </div>
          </div>
          <p className="text-muted font-mono text-sm max-w-2xl mb-6">
            <span className="text-brand">$</span> Deploy on your own infrastructure for maximum control and privacy.
          </p>
          <div className="max-w-xl">
            <SearchBar placeholder="Search self-hosted alternatives..." />
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-surface/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-brand" />
              <div>
                <h3 className="font-semibold text-white">Complete Privacy</h3>
                <p className="text-xs font-mono text-muted">Your data stays on your servers</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Wrench className="w-5 h-5 text-brand" />
              <div>
                <h3 className="font-semibold text-white">Full Customization</h3>
                <p className="text-xs font-mono text-muted">Modify and extend as needed</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Unlock className="w-5 h-5 text-brand" />
              <div>
                <h3 className="font-semibold text-white">No Vendor Lock-in</h3>
                <p className="text-xs font-mono text-muted">Switch or migrate anytime</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alternatives Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SelfHostedGrid alternatives={selfHostedAlternatives} />
      </div>
    </div>
  );
}
