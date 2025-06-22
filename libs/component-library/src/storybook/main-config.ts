import type { StorybookConfig } from "@storybook/react-vite";

export const j5StorybookConfig = {
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  stories: ["../**/*.@(mdx|stories.@(js|jsx|ts|tsx))"],
} satisfies StorybookConfig;
