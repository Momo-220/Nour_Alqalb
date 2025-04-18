/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimisation des images
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
  },
  
  // Configuration Turbopack (stable)
  turbopack: {
    // Configurations Turbopack si nécessaire
  },
  
  // Simplification du serveur et des options
  compress: true,
  poweredByHeader: false,
  
  // Désactivation des vérifications fastidieuses pour le développement
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Optimisation des headers pour le cache et la sécurité
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 