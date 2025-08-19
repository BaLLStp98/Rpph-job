import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/image/:path*',
        destination: '/api/image?file=:path*',
      },
    ];
  },
};

export default nextConfig;
