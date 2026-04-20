import { expect, Page } from '@playwright/test';

export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    await this.page.goto(url);
    await this.page.waitForLoadState('load');
  }

  async click(selector: string) {
    await this.page.click(selector);
  }

  async fill(selector: string, value: string) {
    await this.page.fill(selector, value);
  }

  async waitForVisible(selector: string) {
    const locator = this.page.locator(selector);
    await expect(locator.first()).toBeVisible();
  }

  async getText(selector: string) {
    return this.page.locator(selector).textContent();
  }
}
