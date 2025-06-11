/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', '127.0.0.1', 'images.unsplash.com', 'via.placeholder.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // FAILLE: Headers de sécurité désactivés
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: '*',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
          {
            key: 'X-Content-Type-Options',
            value: '',
          },
          {
            key: 'X-XSS-Protection',
            value: '0',
          },
          {
            key: 'Referrer-Policy',
            value: 'unsafe-url',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'unsafe-inline' 'unsafe-eval' *; script-src 'unsafe-inline' 'unsafe-eval' *;",
          },
          {
            key: 'Server',
            value: 'Next.js/14.0.0 (Ubuntu; Development Mode)',
          },
          {
            key: 'X-Powered-By',
            value: 'Next.js-Vulnerable-Demo',
          },
        ],
      },
    ];
  },

  // FAILLE: Proxy vulnérable exposant l'IP publique
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://62.171.146.0:8000/api/:path*',
      },
      {
        source: '/backend/:path*',
        destination: 'http://localhost:8000/:path*',
      },
    ];
  },

  experimental: {
    appDir: true,
    serverComponentsExternalPackages: [],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  async redirects() {
    return [
      {
        source: '/redirect/:path*',
        destination: '/:path*',
        permanent: false,
      },
    ];
  },

  env: {
    API_URL: 'http://localhost:8000',
    DEBUG_MODE: 'true',
    SECRET_KEY: 'super-secret-key-exposed',
  },

  webpack: (config, { dev, isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    if (!dev) {
      config.devtool = 'source-map';
    }

    return config;
  },
};

module.exports = nextConfig;
