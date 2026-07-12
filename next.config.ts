import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/demo",
        destination: "/example",
        permanent: true,
      },
      {
        source: "/stories/:storySlug/:stageId",
        destination: "/stories/:storySlug?stage=:stageId",
        permanent: true,
      },
      {
        source: "/glossary",
        destination: "/concepts",
        permanent: true,
      },
      {
        source: "/glossary/:termId",
        destination: "/concepts/:termId",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
