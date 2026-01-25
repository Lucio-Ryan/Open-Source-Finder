'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Terminal, Mail } from 'lucide-react';

interface SiteSettings {
  showLegalSection: boolean;
  showSubmitResourcesFooter: boolean;
}

export function Footer() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    showLegalSection: true,
    showSubmitResourcesFooter: true,
  });

  // Fetch site settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/site-settings');
        if (response.ok) {
          const data = await response.json();
          setSiteSettings({
            showLegalSection: data.showLegalSection ?? true,
            showSubmitResourcesFooter: data.showSubmitResourcesFooter ?? true,
          });
        }
      } catch (error) {
        console.error('Failed to fetch site settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const footerLinks = {
    product: [
      { name: 'All Alternatives', href: '/alternatives' },
      { name: 'Categories', href: '/categories' },
      { name: 'Self-Hosted', href: '/self-hosted' },
      { name: 'Tech Stacks', href: '/tech-stacks' },
    ],
    resources: [
      { name: 'About Us', href: '/about' },
      ...(siteSettings.showSubmitResourcesFooter ? [{ name: 'Submit Project', href: '/submit' }] : []),
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Refund Policy', href: '/refund' },
    ],
  };

  return (
    <footer className="bg-dark border-t border-border">
      {/* Grid background effect */}
      <div className="relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
            {/* Brand */}
            <div className="col-span-2 sm:col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6 group">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-brand/10 border border-brand/30 rounded-lg flex items-center justify-center group-hover:border-brand/60 transition-colors">
                  <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-brand" />
                </div>
                <span className="font-pixel text-xs sm:text-sm text-white tracking-wider">
                  OPEN<span className="text-brand">_</span>SRC<span className="text-brand">.</span>ME
                </span>
              </Link>
              <p className="text-muted text-xs sm:text-sm font-mono leading-relaxed mb-4 sm:mb-6">
                <span className="text-brand">$</span> Discover the best open source alternatives to proprietary software.
              </p>
              <div className="flex items-center space-x-3">
                <a
                  href="mailto:hello@opensrc.me"
                  className="p-2 sm:p-2.5 bg-surface border border-border text-muted hover:text-brand hover:border-brand/30 rounded-lg transition-all touch-manipulation"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-mono text-brand text-xs sm:text-sm mb-3 sm:mb-4">// Product</h3>
              <ul className="space-y-2 sm:space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted hover:text-white transition-colors text-xs sm:text-sm font-mono group touch-manipulation inline-block py-0.5"
                    >
                      <span className="text-brand/50 group-hover:text-brand">{'>'}</span> {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="font-mono text-brand text-xs sm:text-sm mb-3 sm:mb-4">// Resources</h3>
              <ul className="space-y-2 sm:space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted hover:text-white transition-colors text-xs sm:text-sm font-mono group touch-manipulation inline-block py-0.5"
                    >
                      <span className="text-brand/50 group-hover:text-brand">{'>'}</span> {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            {siteSettings.showLegalSection && (
              <div>
                <h3 className="font-mono text-brand text-xs sm:text-sm mb-3 sm:mb-4">// Legal</h3>
                <ul className="space-y-2 sm:space-y-3">
                  {footerLinks.legal.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-muted hover:text-white transition-colors text-xs sm:text-sm font-mono group touch-manipulation inline-block py-0.5"
                      >
                        <span className="text-brand/50 group-hover:text-brand">{'>'}</span> {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Bottom Bar */}
          <div className="mt-10 sm:mt-12 lg:mt-16 pt-6 sm:pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <p className="text-muted text-[10px] sm:text-xs font-mono text-center sm:text-left">
                <span className="text-brand">©</span> {new Date().getFullYear()} OPEN_SRC.ME. Built with{' '}
                <span className="text-brand">♥</span> for the open source community.
              </p>
              <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-mono text-muted">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand rounded-full animate-pulse"></span>
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
