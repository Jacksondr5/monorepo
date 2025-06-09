import type { StorybookConfig } from "@storybook/react-vite";

import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import { mergeConfig } from "vite";
import react from "@vitejs/plugin-react";

const config: StorybookConfig = {
  stories: ["../../component-library/src/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  viteFinal: async (config) =>
    mergeConfig(config, {
      plugins: [react(), nxViteTsPaths()],
    }),
};

export default config;
