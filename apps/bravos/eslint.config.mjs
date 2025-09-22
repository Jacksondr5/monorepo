import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";
import js from "@eslint/js";
import baseConfig from "../../eslint.config.mjs";

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
});

const config = [
  ...baseConfig,
  ...compat.extends(
    "plugin:@nx/react-typescript",
    "next",
    "next/core-web-vitals",
    // TODO: enable: https://github.com/mdbetancourt/eslint-plugin-neverthrow/issues/21
    // "plugin:neverthrow/recommended",
  ),
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    rules: {
      "@next/next/no-html-link-for-pages": ["error", "apps/bravos/pages"],
    },
  },
  {
    ignores: [".next/**/*"],
  },
];

export default config;
