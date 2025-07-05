import { defineConfig, devices } from "@playwright/test";
import { nxE2EPreset } from "@nx/playwright/preset";
import { workspaceRoot } from "@nx/devkit";

const baseURL = process.env.BASE_URL || "http://localhost:3000";

export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: "./src" }),
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: {
    command: "pnpm exec nx run @j5/hackathon:start",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    cwd: workspaceRoot,
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
