import { test, expect } from "@playwright/test";
import { HomePage } from "./pages/home.page";

test.describe("Home Page", () => {
  test.describe("Unauthenticated State", () => {
    test("should display all unauthenticated UI elements correctly", async ({
      page,
    }) => {
      const homePage = new HomePage(page);

      // Navigate to home page (assuming user starts unauthenticated)
      await homePage.navigateToHome();

      // Check page title
      await expect(page).toHaveTitle("Welcome to hackathon");

      // Check that header is visible with sign-in button
      await expect(homePage.getHeader()).toBeVisible();
      const headerText = await page.locator("header").textContent();
      expect(headerText).toContain("Sign In");
      await expect(homePage.getHeaderSignInButton()).toBeVisible();

      // Check that signed-out UI is displayed
      await expect(homePage.getSignedOutUI()).toBeVisible();
    });
  });

  test.describe("Navigation and Accessibility", () => {
    test("should be accessible with keyboard navigation", async ({ page }) => {
      const homePage = new HomePage(page);

      // Navigate to home page
      await homePage.navigateToHome();

      // Try to focus on the sign-in button using keyboard
      await page.keyboard.press("Tab");

      // Check that sign-in button can be focused
      await expect(homePage.getHeaderSignInButton()).toBeFocused();
    });

    test("should have proper semantic HTML structure", async ({ page }) => {
      const homePage = new HomePage(page);

      // Navigate to home page
      await homePage.navigateToHome();

      // Check for semantic HTML elements
      await expect(homePage.getHeader()).toBeVisible();

      // Check that the signed out UI is properly structured
      await expect(homePage.getSignedOutUI()).toBeVisible();
    });
  });
});
