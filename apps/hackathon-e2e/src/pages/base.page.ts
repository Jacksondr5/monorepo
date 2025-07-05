import { Page, Locator, expect } from "@playwright/test";

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   */
  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Wait for page to load completely
   */
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
  }

  /**
   * Get element by data-testid
   */
  getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(testId: string): Promise<Locator> {
    const element = this.getByTestId(testId);
    await expect(
      element,
      `Element with testId ${testId} is not visible`,
    ).toBeVisible();
    return element;
  }

  /**
   * Click element by data-testid
   */
  async clickByTestId(testId: string): Promise<void> {
    const element = await this.waitForElement(testId);
    await element.click();
  }

  /**
   * Get current URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Wait for URL to contain specific path
   */
  async waitForUrlToContain(path: string): Promise<void> {
    await this.page.waitForURL(`**/*${path}*`);
  }
}
