import { Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class SignInPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate directly to the sign-in page
   */
  async navigateToSignIn(): Promise<void> {
    await this.goto("/sign-in");
    await this.waitForLoad();
  }

  /**
   * Get the main heading text
   */
  async getHeadingText(): Promise<string> {
    const heading = this.page.locator("h1");
    return (await heading.textContent()) || "";
  }

  /**
   * Get the description text under the heading
   */
  async getDescriptionText(): Promise<string> {
    const description = this.page.locator(
      "text=You must sign in to use this app",
    );
    return (await description.textContent()) || "";
  }

  /**
   * Get the instruction text in the card
   */
  async getInstructionText(): Promise<string> {
    const instruction = this.page.locator(
      "text=Please use the sign-in button in the header to access your account.",
    );
    return (await instruction.textContent()) || "";
  }

  /**
   * Get the signup helper text
   */
  async getSignupHelperText(): Promise<string> {
    const helper = this.page.locator(
      "text=Don't have an account? You'll be redirected to create one after signing in.",
    );
    return (await helper.textContent()) || "";
  }

  /**
   * Check if the sign-in icon is visible
   */
  async isSignInIconVisible(): Promise<boolean> {
    // The LogIn icon from lucide-react
    const icon = this.page.locator("svg").first();
    return await icon.isVisible();
  }

  /**
   * Check if the card container is visible
   */
  async isCardVisible(): Promise<boolean> {
    // Look for the card component
    const card = this.page
      .locator("[class*='bg-']")
      .filter({ hasText: "Please use the sign-in button" });
    return await card.isVisible();
  }
}
