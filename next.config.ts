import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
    // dirs:["src"]
  },
  transpilePackages: ['@t3-oss/env-nextjs', '@t3-oss/env-core'],

};

export default nextConfig;
