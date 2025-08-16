import { defineConfig, devices } from "@playwright/test";
import { nxE2EPreset } from "@nx/playwright/preset";
import { workspaceRoot } from "@nx/devkit";

import { readFileSync, existsSync } from "fs";
import { join } from "path";

function getBaseURL(): string {
  // 1. Check environment variable first
  if (process.env.BASE_URL) {
    console.log(
      "Using BASE_URL from environment variable:",
      process.env.BASE_URL,
    );
    return process.env.BASE_URL;
  }

  // 2. Check .vercel-url file
  const vercelUrlPath = join(import.meta.dirname, ".vercel-url");
  if (existsSync(vercelUrlPath)) {
    try {
      const url = readFileSync(vercelUrlPath, "utf-8").trim();
      if (url) {
        console.log("Using BASE_URL from .vercel-url file:", url);
        return url;
      }
    } catch (error) {
      console.warn("Failed to read .vercel-url file:", error);
    }
  }

  // 3. Fall back to localhost:3000
  console.log("Using BASE_URL from localhost:3000");
  return "http://localhost:3000";
}

const baseURL = getBaseURL();

export default defineConfig({
  ...nxE2EPreset(import.meta.dirname, { testDir: "./src" }),
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: {
    command: "pnpm exec nx run @j5/packing-list:start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    // cwd: workspaceRoot,
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
