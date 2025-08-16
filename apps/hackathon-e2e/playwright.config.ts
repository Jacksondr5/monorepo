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
  ...nxE2EPreset(import.meta.dirname, { testDir: "./test" }),
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: {
    command: "pnpm exec nx run @j5/hackathon:start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    // cwd: workspaceRoot,
  },
  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: "chromium",
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"] },
    },

    // {
    //   name: "firefox",
    //   dependencies: ["setup"],
    //   use: { ...devices["Desktop Firefox"] },
    // },

    // {
    //   name: "webkit",
    //   dependencies: ["setup"],
    //   use: { ...devices["Desktop Safari"] },
    // },

    /* {
      name: 'Mobile Chrome',
      dependencies: ["setup"],
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      dependencies: ["setup"],
      use: { ...devices['iPhone 12'] },
    }, */

    /* {
      name: 'Microsoft Edge',
      dependencies: ["setup"],
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      dependencies: ["setup"],
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    } */
  ],
});
