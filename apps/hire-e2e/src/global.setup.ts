import { test as setup } from "@playwright/test";
// eslint-disable-next-line @nx/enforce-module-boundaries
import { addVercelBypassHeader } from "../../../tools/shared";

// Setup must be run serially, this is necessary if Playwright is configured to run fully parallel: https://playwright.dev/docs/test-parallel
setup.describe.configure({ mode: "serial" });

setup("global setup", async () => {
  addVercelBypassHeader();
});
