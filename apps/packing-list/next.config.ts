import { composePlugins, withNx } from "@nx/next";
import { NextConfig } from "next";
// Importing the file to validate env during build
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { env } from "./src/env";

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {},
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

export default composePlugins(...plugins)(nextConfig);
