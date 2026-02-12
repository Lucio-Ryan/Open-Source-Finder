/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for Docker/Render.com deployment
  output: 'standalone',
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Allow data URLs for icon previews
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    // Image optimization settings
    minimumCacheTTL: 60 * 60 * 24, // Cache images for 24 hours
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  
  // Security and performance headers
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Compression enabled by default
  compress: true,
  
  // Increase static generation timeout for builds
  staticPageGenerationTimeout: 180,
  
  // Experimental performance optimizations
  experimental: {
    // Optimize package imports for faster builds and smaller bundles
    optimizePackageImports: ['lucide-react', '@tiptap/react', '@tiptap/starter-kit'],
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Production optimizations only
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        // Better tree-shaking
        sideEffects: true,
      };
    }
    return config;
  },
  
  // HTTP headers for caching, security, and performance
  async headers() {
    return [
      {
        // API routes caching
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=30, stale-while-revalidate=59',
          },
        ],
      },
      {
        // OG images - longer cache
        source: '/:path*/opengraph-image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // Twitter images - longer cache
        source: '/:path*/twitter-image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // Static assets caching (immutable)
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|woff|woff2|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Programmatic SEO pages - ISR friendly caching
        source: '/(alternatives|categories|languages|tags|tech-stacks|alternatives-to)/:slug*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
      {
        // Security headers for all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
