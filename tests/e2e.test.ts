import { test, expect, chromium } from '@playwright/test';

const browsers = ['chromium', 'firefox', 'webkit'];

test('SauceDemo Login Test', async ({ page }) => {
  // Open website
  await page.goto('https://www.saucedemo.com/');
  // Enter username
  await page.fill('#user-name', 'standard_user');
  // Enter password
  await page.fill('#password', 'secret_sauce');
  // Click login
  await page.click('#login-button');
  // Verify login success (URL check)
  await expect(page).toHaveURL(/inventory/);
});

// const browser = await chromium.launch();
