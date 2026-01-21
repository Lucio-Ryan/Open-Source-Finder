import Link from 'next/link';
import { Terminal, Mail } from 'lucide-react';

export function Footer() {
  const footerLinks = {
    product: [
      { name: 'All Alternatives', href: '/alternatives' },
      { name: 'Categories', href: '/categories' },
      { name: 'Self-Hosted', href: '/self-hosted' },
      { name: 'Tech Stacks', href: '/tech-stacks' },
    ],
    resources: [
      { name: 'About Us', href: '/about' },
      { name: 'Submit Project', href: '/submit' },
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
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="col-span-1">
              <Link href="/" className="flex items-center space-x-3 mb-6 group">
                <div className="w-9 h-9 bg-brand/10 border border-brand/30 rounded-lg flex items-center justify-center group-hover:border-brand/60 transition-colors">
                  <Terminal className="w-5 h-5 text-brand" />
                </div>
                <span className="font-pixel text-sm text-white tracking-wider">
                  OS<span className="text-brand">_</span>FINDER
                </span>
              </Link>
              <p className="text-muted text-sm font-mono leading-relaxed mb-6">
                <span className="text-brand">$</span> Discover the best open source alternatives to proprietary software.
              </p>
              <div className="flex items-center space-x-3">
                <a
                  href="mailto:hello@osfinder.vercel.app"
                  className="p-2.5 bg-surface border border-border text-muted hover:text-brand hover:border-brand/30 rounded-lg transition-all"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-mono text-brand text-sm mb-4">// Product</h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted hover:text-white transition-colors text-sm font-mono group"
                    >
                      <span className="text-brand/50 group-hover:text-brand">{'>'}</span> {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="font-mono text-brand text-sm mb-4">// Resources</h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted hover:text-white transition-colors text-sm font-mono group"
                    >
                      <span className="text-brand/50 group-hover:text-brand">{'>'}</span> {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="font-mono text-brand text-sm mb-4">// Legal</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted hover:text-white transition-colors text-sm font-mono group"
                    >
                      <span className="text-brand/50 group-hover:text-brand">{'>'}</span> {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-muted text-xs font-mono">
                <span className="text-brand">©</span> {new Date().getFullYear()} OpenSourceFinder. Built with{' '}
                <span className="text-brand">♥</span> for the open source community.
              </p>
              <div className="flex items-center space-x-2 text-xs font-mono text-muted">
                <span className="w-2 h-2 bg-brand rounded-full animate-pulse"></span>
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
