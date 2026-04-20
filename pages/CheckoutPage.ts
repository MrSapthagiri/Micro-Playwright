import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  private firstNameInput = '[data-test="firstName"]';
  private lastNameInput = '[data-test="lastName"]';
  private postalCodeInput = '[data-test="postalCode"]';
  private continueButton = '[data-test="continue"]';
  private finishButton = '[data-test="finish"]';
  private completeHeader = '.complete-header';
  private backToProductsButton = '[data-test="back-to-products"]';
  private summaryTotal = '.summary_total_label';

  constructor(page: Page) {
    super(page);
  }

  async fillUserInformation(firstName: string, lastName: string, postalCode: string) {
    await this.fill(this.firstNameInput, firstName);
    await this.fill(this.lastNameInput, lastName);
    await this.fill(this.postalCodeInput, postalCode);
  }

  async continue() {
    await this.click(this.continueButton);
  }

  async assertOverview() {
    await this.waitForVisible(this.summaryTotal);
  }

  async finish() {
    await this.click(this.finishButton);
  }

  async assertCheckoutComplete() {
    await this.waitForVisible(this.completeHeader);
    await expect(this.page.locator(this.completeHeader)).toHaveText('Thank you for your order!');
  }

  async backToProducts() {
    await this.click(this.backToProductsButton);
  }
}
