import { test, expect } from '@playwright/test';
import { chromium } from 'playwright';

test('Demo: Headless vs Headed Mode - SauceDemo Login', async ({ page }) => {
  // Manual browser launch example
  const browser = await chromium.launch({ headless: true }); 
  // Headed mode example
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
  // Take a screenshot to demonstrate the result (works in both modes)
  await page.screenshot({ path: 'login-success.png' });
  // Close the manually launched browser
  await browser.close();
});

//runing : npx playwright test tests/headless-headed-demo.test.ts
