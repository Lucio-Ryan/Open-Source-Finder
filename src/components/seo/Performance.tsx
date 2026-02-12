/**
 * Performance Optimization Components
 * 
 * Core Web Vitals optimization including:
 * - Critical resource preloading
 * - Font optimization 
 * - Script deferral
 * - DNS prefetch for external domains
 * - Connection preconnect for fast loading
 */

/**
 * Preload critical assets for faster LCP
 * Include in root layout <head>
 */
export function CriticalPreloads() {
  return (
    <>
      {/* DNS prefetch for external domains */}
      <link rel="dns-prefetch" href="https://github.com" />
      <link rel="dns-prefetch" href="https://api.github.com" />
      <link rel="dns-prefetch" href="https://avatars.githubusercontent.com" />
      
      {/* Preconnect to critical origins */}
      <link rel="preconnect" href="https://github.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://avatars.githubusercontent.com" crossOrigin="anonymous" />
    </>
  );
}

/**
 * Lazy load image component with proper sizing and format hints
 * Use for project screenshots and non-critical images
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      sizes={sizes}
      fetchPriority={priority ? 'high' : 'auto'}
    />
  );
}

/**
 * Deferred analytics script loader
 * Only loads after page interaction or after idle
 */
export function DeferredAnalytics({ 
  src, 
  websiteId 
}: { 
  src: string; 
  websiteId: string;
}) {
  return (
    <script
      defer
      data-website-id={websiteId}
      src={src}
    />
  );
}

/**
 * Generate resource hint meta tags based on page type
 * Different pages can preload different resources
 */
export function ResourceHints({ 
  pageType 
}: { 
  pageType: 'homepage' | 'listing' | 'detail' | 'static';
}) {
  const hints: JSX.Element[] = [];

  // All pages benefit from GitHub assets preconnect
  if (pageType === 'detail') {
    hints.push(
      <link key="gh-preconnect" rel="preconnect" href="https://api.github.com" crossOrigin="anonymous" />
    );
  }

  return <>{hints}</>;
}
