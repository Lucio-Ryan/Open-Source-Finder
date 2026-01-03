/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ],
    // Allow data URLs for icon previews
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
  // Vercel deployment optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  // Increase static generation timeout for Vercel
  staticPageGenerationTimeout: 180,
}

module.exports = nextConfig
