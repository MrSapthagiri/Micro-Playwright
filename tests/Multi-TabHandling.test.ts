import { test, expect } from '@playwright/test';
test('Multi Page + Multi Tab Example', async ({ browser }) => {
                                             
  const context = await browser.newContext();                                           // Create Browser Context                                                                                       
  const page = await context.newPage();                                                 // Create Main Page
  await page.goto('https://the-internet.herokuapp.com');                                // Step 1: Open Main Website
  await page.screenshot({ path: 'screenshots/main-page.png', fullPage: true });         // Take screenshot of main page
  await page.click('text=Multiple Windows');                                            // Step 2: Navigate to Windows Page
  await expect(page).toHaveURL(/windows/);                                              // Validate URL
  await page.screenshot({ path: 'screenshots/windows-page.png', fullPage: true });      // Take screenshot after navigating to windows page
  const [newPage] = await Promise.all([                                                 // Step 3: Capture New Tab
    context.waitForEvent('page'),
    page.click('text=Click Here')
  ]);
  await newPage.waitForLoadState();                                                     // Step 4: Wait for New Tab to Load
  await newPage.screenshot({ path: 'screenshots/new-tab.png', fullPage: true });        // Take screenshot of new tab
  console.log("New Tab Title:", await newPage.title());                                 // Step 5: Print Title
  await expect(newPage.locator('h3')).toHaveText('New Window');                         // Step 6: Validate Text in New Tab
  await newPage.close();                                                                // Step 7: Close New Tab
  await page.bringToFront();                                                            // Step 8: Return to Main Page
  await page.screenshot({ path: 'screenshots/final-main-page.png', fullPage: true });   // Take final screenshot of main page
  console.log("Returned to main tab");
});