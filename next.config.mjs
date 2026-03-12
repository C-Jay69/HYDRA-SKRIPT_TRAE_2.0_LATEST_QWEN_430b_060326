/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Relaxed checks for faster builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
