import { generateViteConfig } from "@j5/config";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  ...generateViteConfig({
    name: "chromatic",
    dirName: __dirname,
    entry: "src/index.ts",
    tsconfigTarget: "tsconfig.storybook.json",
  })(),
  plugins: [
    react({
      babel: {
        plugins: [
          ["@vitejs/plugin-react/babel-plugin", { runtime: "automatic" }],
        ],
      },
    }),
  ],
});
