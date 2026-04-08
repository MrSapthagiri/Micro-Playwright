import { test, expect, chromium, firefox, webkit } from '@playwright/test';

test.describe('Browser & Page Handling - Comprehensive Demo', () => {

  test('Launch Browsers: Chromium, Firefox, WebKit', async () => {
    // Launch Chromium browser
    const chromiumBrowser = await chromium.launch({ headless: false });
    const chromiumPage = await chromiumBrowser.newPage();
    await chromiumPage.goto('https://example.com');
    await expect(chromiumPage.locator('h1')).toContainText('Example Domain');
    await chromiumBrowser.close();

    // Launch Firefox browser
    const firefoxBrowser = await firefox.launch({ headless: false });
    const firefoxPage = await firefoxBrowser.newPage();
    await firefoxPage.goto('https://example.com');
    await expect(firefoxPage.locator('h1')).toContainText('Example Domain');
    await firefoxBrowser.close();

    // Launch WebKit browser
    const webkitBrowser = await webkit.launch({ headless: false });
    const webkitPage = await webkitBrowser.newPage();
    await webkitPage.goto('https://example.com');
    await expect(webkitPage.locator('h1')).toContainText('Example Domain');
    await webkitBrowser.close();
  });

  test('Browser Contexts (Isolated Sessions)', async () => {
    const browser = await chromium.launch({ headless: false });

    // Create first isolated context/session
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    await page1.goto('https://httpbin.org/cookies/set/session1/value1');
    await page1.waitForLoadState();

    // Create second isolated context/session
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    await page2.goto('https://httpbin.org/cookies/set/session2/value2');
    await page2.waitForLoadState();

    // Verify contexts are isolated - each should only have its own cookies
    const cookies1 = await context1.cookies();
    const cookies2 = await context2.cookies();

    console.log('Context 1 cookies:', cookies1.length);
    console.log('Context 2 cookies:', cookies2.length);

    // Clean up
    await context1.close();
    await context2.close();
    await browser.close();
  });

  test('Multi-tab & Page Handling', async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();

    // Create main page/tab
    const mainPage = await context.newPage();
    await mainPage.goto('https://the-internet.herokuapp.com/');
    await mainPage.waitForLoadState();

    // Open new tab/page by clicking a link that opens in new window
    const [newTab] = await Promise.all([
      context.waitForEvent('page'), // Wait for new page event
      mainPage.click('text=Multiple Windows') // Click link that opens new window
    ]);

    await newTab.waitForLoadState();
    await expect(newTab.locator('h3')).toHaveText('Opening a new window');

    // Click to open another new tab
    const [anotherTab] = await Promise.all([
      context.waitForEvent('page'),
      newTab.click('text=Click Here')
    ]);

    await anotherTab.waitForLoadState();
    await expect(anotherTab.locator('h3')).toHaveText('New Window');

    // Get all pages in context
    const allPages = context.pages();
    console.log(`Total pages/tabs: ${allPages.length}`);

    // Switch between tabs
    await mainPage.bringToFront();
    await newTab.bringToFront();
    await anotherTab.bringToFront();

    // Close tabs
    await anotherTab.close();
    await newTab.close();

    await context.close();
    await browser.close();
  });

  test('Navigation: goto(), reload(), goBack()', async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to first page using goto()
    await page.goto('https://example.com');
    await page.waitForLoadState();
    await expect(page.locator('h1')).toContainText('Example Domain');

    // Navigate to second page
    await page.goto('https://httpbin.org/get');
    await page.waitForLoadState();
    await expect(page.locator('body')).toContainText('url');

    // Go back to previous page
    await page.goBack();
    await page.waitForLoadState();
    await expect(page.locator('h1')).toContainText('Example Domain');

    // Go forward (if possible)
    await page.goForward();
    await page.waitForLoadState();
    await expect(page.locator('body')).toContainText('url');

    // Reload current page
    await page.reload();
    await page.waitForLoadState();
    await expect(page.locator('body')).toContainText('url');

    // Navigate with timeout and waitUntil options
    await page.goto('https://example.com', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    await context.close();
    await browser.close();
  });

  test('await usage for stable page sync', async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Demonstrate proper await usage for synchronization

    // 1. Wait for page load
    await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');
    await page.waitForLoadState('networkidle');

    // 2. Wait for element to be visible before interacting
    await page.click('text=Start');
    await page.locator('#loading').waitFor({ state: 'visible' });
    await page.locator('#loading').waitFor({ state: 'hidden' });

    // 3. Wait for text content
    await expect(page.locator('#finish')).toHaveText('Hello World!');
    await expect(page.locator('#finish')).toBeVisible();

    // 4. Wait for navigation after click
    await page.goto('https://the-internet.herokuapp.com/dynamic_loading/2');
    await page.waitForLoadState();

    await page.click('text=Start');
    await page.waitForLoadState('networkidle');

    // 5. Wait for specific condition
    await page.locator('#finish').waitFor({ state: 'visible', timeout: 10000 });
    await expect(page.locator('#finish')).toHaveText('Hello World!');

    // 6. Sequential operations with proper awaits
    await page.goto('https://example.com');
    await page.waitForLoadState();

    const title = await page.title();
    console.log('Page title:', title);

    const url = page.url();
    console.log('Current URL:', url);

    await context.close();
    await browser.close();
  });

  test('Combined: Full Browser & Page Handling Workflow', async () => {
    // Launch browser
    const browser = await chromium.launch({ headless: false });

    // Create isolated context
    const context = await browser.newContext();

    // Create main page
    const mainPage = await context.newPage();

    // Navigate to website
    await mainPage.goto('https://the-internet.herokuapp.com/');
    await mainPage.waitForLoadState();

    // Open multiple tabs
    const [tab1] = await Promise.all([
      context.waitForEvent('page'),
      mainPage.click('text=Multiple Windows')
    ]);
    await tab1.waitForLoadState();

    const [tab2] = await Promise.all([
      context.waitForEvent('page'),
      tab1.click('text=Click Here')
    ]);
    await tab2.waitForLoadState();

    // Navigate in different tabs
    await tab2.goto('https://example.com');
    await tab2.waitForLoadState();

    await tab2.reload();
    await tab2.waitForLoadState();

    await tab2.goBack();
    await tab2.waitForLoadState();

    // Switch between tabs
    await mainPage.bringToFront();
    await tab1.bringToFront();
    await tab2.bringToFront();

    // Get page information
    console.log('Main page URL:', mainPage.url());
    console.log('Tab1 URL:', tab1.url());
    console.log('Tab2 URL:', tab2.url());

    console.log('Total pages:', context.pages().length);

    // Close tabs and cleanup
    await tab2.close();
    await tab1.close();
    await context.close();
    await browser.close();
  });

});