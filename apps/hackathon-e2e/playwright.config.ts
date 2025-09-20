import { defineConfig, devices } from "@playwright/test";
import { nxE2EPreset } from "@nx/playwright/preset";
// eslint-disable-next-line @nx/enforce-module-boundaries
import { getBaseURL } from "../../tools/shared/src";

const baseURL = getBaseURL(import.meta.dirname, "hackathon");

export default defineConfig({
  ...nxE2EPreset(import.meta.dirname, { testDir: "./test" }),
  use: {
    baseURL,
    extraHTTPHeaders: {
      "x-vercel-protection-bypass":
        process.env.VERCEL_AUTOMATION_BYPASS_SECRET || "",
      // 'x-vercel-set-bypass-cookie': true | 'samesitenone'
    },
    trace: "on-first-retry",
  },
  // webServer: {
  //   command: "pnpm exec nx run @j5/hackathon:start",
  //   url: baseURL,
  //   reuseExistingServer: true,
  // },
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
