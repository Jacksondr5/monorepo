import baseConfig from "../../eslint.config.mjs";
import jsonc from "jsonc-eslint-parser";

export default [
  ...baseConfig,
  {
    files: ["**/*.json"],
    rules: {
      "@nx/dependency-checks": [
        "error",
        {
          ignoredFiles: ["{projectRoot}/eslint.config.{js,cjs,mjs}"],
        },
      ],
    },
    languageOptions: {
      parser: jsonc,
    },
  },
];
