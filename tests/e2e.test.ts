import { test } from '@playwright/test';
import { LoginPage, InventoryPage, CartPage, CheckoutPage } from '../pages';

test.describe('SauceDemo POM workflow', () => {
  test('Login, shop, checkout and logout using POM methods', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.assertLoginPageVisible();
    await loginPage.login('standard_user', 'secret_sauce');

    await inventoryPage.assertLoaded();
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.addItemToCart('sauce-labs-bike-light');
    await inventoryPage.openCart();

    await cartPage.assertLoaded();
    await cartPage.checkout();

    await checkoutPage.fillUserInformation('John', 'Doe', '12345');
    await checkoutPage.continue();
    await checkoutPage.assertOverview();
    await checkoutPage.finish();
    await checkoutPage.assertCheckoutComplete();
    await checkoutPage.backToProducts();

    await inventoryPage.logout();
  });
});

