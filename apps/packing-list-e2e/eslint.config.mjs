import playwright from "eslint-plugin-playwright";
import baseConfig from "../../eslint.config.mjs";

const config = [playwright.configs["flat/recommended"], ...baseConfig];

export default config;
