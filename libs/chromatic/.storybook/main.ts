import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: [
    "../../component-library/src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../../../apps/hackathon/src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../../../apps/todo/src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
  ],
  framework: {
    name: getAbsolutePath("@storybook/nextjs-vite"),
    options: {},
  },
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
