import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private usernameInput = '#user-name';
  private passwordInput = '#password';
  private loginButton = '#login-button';
  private errorBanner = '[data-test="error"]';

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('https://www.saucedemo.com/');
  }

  async login(username: string, password: string) {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  async assertLoginPageVisible() {
    await this.waitForVisible(this.usernameInput);
    await this.waitForVisible(this.passwordInput);
    await this.waitForVisible(this.loginButton);
  }

  async assertErrorMessage(message: string) {
    await expect(this.page.locator(this.errorBanner)).toContainText(message);
  }
}
