import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private cartItem = '.cart_item';
  private checkoutButton = '[data-test="checkout"]';
  private continueShoppingButton = '#continue-shopping';

  constructor(page: Page) {
    super(page);
  }

  async assertLoaded() {
    await this.waitForVisible(this.cartItem);
    const itemCount = await this.page.locator(this.cartItem).count();
    await expect(itemCount).toBeGreaterThan(0);
  }

  async checkout() {
    await this.click(this.checkoutButton);
  }

  async continueShopping() {
    await this.click(this.continueShoppingButton);
  }
}
