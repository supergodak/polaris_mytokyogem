import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // 開発用ツールバーを無効化（オプション）
    // devIndicators: false
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // EXIF情報による自動回転を制御（iOS表示問題対応）
    minimumCacheTTL: 60,
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;
