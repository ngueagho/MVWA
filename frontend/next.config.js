// next.config.js - Version corrigée avec vulnérabilités maintenues
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration des images avec domaines autorisés
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
    // Correction pour éviter les erreurs de chargement d'images
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // FAILLE: Headers de sécurité désactivés
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL', // FAILLE: Permet l'embedding en iframe
          },
          {
            key: 'X-Content-Type-Options',
            value: '', // FAILLE: Pas de protection MIME
          },
          {
            key: 'X-XSS-Protection',
            value: '0', // FAILLE: Protection XSS désactivée
          },
          {
            key: 'Referrer-Policy',
            value: 'unsafe-url', // FAILLE: Referrer non sécurisé
          },
          // FAILLE: Pas de CSP (Content Security Policy)
          {
            key: 'Content-Security-Policy',
            value: "default-src 'unsafe-inline' 'unsafe-eval' *; script-src 'unsafe-inline' 'unsafe-eval' *;", // TRÈS DANGEREUX
          }
        ],
      },
    ];
  },

  // FAILLE: Configuration CSP faible + Proxy API vulnérable
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*', // FAILLE: Proxy sans validation
      },
      // FAILLE: Exposition du backend
      {
        source: '/backend/:path*',
        destination: 'http://localhost:8000/:path*',
      },
    ];
  },

  // Corrections pour les erreurs de chargement
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: [],
  },

  // Ignorer les erreurs de build pour la démo
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },

  // Configuration du serveur de développement
  async redirects() {
    return [
      // FAILLE: Redirection ouverte possible
      {
        source: '/redirect/:path*',
        destination: '/:path*',
        permanent: false,
      },
    ];
  },

  // FAILLE: Variables d'environnement exposées côté client
  env: {
    API_URL: 'http://localhost:8000',
    DEBUG_MODE: 'true',
    SECRET_KEY: 'super-secret-key-exposed', // FAILLE CRITIQUE
  },

  // Configuration webpack personnalisée (pour éviter certaines erreurs)
  webpack: (config, { dev, isServer }) => {
    // Correction pour les modules externes
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // FAILLE: Source maps exposées en production
    if (!dev) {
      config.devtool = 'source-map'; // FAILLE: Expose le code source
    }

    return config;
  },

  // FAILLE: Headers CORS permissifs (si utilisé comme API)
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // FAILLE: CORS trop permissif
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: '*', // FAILLE: Headers non restreints
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
          // FAILLE: Exposition d'informations serveur
          {
            key: 'Server',
            value: 'Next.js/14.0.0 (Ubuntu; Development Mode)', // FAILLE: Info leakage
          },
          {
            key: 'X-Powered-By',
            value: 'Next.js-Vulnerable-Demo', // FAILLE: Fingerprinting
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
