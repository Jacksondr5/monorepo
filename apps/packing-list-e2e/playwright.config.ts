import { defineConfig, devices } from "@playwright/test";
import { nxE2EPreset } from "@nx/playwright/preset";
import { workspaceRoot } from "@nx/devkit";

import { readFileSync, existsSync } from "fs";
import { join } from "path";

function getBaseURL(): string {
  // 1. Check environment variable first
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }

  // 2. Check .vercel-url file
  const vercelUrlPath = join(import.meta.dirname, ".vercel-url");
  if (existsSync(vercelUrlPath)) {
    try {
      const url = readFileSync(vercelUrlPath, "utf-8").trim();
      if (url) {
        return url;
      }
    } catch (error) {
      console.warn("Failed to read .vercel-url file:", error);
    }
  }

  // 3. Fall back to localhost:3000
  return "http://localhost:3000";
}

const baseURL = getBaseURL();

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  ...nxE2EPreset(import.meta.dirname, { testDir: "./src" }),
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },
  /* Run your local dev server before starting the tests */
  webServer: {
    command: "pnpm exec nx run @j5/packing-list:start",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    cwd: workspaceRoot,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    // Uncomment for mobile browsers support
    /* {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    }, */

    // Uncomment for branded browsers
    /* {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    } */
  ],
});
