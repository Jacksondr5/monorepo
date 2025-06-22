import type { StorybookConfig } from "@storybook/react-vite";
import { j5StorybookConfig } from "@j5/component-library/storybook";

const config: StorybookConfig = {
  ...j5StorybookConfig,
  stories: [
    "../../component-library/src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../../../apps/hackathon/src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
  ],
};

export default config;
