import { test, expect } from "@playwright/test";

test("shows home empty state", async ({ page }) => {
  await page.goto("/");

  // Expect h1 to contain a substring.
  await expect(page.getByRole("main")).toContainText(/Nothing here yet\.?/);
});
