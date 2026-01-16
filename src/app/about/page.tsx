import { Metadata } from 'next';
import Link from 'next/link';
import { Terminal, Target, Users, Shield, Heart, Sparkles, Github } from 'lucide-react';

export const metadata: Metadata = {
title: 'About OS Finder - Our Mission',
  description: 'Learn about OS Finder and our mission to help individuals, developers, and organizations discover and adopt the best open source alternatives to proprietary software. Join our community.',
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
              We&apos;re on a mission to help individuals, developers, and organizations 
              discover and adopt open source alternatives to proprietary software.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission */}
        <section className="mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8 text-brand" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 font-mono">
              <span className="text-brand">// </span>MISSION<span className="text-brand">_</span>
            </h2>
            <p className="text-lg text-muted leading-relaxed">
              We believe that open source software represents the future of technology - 
              offering transparency, security, and freedom that proprietary solutions 
              cannot match. Our goal is to make it easy for everyone to find, evaluate, 
              and switch to open source alternatives.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-10 font-mono">
            <span className="text-brand">// </span>VALUES<span className="text-brand">_</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface rounded-xl border border-border p-8 text-center">
              <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="font-semibold text-xl text-white mb-3 font-mono">Privacy First</h3>
              <p className="text-muted">
                We prioritize tools that respect user privacy and give you control 
                over your data.
              </p>
            </div>
            <div className="bg-surface rounded-xl border border-border p-8 text-center">
              <div className="w-14 h-14 bg-brand/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-brand" />
              </div>
              <h3 className="font-semibold text-xl text-white mb-3 font-mono">Community Driven</h3>
              <p className="text-muted">
                Our directory grows through community contributions. Everyone can 
                submit and improve listings.
              </p>
            </div>
            <div className="bg-surface rounded-xl border border-border p-8 text-center">
              <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="font-semibold text-xl text-white mb-3 font-mono">Quality Curation</h3>
              <p className="text-muted">
                We carefully evaluate each alternative using health scores based on 
                activity, community, and maintenance.
              </p>
            </div>
          </div>
        </section>

        {/* How We Rank */}
        <section className="mb-16">
          <div className="bg-surface rounded-xl border border-border p-8 md:p-12">
            <h2 className="text-3xl font-bold text-white mb-6 font-mono">
              <span className="text-brand">// </span>RANKING<span className="text-brand">_</span>
            </h2>
            <p className="text-muted mb-8">
              Our health score system helps you quickly evaluate the quality and 
              reliability of open source projects:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-brand font-bold font-mono">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1 font-mono">GitHub Metrics</h3>
                  <p className="text-muted text-sm">
                    Stars, forks, and watchers indicate community interest and adoption.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-brand font-bold font-mono">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1 font-mono">Project Activity</h3>
                  <p className="text-muted text-sm">
                    Recent commits and releases show active maintenance.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-brand font-bold font-mono">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1 font-mono">Contributor Count</h3>
                  <p className="text-muted text-sm">
                    More contributors often means a healthier, more sustainable project.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-brand font-bold font-mono">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1 font-mono">Project Maturity</h3>
                  <p className="text-muted text-sm">
                    We balance project age with innovation to surface both established and emerging tools.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-brand to-emerald-600 rounded-2xl p-12 text-white">
            <Heart className="w-12 h-12 mx-auto mb-4 text-emerald-200" />
            <h2 className="text-3xl font-bold mb-4 font-mono">Join Our Community<span className="text-emerald-200">_</span></h2>
            <p className="text-emerald-100 mb-8 max-w-xl mx-auto">
              Help us grow the directory by submitting open source projects, 
              sharing feedback, or starring us on GitHub.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/submit"
                className="inline-flex items-center px-6 py-3 bg-white text-brand font-medium rounded-lg hover:bg-emerald-50 transition-colors font-mono"
              >
                ./submit --project
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-dark/20 text-white font-medium rounded-lg hover:bg-dark/30 transition-colors font-mono"
              >
                <Github className="w-5 h-5 mr-2" />
                git star
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
