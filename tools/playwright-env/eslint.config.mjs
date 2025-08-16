import baseConfig from "../../eslint.config.mjs";

export default [
  ...baseConfig,
  {
    files: ["tools/playwright-env/**/*.{ts,tsx,mts}"],
  },
];
