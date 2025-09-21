import { test as base } from "@playwright/test";
import { addVercelBypassHeader } from "@j5/playwright";

export const test = base.extend({
  page: async ({ page, baseURL }, use) => {
    await addVercelBypassHeader(page, baseURL);
    // Hand control over to the test
    await use(page);
  },
});
