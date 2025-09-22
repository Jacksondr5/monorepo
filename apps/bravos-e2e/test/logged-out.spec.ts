import { expect } from "@playwright/test";
import { test } from "../src/fixtures";

test("logged out UI", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("signed-out-ui")).toContainText(
    /Sign in to start/,
  );
  await expect(page.getByTestId("sign-in-button")).toBeVisible();
});
