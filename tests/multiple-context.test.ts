import { chromium } from '@playwright/test';
import { test } from '@playwright/test';

test('Multiple Context Example', async () => {
    const browser = await chromium.launch({ headless: false });

    // Context 1
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();

    // Context 2
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();

    await page1.goto('https://www.google.com');
    await page2.goto('https://www.amazon.in');

    // Close browser
    await browser.close();
});

//running : npx playwright test tests/multiple-context.test.ts



