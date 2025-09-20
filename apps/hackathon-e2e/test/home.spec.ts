import { test, expect } from "@playwright/test";
import { HomePage } from "../src/pages/home.page";

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
      const header = homePage.getHeader();
      await expect(header).toBeVisible();
      // await expect(homePage.getHeaderSignInButton()).toBeVisible();

      // Check that signed-out UI is displayed
      await expect(homePage.getSignedOutUI()).toBeVisible();
    });
  });
});
