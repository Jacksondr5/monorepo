import baseConfig from "../../eslint.config.mjs";
import jsonc from "jsonc-eslint-parser";

const config = [
  ...baseConfig,
  {
    files: ["**/*.json"],
    languageOptions: {
      parser: jsonc,
    },
  },
];

export default config;
