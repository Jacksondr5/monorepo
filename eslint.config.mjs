// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";
import js from "@eslint/js";
import nxEslintPlugin from "@nx/eslint-plugin";

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
});

const config = [
  {
    ignores: [
      "**/dist",
      "**/node_modules",
      "**/convex/_generated",
      "**/.next",
      "**/storybook-static",
      "**/out-tsc",
    ],
  },
  { plugins: { "@nx": nxEslintPlugin } },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    rules: {
      "@nx/enforce-module-boundaries": [
        "error",
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: "*",
              onlyDependOnLibsWithTags: ["*"],
            },
          ],
          allowCircularSelfDependency: true,
        },
      ],
    },
  },
  ...compat
    .config({
      extends: ["plugin:@nx/typescript"],
    })
    .map((config) => ({
      ...config,
      files: ["**/*.ts", "**/*.tsx", "**/*.cts", "**/*.mts"],
      rules: {
        ...config.rules,
      },
    })),
  ...compat
    .config({
      extends: ["plugin:@nx/javascript"],
    })
    .map((config) => ({
      ...config,
      files: ["**/*.js", "**/*.jsx", "**/*.cjs", "**/*.mjs"],
      rules: {
        ...config.rules,
      },
    })),
  ...compat
    .config({
      env: {
        jest: true,
      },
    })
    .map((config) => ({
      ...config,
      files: ["**/*.spec.ts", "**/*.spec.tsx", "**/*.spec.js", "**/*.spec.jsx"],
      rules: {
        ...config.rules,
      },
    })),
  ...storybook.configs["flat/recommended"],
];

export default config;
