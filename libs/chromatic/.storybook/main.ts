import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: [
    "../../component-library/src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../../../apps/hackathon/src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../../../apps/todo/src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
  ],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
};

export default config;
