import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  private title = '.title';
  private inventoryList = '.inventory_list';
  private cartLink = '.shopping_cart_link';
  private cartBadge = '.shopping_cart_badge';
  private burgerMenuButton = '#react-burger-menu-btn';
  private logoutLink = '#logout_sidebar_link';

  constructor(page: Page) {
    super(page);
  }

  async assertLoaded() {
    await this.waitForVisible(this.title);
    await this.waitForVisible(this.inventoryList);
    await expect(this.page.locator(this.title)).toHaveText('Products');
  }

  async addItemToCart(itemId: string) {
    await this.click(`[data-test="add-to-cart-${itemId}"]`);
  }

  async openCart() {
    await this.click(this.cartLink);
  }

  async getCartBadgeCount() {
    const badge = this.page.locator(this.cartBadge);
    return badge.count().then(async count => {
      if (count === 0) return '0';
      return badge.textContent();
    });
  }

  async openMenu() {
    await this.click(this.burgerMenuButton);
    await this.page.locator(this.logoutLink).waitFor({ state: 'visible' });
  }

  async logout() {
    await this.openMenu();
    await this.click(this.logoutLink);
  }
}
