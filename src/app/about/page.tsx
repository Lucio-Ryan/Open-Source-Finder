import { Metadata } from 'next';
import Link from 'next/link';
import { Terminal, Database, Users, TrendingUp, Search, Github, Code, Unlock } from 'lucide-react';

export const metadata: Metadata = {
title: 'About OS Finder - Community-Curated Open Source Alternatives',
  description: 'The largest community-curated database of open source alternatives. User-ranked listings with real GitHub stats, powerful search, and a commitment to software freedom against unfair SaaS monetization.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-dark">
      {/* Hero */}
      <div className="bg-gradient-to-br from-dark via-surface to-dark text-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link
            href="/"
            className="inline-flex items-center text-muted hover:text-brand mb-6 font-mono text-sm"
          >
            <Terminal className="w-4 h-4 mr-2" />
            cd ../home
          </Link>
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 font-mono">
              About<span className="text-brand">_</span>
            </h1>
            <p className="text-xl text-muted leading-relaxed">
              The largest community-curated database of open source alternatives. 
              Discover, rank, and contribute to trusted listings backed by real GitHub statistics.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission */}
        <section className="mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Unlock className="w-8 h-8 text-brand" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 font-mono">
              <span className="text-brand">// </span>WHY WE EXIST<span className="text-brand">_</span>
            </h2>
            <p className="text-lg text-muted leading-relaxed mb-4">
              Open source software liberates users. It provides transparency, control, and freedom 
              that proprietary software deliberately denies. Yet the industry is plagued by unfair 
              SaaS monetization practices that lock users into expensive subscriptions and extract 
              recurring revenue for features that should be owned, not rented.
            </p>
            <p className="text-lg text-muted leading-relaxed">
              This platform exists as a counter to that model - a comprehensive resource for 
              discovering open source alternatives that respect your freedom, your wallet, and 
              your right to own the tools you use. Built by someone with a deep affinity for 
              the open source ethos and a commitment to helping others break free from proprietary chains.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-10 font-mono">
            <span className="text-brand">// </span>WHAT MAKES US DIFFERENT<span className="text-brand">_</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-surface rounded-xl border border-border p-8 text-center">
              <div className="w-14 h-14 bg-brand/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Database className="w-7 h-7 text-brand" />
              </div>
              <h3 className="font-semibold text-xl text-white mb-3 font-mono">Largest Database</h3>
              <p className="text-muted">
                The most comprehensive collection of open source alternatives, continuously 
                growing with community submissions.
              </p>
            </div>
            <div className="bg-surface rounded-xl border border-border p-8 text-center">
              <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="font-semibold text-xl text-white mb-3 font-mono">Community Curated</h3>
              <p className="text-muted">
                Every listing is submitted by users like you. The community votes and ranks 
                alternatives based on real experience.
              </p>
            </div>
            <div className="bg-surface rounded-xl border border-border p-8 text-center">
              <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="font-semibold text-xl text-white mb-3 font-mono">Powerful Search</h3>
              <p className="text-muted">
                Lightning-fast search with intelligent filters by category, tech stack, 
                self-hosting options, and more.
              </p>
            </div>
            <div className="bg-surface rounded-xl border border-border p-8 text-center">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Github className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-xl text-white mb-3 font-mono">Trusted Data</h3>
              <p className="text-muted">
                All metrics pulled directly from GitHub - stars, forks, commits, and contributors. 
                No fake numbers, just facts.
              </p>
            </div>
          </div>
        </section>

        {/* How We Rank */}
        <section className="mb-16">
          <div className="bg-surface rounded-xl border border-border p-8 md:p-12">
            <h2 className="text-3xl font-bold text-white mb-6 font-mono">
              <span className="text-brand">// </span>USER RANKINGS & TRUST<span className="text-brand">_</span>
            </h2>
            <p className="text-muted mb-8">
              We combine community voting with real GitHub statistics to surface the best alternatives. 
              Every metric is verifiable, and users decide what rises to the top:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1 font-mono">User Voting</h3>
                  <p className="text-muted text-sm">
                    Community members upvote the alternatives they trust and use. Your voice shapes the rankings.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Github className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1 font-mono">GitHub Metrics</h3>
                  <p className="text-muted text-sm">
                    Real-time stats: stars, forks, contributors, and activity. No inflated numbers or marketing hype.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Code className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1 font-mono">Active Development</h3>
                  <p className="text-muted text-sm">
                    We track recent commits and releases to ensure projects are maintained and evolving.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1 font-mono">Community Size</h3>
                  <p className="text-muted text-sm">
                    Larger contributor bases and active communities indicate sustainable, reliable projects.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section>
          <div className="bg-gradient-to-br from-brand/10 to-emerald-900/10 rounded-2xl border border-brand/20 p-8 md:p-12">
            <div className="max-w-3xl mx-auto">
              <div className="w-12 h-12 bg-brand/20 rounded-xl flex items-center justify-center mb-6">
                <Unlock className="w-6 h-6 text-brand" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 font-mono">
                Open Source Liberates Users<span className="text-brand">_</span>
              </h2>
              <p className="text-muted mb-4 leading-relaxed">
                This platform was built by someone who deeply believes in the power of open source 
                to liberate users from the predatory practices of modern software companies. Too many 
                SaaS businesses prioritize extraction over value, locking features behind paywalls and 
                subscription tiers designed to maximize lifetime revenue rather than user empowerment.
              </p>
              <p className="text-muted mb-4 leading-relaxed">
                Open source offers an alternative path. It says: you should own your tools, understand 
                how they work, modify them to your needs, and never be held hostage by a company that 
                can change terms, raise prices, or shut down services on a whim.
              </p>
              <p className="text-muted leading-relaxed">
                This isn&apos;t just a directory - it&apos;s a resource for digital freedom. Every alternative 
                listed here represents a choice to reject unfair monetization and embrace software that 
                respects users. The community curates it. GitHub validates it. And together, we make it 
                easier for everyone to choose freedom.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
