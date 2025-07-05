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
   * Get the signed out UI element
   */
  getSignedOutUI() {
    return this.getByTestId("signed-out-ui");
  }

  /**
   * Click the sign-in button in header
   */
  async clickHeaderSignInButton(): Promise<void> {
    await this.getHeaderSignInButton().click();
  }

  /**
   * Get the header sign-in button
   */
  getHeaderSignInButton() {
    return this.getByTestId("header-sign-in-button");
  }

  /**
   * Get the header element
   */
  getHeader() {
    return this.page.locator("header");
  }

  /**
   * Get the main content element
   */
  getMainContent() {
    return this.page.locator("main");
  }
}
