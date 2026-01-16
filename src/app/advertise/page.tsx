'use client';

import { Megaphone, Users, TrendingUp, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdvertisePage() {
  return (
    <div className="min-h-screen bg-dark">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-brand/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-surface border border-border rounded-full text-brand font-mono text-sm mb-8">
              <Megaphone className="w-4 h-4 mr-2" />
              <code>$ advertise --reach-developers</code>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
              Advertise on
              <br />
              <span className="gradient-text-brand">OS Finder_</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted mb-8 max-w-2xl mx-auto font-mono">
              <span className="text-brand">{'>'}</span> Reach an engaged community of developers, 
              tech leaders, and open source enthusiasts.
            </p>

            <Link
              href="/advertise/card"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand text-dark font-mono text-sm font-medium rounded-lg hover:bg-brand-light transition-all hover:shadow-glow mb-12"
            >
              Create ad
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent"></div>
      </section>

      {/* Why Advertise Section */}
      <section className="py-16 bg-surface/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-brand font-mono text-sm mb-3">// WHY ADVERTISE WITH US</p>
            <h2 className="text-3xl font-bold text-white">
              Reach Your Target Audience<span className="text-brand">_</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="w-12 h-12 bg-brand/10 border border-brand/30 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-brand" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Engaged Audience</h3>
              <p className="text-muted text-sm font-mono">
                Our visitors are developers and tech leaders actively seeking new tools and solutions.
              </p>
            </div>
            
            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="w-12 h-12 bg-brand/10 border border-brand/30 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-brand" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Quality Traffic</h3>
              <p className="text-muted text-sm font-mono">
                High-intent visitors looking for software alternatives means better conversion rates.
              </p>
            </div>
            
            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="w-12 h-12 bg-brand/10 border border-brand/30 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-brand" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Growing Platform</h3>
              <p className="text-muted text-sm font-mono">
                Join early and grow with us. Our traffic and community are expanding rapidly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
