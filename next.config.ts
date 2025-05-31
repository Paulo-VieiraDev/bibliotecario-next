import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "avatars.githubusercontent.com",
      // adicione outros domínios se necessário
    ],
  },
};

export default nextConfig;
