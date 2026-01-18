import nx from "@nx/eslint-plugin";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import baseConfig from "../../eslint.config.mjs";

const config = [
  ...nextCoreWebVitals,
  ...baseConfig,
  ...nx.configs["flat/react-typescript"],
  {
    ignores: [".next/**/*"],
  },
];

export default config;
