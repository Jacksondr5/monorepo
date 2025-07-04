import { Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to the home page
   */
  async navigateToHome(): Promise<void> {
    await this.goto("/");
    await this.waitForLoad();
  }

  /**
   * Check if user is redirected to sign-in page
   */
  async expectRedirectToSignIn(): Promise<void> {
    await this.waitForUrlToContain("/sign-in");
  }

  /**
   * Get the unauthenticated message in layout
   */
  async getUnauthenticatedMessage(): Promise<string> {
    // This targets the message in the layout when user is signed out
    const message = this.page.locator(
      "text=You need to sign in to view this app",
    );
    return (await message.textContent()) || "";
  }

  /**
   * Click the sign-in button in header
   */
  async clickHeaderSignInButton(): Promise<void> {
    await this.clickByTestId("header-sign-in-button");
  }

  /**
   * Check if header sign-in button is visible
   */
  async isSignInButtonVisible(): Promise<boolean> {
    const button = this.getByTestId("header-sign-in-button");
    return await button.isVisible();
  }
}
