import type { NextConfig } from "next";

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

export default nextConfig;
