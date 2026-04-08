import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // 이미지 최적화
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [],
  },
  // 프로덕션에서 console.log 제거
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  // Turbopack 루트 명시 (상위 폴더에 다른 package-lock.json 존재 시 필요)
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
