/** @type {import('next').NextConfig} */
import withPlaiceholder from "@plaiceholder/next";

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
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 1024],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '**',
      },
    ],
  },
  // Supprime les erreurs de dépendances circulaires
  webpack: (config) => {
    config.infrastructureLogging = {
      level: 'error',
    };
    return config;
  },
};

export default withPlaiceholder(nextConfig); 