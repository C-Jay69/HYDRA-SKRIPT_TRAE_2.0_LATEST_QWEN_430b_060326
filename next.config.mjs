/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Keep native-only packages out of the webpack bundle
  serverExternalPackages: [
    'onnxruntime-node',
    '@xenova/transformers',
    'sharp',
    'bullmq',
    'ioredis',
  ],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
