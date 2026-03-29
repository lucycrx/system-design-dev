import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/stories/:storySlug/:stageId",
        destination: "/stories/:storySlug?stage=:stageId",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
