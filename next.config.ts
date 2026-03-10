import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dev-api.amunisiptn.com",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
