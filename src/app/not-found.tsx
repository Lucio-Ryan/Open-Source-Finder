import Link from 'next/link';
import { Home, Terminal } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="text-center px-4">
        <div className="terminal-box max-w-md mx-auto mb-8">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            <span className="ml-4 text-muted text-xs font-mono">error.sh</span>
          </div>
          <div className="p-6">
            <div className="font-pixel text-6xl text-brand mb-4">404</div>
            <p className="font-mono text-muted text-sm">
              <span className="text-red-400">Error:</span> Page not found
            </p>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">
          Page Not Found<span className="text-brand">_</span>
        </h1>
        <p className="text-muted font-mono text-sm mb-8 max-w-md mx-auto">
          <span className="text-brand">$</span> The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-brand text-dark font-mono font-semibold rounded-lg hover:bg-brand-light transition-all hover:shadow-glow"
          >
            <Home className="w-5 h-5 mr-2" />
            cd /home
          </Link>
          <Link
            href="/alternatives"
            className="inline-flex items-center px-6 py-3 bg-surface border border-border text-white font-mono rounded-lg hover:border-brand/50 transition-colors"
          >
            Browse Alternatives
          </Link>
        </div>
      </div>
    </div>
  );
}
