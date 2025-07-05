import { test, expect } from "@playwright/test";
import {
  signInUser,
  signOutUser,
  isUserSignedIn,
  ensureUserSignedIn,
  ensureUserSignedOut,
  testUsers,
} from "./auth-utils";

test.describe("Authentication Utilities", () => {
  test("should handle unauthenticated state correctly", async ({ page }) => {
    // Ensure user is signed out
    await ensureUserSignedOut(page);

    // Navigate to home page
    await page.goto("/");

    // Verify user is not signed in
    const isSignedIn = await isUserSignedIn(page);
    expect(isSignedIn).toBe(false);

    // Verify we see unauthenticated UI elements
    await expect(page.locator('[data-testid="signed-out-ui"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="header-sign-in-button"]'),
    ).toBeVisible();

    // Verify we don't see authenticated UI elements
    await expect(
      page.locator('[data-clerk-component="UserButton"]'),
    ).not.toBeVisible();
  });

  test("should handle authenticated state correctly", async ({ page }) => {
    // Sign in the user
    await signInUser(page, testUsers.user);

    // Navigate to home page to check state
    await page.goto("/");

    // Verify user is signed in
    const isSignedIn = await isUserSignedIn(page);
    expect(isSignedIn).toBe(true);

    // Verify we see authenticated UI elements
    await expect(
      page.locator('[data-clerk-component="UserButton"]'),
    ).toBeVisible();

    // Verify we don't see unauthenticated UI elements
    await expect(
      page.locator('[data-testid="signed-out-ui"]'),
    ).not.toBeVisible();
    await expect(
      page.locator('[data-testid="header-sign-in-button"]'),
    ).not.toBeVisible();
  });

  test("should handle ensure functions correctly", async ({ page }) => {
    // Test ensureUserSignedOut when already signed out
    await ensureUserSignedOut(page);
    await page.goto("/");
    let isSignedIn = await isUserSignedIn(page);
    expect(isSignedIn).toBe(false);

    // Test ensureUserSignedIn
    await ensureUserSignedIn(page, testUsers.user);
    await page.goto("/");
    isSignedIn = await isUserSignedIn(page);
    expect(isSignedIn).toBe(true);

    // Call ensureUserSignedIn again - should not fail
    await ensureUserSignedIn(page, testUsers.user);
    await page.goto("/");
    isSignedIn = await isUserSignedIn(page);
    expect(isSignedIn).toBe(true);

    // Test ensureUserSignedOut
    await ensureUserSignedOut(page);
    await page.goto("/");
    isSignedIn = await isUserSignedIn(page);
    expect(isSignedIn).toBe(false);
  });
});
