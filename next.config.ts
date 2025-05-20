/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Désactiver complètement ESLint pour le build
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['app', 'components', 'pages', 'lib', 'src'],
  },
  // Configuration avancée des images
  images: {
    domains: ['placehold.co'],
    unoptimized: true,
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '**',
      },
    ],
  },
  // Supprime les erreurs de dépendances circulaires
  webpack: (config: any) => {
    config.infrastructureLogging = {
      level: 'error',
    };
    return config;
  },
};

export default nextConfig;
