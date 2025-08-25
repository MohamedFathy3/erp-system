// next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  generateEtags: false,
  
  images: {
    domains: ['cdn.your-erp-domain.com', 'assets.your-erp-domain.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 604800, // أسبوع كامل
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  serverExternalPackages: [
    'mongoose',
    'lodash',
    'exceljs',
    'pdf-lib'
  ],
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  },
  
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    // workerThreads: true,
    cpus: 4
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
//  webpack: (config, { isServer, dev }) => {
//   if (!dev && !isServer) {
//     config.resolve.alias = {
//       ...(config.resolve.alias || {}),
//       react: 'preact/compat',
//       'react-dom/test-utils': 'preact/test-utils',
//       'react-dom': 'preact/compat',
//       'react/jsx-runtime': 'preact/jsx-runtime',
//     };
//   }


//   return config;
// },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  
  env: {
    MAX_SSR_COMPONENTS: '50',
    API_TIMEOUT: '10000',
    CACHE_TTL: '300000'
  }
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);