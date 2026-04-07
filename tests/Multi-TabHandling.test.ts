import { test, expect } from '@playwright/test';

test('Handle new tab with screenshots and video recording', async ({ browser }) => {

  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to the website
  await page.goto('https://the-internet.herokuapp.com/windows');

  // Take screenshot of the main page
  await page.screenshot({ path: 'screenshots/main-page.png', fullPage: true });

  // Click the link that opens a new tab and wait for the new page
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.click('text=Click Here')
  ]);

  // Wait for the new page to load
  await newPage.waitForLoadState();

  // Take screenshot of the new page
  await newPage.screenshot({ path: 'screenshots/new-window.png', fullPage: true });

  // Verify the content of the new page
  await expect(newPage.locator('h3')).toHaveText('New Window');

  // Take a final screenshot
  await newPage.screenshot({ path: 'screenshots/final-state.png', fullPage: true });

  // Close the context
  await context.close();

});