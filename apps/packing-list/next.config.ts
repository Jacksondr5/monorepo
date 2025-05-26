import { composePlugins, withNx } from "@nx/next";
// Importing the file to validate env during build
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { env } from "./src/env";
import { WithNxOptions } from "@nx/next/plugins/with-nx";

const nextConfig: WithNxOptions = {
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {},
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

export default composePlugins(...plugins)(nextConfig);
