import { expect } from "@playwright/test";
import { test } from "./fixtures";

test("has title", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Create");
});
