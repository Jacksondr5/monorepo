import { composePlugins, withNx } from "@nx/next";
import { NextConfig } from "next";

const nextConfig = {
  nx: {
    svgr: false,
  },
  transpilePackages: ["convex-helpers"],
  images: {
    remotePatterns: [
      {
        hostname: "img.clerk.com",
        protocol: "https",
      },
    ],
  },
} satisfies NextConfig;

const plugins = [withNx];

export default composePlugins(...plugins)(nextConfig);
