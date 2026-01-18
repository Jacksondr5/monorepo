import nx from "@nx/eslint-plugin";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import baseConfig from "../../eslint.config.mjs";

const config = [
  ...nextCoreWebVitals,
  ...baseConfig,
  ...nx.configs["flat/react-typescript"],
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    rules: {
      "@next/next/no-html-link-for-pages": ["error", "apps/coming-soon/pages"],
    },
  },
  {
    ignores: [".next/**/*"],
  },
];

export default config;
