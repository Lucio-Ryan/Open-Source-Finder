import { Metadata } from 'next';
import { Megaphone, Monitor, MessageSquare, LayoutGrid, Users, TrendingUp, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Advertise on OSS Finder - Reach Open Source Enthusiasts',
  description: 'Promote your product to an engaged audience of developers, tech leaders, and open source enthusiasts. Free advertising placements available.',
  alternates: {
    canonical: '/advertise',
  },
};

const adTypes = [
  {
    id: 'banner',
    name: 'Banner Ad',
    description: 'Premium placement below the header on every page. Maximum visibility for your brand.',
    icon: Monitor,
    features: [
      'Appears on all pages',
      'Full-width banner placement',
      'Custom headline and CTA',
      'Company logo display'
    ],
    price: 'Free',
    href: '/advertise/banner',
    color: 'brand',
  },
  {
    id: 'popup',
    name: 'Popup Card',
    description: 'Floating card in the bottom-right corner. Rotates between up to 5 advertisers.',
    icon: MessageSquare,
    features: [
      'Bottom-right floating position',
      'Auto-rotates with other ads',
      'Rich card format',
      'Minimizable by users'
    ],
    price: 'Free',
    href: '/advertise/popup',
    color: 'orange-400',
  },
  {
    id: 'card',
    name: 'Grid Card Ad',
    description: 'Blend into the alternatives grid. Appear alongside open source projects.',
    icon: LayoutGrid,
    features: [
      'Appears in alternatives grids',
      'Matches card design style',
      'Icon and description',
      'Multiple page placements'
    ],
    price: 'Free',
    href: '/advertise/card',
    color: 'purple-400',
  },
];

const stats = [
  { label: 'Monthly Visitors', value: '50K+', icon: Users },
  { label: 'Listed Projects', value: '200+', icon: Star },
  { label: 'Monthly Growth', value: '25%', icon: TrendingUp },
];

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
              <span className="gradient-text-brand">OSS Finder_</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted mb-8 max-w-2xl mx-auto font-mono">
              <span className="text-brand">{'>'}</span> Reach an engaged community of developers, 
              tech leaders, and open source enthusiasts.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className="w-5 h-5 text-brand mr-2" />
                    <span className="text-2xl font-bold text-white">{stat.value}</span>
                  </div>
                  <span className="text-xs font-mono text-muted">{stat.label}</span>
                </div>
              ))}
            </div>
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

      {/* Ad Types Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-brand font-mono text-sm mb-3">// ADVERTISING OPTIONS</p>
            <h2 className="text-3xl font-bold text-white">
              Choose Your Placement<span className="text-brand">_</span>
            </h2>
            <p className="text-muted font-mono text-sm mt-4">
              All advertising options are currently <span className="text-brand font-bold">FREE</span> during our launch period.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {adTypes.map((adType) => (
              <div 
                key={adType.id} 
                className="bg-surface border border-border rounded-xl p-6 hover:border-brand/50 transition-all group relative overflow-hidden"
              >
                {/* Price badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-brand/10 border border-brand/30 rounded-full text-brand text-xs font-mono font-bold">
                    {adType.price}
                  </span>
                </div>

                <div className={`w-14 h-14 bg-${adType.color}/10 border border-${adType.color}/30 rounded-xl flex items-center justify-center mb-5`}>
                  <adType.icon className={`w-7 h-7 text-${adType.color}`} />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-2">{adType.name}</h3>
                <p className="text-muted text-sm font-mono mb-6">{adType.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {adType.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-muted font-mono">
                      <span className="text-brand mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link
                  href={adType.href}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand text-dark font-mono text-sm font-medium rounded-lg hover:bg-brand-light transition-all group-hover:shadow-glow"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-surface/30 border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to reach developers?<span className="text-brand">_</span>
          </h2>
          <p className="text-muted font-mono text-sm mb-8">
            Submit your advertisement today. Our team will review it and get it live within 24-48 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/advertise/banner"
              className="px-6 py-3 bg-brand text-dark font-mono text-sm font-medium rounded-lg hover:bg-brand-light transition-all hover:shadow-glow"
            >
              Submit Banner Ad
            </Link>
            <Link
              href="/advertise/popup"
              className="px-6 py-3 bg-surface border border-border text-white font-mono text-sm rounded-lg hover:border-brand/50 transition-all"
            >
              Submit Popup Ad
            </Link>
            <Link
              href="/advertise/card"
              className="px-6 py-3 bg-surface border border-border text-white font-mono text-sm rounded-lg hover:border-brand/50 transition-all"
            >
              Submit Card Ad
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
