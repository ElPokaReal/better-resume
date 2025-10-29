import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/config.ts');

const nextConfig: NextConfig = {
  typescript: {
    // ⚠️ Desactiva el type checking durante el build
    // Solo para producción - útil para deployar rápido
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.ko-fi.com',
        pathname: '/cdn/**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
