import { clerk, setupClerkTestingToken } from "@clerk/testing/playwright";
import { test } from "../src/fixtures";
import { expect } from "@playwright/test";
import { env } from "../src/env";

test("logged in UI", async ({ page }) => {
  await setupClerkTestingToken({ page });

  await page.goto("/");
  await clerk.signIn({
    page,
    emailAddress: env.PLAYWRIGHT_USER_EMAIL,
  });
  await expect(page.getByTestId("sign-out-button")).toBeVisible();
});
