import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))"],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
};

export default config;
