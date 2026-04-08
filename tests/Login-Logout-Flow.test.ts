import { test, expect } from '@playwright/test';

test.describe('Real-time Login to Logout Flow - SauceDemo', () => {

  test('Complete Login to Logout Workflow', async ({ page }) => {
    // Step 1: Navigate to login page
    await page.goto('https://www.saucedemo.com/');
    await page.waitForLoadState();

    // Verify we're on the login page
    await expect(page.locator('.login_logo')).toBeVisible();
    await expect(page.locator('#user-name')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#login-button')).toBeVisible();

    // Step 2: Perform login
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');

    // Step 3: Verify successful login
    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('.title')).toHaveText('Products');
    await expect(page.locator('.shopping_cart_link')).toBeVisible();

    // Step 4: Navigate through the application
    // Add item to cart
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // Go to cart
    await page.click('.shopping_cart_link');
    await expect(page).toHaveURL(/cart/);
    await expect(page.locator('.cart_item')).toBeVisible();

    // Continue shopping
    await page.click('#continue-shopping');
    await expect(page).toHaveURL(/inventory/);

    // Step 5: Perform logout
    await page.click('#react-burger-menu-btn');
    await page.locator('#logout_sidebar_link').waitFor({ state: 'visible' });
    await page.click('#logout_sidebar_link');

    // Step 6: Verify logout success
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('.login_logo')).toBeVisible();
    await expect(page.locator('#user-name')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#login-button')).toBeVisible();

    console.log('✅ Complete login to logout flow successful!');
  });

  test('Login with Different User Types', async ({ page }) => {
    const users = [
      { username: 'standard_user', password: 'secret_sauce', expected: 'success' },
      { username: 'locked_out_user', password: 'secret_sauce', expected: 'locked' },
      { username: 'problem_user', password: 'secret_sauce', expected: 'success' },
      { username: 'performance_glitch_user', password: 'secret_sauce', expected: 'success' }
    ];

    for (const user of users) {
      await page.goto('https://www.saucedemo.com/');
      await page.waitForLoadState();

      await page.fill('#user-name', user.username);
      await page.fill('#password', user.password);
      await page.click('#login-button');

      if (user.expected === 'success') {
        await expect(page).toHaveURL(/inventory/);
        await expect(page.locator('.title')).toHaveText('Products');

        // Quick logout
        await page.click('#react-burger-menu-btn');
        await page.locator('#logout_sidebar_link').waitFor({ state: 'visible' });
        await page.click('#logout_sidebar_link');
        await expect(page).toHaveURL('https://www.saucedemo.com/');

        console.log(`✅ ${user.username} login/logout successful`);
      } else if (user.expected === 'locked') {
        await expect(page.locator('[data-test="error"]')).toContainText('locked out');
        console.log(`✅ ${user.username} correctly blocked (locked out)`);
      }
    }
  });

  test('Login Validation and Error Handling', async ({ page }) => {
    // Test empty credentials
    await page.goto('https://www.saucedemo.com/');
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toContainText('Username is required');

    // Test only username
    await page.fill('#user-name', 'standard_user');
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toContainText('Password is required');

    // Test invalid credentials
    await page.fill('#password', 'wrong_password');
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');

    // Test successful login after errors
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL(/inventory/);

    console.log('✅ Error handling and validation tests passed');
  });

  test('Session Persistence and Logout Verification', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Login
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL(/inventory/);

    // Verify session persists on page refresh
    await page.reload();
    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('.title')).toHaveText('Products');

    // Logout
    await page.click('#react-burger-menu-btn');
    await page.locator('#logout_sidebar_link').waitFor({ state: 'visible' });
    await page.click('#logout_sidebar_link');

    // Verify logout - should redirect to login page
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    // Verify session is cleared - try to access inventory directly
    await page.goto('https://www.saucedemo.com/inventory.html');
    await expect(page).toHaveURL('https://www.saucedemo.com/'); // Should redirect back to login

    await context.close();
    console.log('✅ Session persistence and logout verification successful');
  });

  test('Multi-tab Login and Logout Handling', async ({ browser }) => {
    const context = await browser.newContext();

    // Tab 1: Login
    const tab1 = await context.newPage();
    await tab1.goto('https://www.saucedemo.com/');
    await tab1.fill('#user-name', 'standard_user');
    await tab1.fill('#password', 'secret_sauce');
    await tab1.click('#login-button');
    await expect(tab1).toHaveURL(/inventory/);

    // Tab 2: Open new tab and verify login state
    const tab2 = await context.newPage();
    await tab2.goto('https://www.saucedemo.com/inventory.html');
    await expect(tab2).toHaveURL(/inventory/); // Should maintain session

    // Logout from tab 1
    await tab1.click('#react-burger-menu-btn');
    await tab1.locator('#logout_sidebar_link').waitFor({ state: 'visible' });
    await tab1.click('#logout_sidebar_link');
    await expect(tab1).toHaveURL('https://www.saucedemo.com/');

    // Verify tab 2 is also logged out (session cleared)
    await tab2.reload();
    await expect(tab2).toHaveURL('https://www.saucedemo.com/');

    await context.close();
    console.log('✅ Multi-tab login/logout handling successful');
  });

  test('Complete E-commerce Flow: Login → Shop → Checkout → Logout', async ({ page }) => {
    // Login
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL(/inventory/);

    // Browse and add items to cart
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    // Go to cart
    await page.click('.shopping_cart_link');
    await expect(page.locator('.cart_item')).toHaveCount(2);

    // Proceed to checkout
    await page.click('[data-test="checkout"]');
    await expect(page).toHaveURL(/checkout-step-one/);

    // Fill checkout information
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');

    // Verify checkout overview
    await expect(page).toHaveURL(/checkout-step-two/);
    await expect(page.locator('.summary_total_label')).toBeVisible();

    // Complete purchase
    await page.click('[data-test="finish"]');
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');

    // Return to products
    await page.click('[data-test="back-to-products"]');
    await expect(page).toHaveURL(/inventory/);

    // Logout
    await page.click('#react-burger-menu-btn');
    await page.locator('#logout_sidebar_link').waitFor({ state: 'visible' });
    await page.click('#logout_sidebar_link');
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    console.log('✅ Complete e-commerce flow: login → shop → checkout → logout successful!');
  });

});