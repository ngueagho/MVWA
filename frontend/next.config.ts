/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost', 
      '127.0.0.1',
      'images.unsplash.com',  // Ajout d'Unsplash
      'via.placeholder.com',  // Placeholder images
      'picsum.photos',         // Alternative images
      'urbantendance.propentatech.com/'
    ],
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
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      }
    ],
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
          }
        ],
      },
    ]
  },
  // FAILLE: Configuration CSP faible
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://62.171.146.0:8000/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig