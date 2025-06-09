import { composePlugins, withNx } from "@nx/next";
import { NextConfig } from "next";
// Importing the file to validate env during build
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { env } from "./src/env";

const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  // Add transpilePackages to handle packages with TypeScript source
  transpilePackages: ["convex-helpers"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
} satisfies NextConfig;

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

export default composePlugins(...plugins)(nextConfig);
