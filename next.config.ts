import type { NextConfig } from "next";
import bundleAnalyzer from '@next/bundle-analyzer';

// ✅ Phase 1.5 - Bundle Analyzer
// Usage: ANALYZE=true npm run build
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // ⚠️ DÉSACTIVE TURBOPACK (cause des fuites mémoire massives)
  turbopack: undefined,

  // ✅ OPTIMISATIONS MÉMOIRE (v15.0.0+)
  experimental: {
    webpackMemoryOptimizations: true,
  },

  // Optimisations générales
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // ✅ HEADERS HTTP - Cache optimisé (Phase 1.1)
  async headers() {
    return [
      {
        // Assets statiques - cache immuable (1 an)
        source: '/:all*(svg|jpg|png|webp|avif|woff|woff2|ttf|otf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // GeoJSON - cache 1 heure avec stale-while-revalidate
        source: '/geojson/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
          {
            key: 'Content-Type',
            value: 'application/geo+json',
          },
        ],
      },
      {
        // API routes - cache court avec revalidation
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
      {
        // Pages statiques - cache 1 heure
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // ✅ IMAGES - Optimisation automatique (Phase 1.4)
  // AVIF en priorité (30-50% plus petit que WebP)
  // Lazy loading automatique + responsive automatique
  images: {
    formats: ['image/avif', 'image/webp'], // AVIF en premier
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co', // Supabase Storage
      },
    ],
    minimumCacheTTL: 31536000, // 1 an
  },

  // Limite la taille des chunks pour réduire l'utilisation mémoire
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
            },
          },
        },
      };
    }
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
