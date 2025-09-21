import { defineConfig, devices } from "@playwright/test";
import { nxE2EPreset } from "@nx/playwright/preset";
// eslint-disable-next-line @nx/enforce-module-boundaries
import { getBaseURL } from "../../tools/shared/src";

const baseURL = getBaseURL(import.meta.dirname, "hackathon");

export default defineConfig({
  ...nxE2EPreset(import.meta.dirname, { testDir: "./test" }),
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: {
    command: "pnpm exec nx run @j5/hackathon:start",
    reuseExistingServer: true,
    url: baseURL,
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
  ],
});
