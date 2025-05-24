import baseConfig from "../../eslint.config.mjs";
import jsonc from "jsonc-eslint-parser";

export default [
  ...baseConfig,
  {
    files: ["**/*.json"],
    languageOptions: {
      parser: jsonc,
    },
  },
];
