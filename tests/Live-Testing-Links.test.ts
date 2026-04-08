import { test, expect } from '@playwright/test';

// Collection of reliable live websites for testing different scenarios

test.describe('Live Websites for Testing - Comprehensive Collection', () => {

  test('E-commerce & Authentication Testing', async ({ page }) => {
    // SauceDemo - Complete login/logout, shopping cart, checkout
    await page.goto('https://www.saucedemo.com/');
    await expect(page.locator('.login_logo')).toBeVisible();

    // Login flow
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL(/inventory/);

    // Quick shopping and logout
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('Web Interactions & UI Testing', async ({ page }) => {
    // The Internet - Comprehensive web testing playground
    await page.goto('https://the-internet.herokuapp.com/');
    await expect(page.locator('h1')).toHaveText('Welcome to the-internet');

    // Test various interactions
    await page.click('text=Checkboxes');
    await page.check('#checkboxes input:first-child');
    await expect(page.locator('#checkboxes input:first-child')).toBeChecked();
  });

  test('API Testing & HTTP Requests', async ({ page }) => {
    // HTTPBin - API testing and HTTP request/response inspection
    await page.goto('https://httpbin.org/');
    await expect(page.locator('h1')).toContainText('Herman Melville');

    // Test GET request
    await page.goto('https://httpbin.org/get');
    await expect(page.locator('pre')).toContainText('"url": "https://httpbin.org/get"');

    // Test POST request
    await page.goto('https://httpbin.org/post');
    await page.fill('textarea', 'test data');
    await page.click('input[type="submit"]');
    await expect(page.locator('pre')).toContainText('test data');
  });

  test('Forms & Data Entry', async ({ page }) => {
    // Practice Form - Form filling and validation
    await page.goto('https://www.practiceautomation.com/form-fields/');
    await expect(page.locator('h1')).toContainText('Form Fields');

    await page.fill('#g1103-name', 'John Doe');
    await page.fill('#g1103-email', 'john@example.com');
    await page.selectOption('#g1103-occupation', 'Automation Tester');
    await page.check('#g1103-male');
    await page.fill('#contact-form-comment-message', 'Test message');
    await page.click('#contact-form-submit');
  });

  test('Dynamic Content & AJAX', async ({ page }) => {
    // Dynamic content testing
    await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');
    await page.click('text=Start');
    await page.locator('#loading').waitFor({ state: 'visible' });
    await page.locator('#loading').waitFor({ state: 'hidden' });
    await expect(page.locator('#finish')).toHaveText('Hello World!');
  });

  test('File Upload & Download', async ({ page }) => {
    // File upload testing
    await page.goto('https://the-internet.herokuapp.com/upload');
    await expect(page.locator('h3')).toHaveText('File Uploader');

    // Note: Would need actual file for upload testing
    // await page.setInputFiles('input[type="file"]', 'path/to/file.txt');
  });

  test('Tables & Data Display', async ({ page }) => {
    // Table testing
    await page.goto('https://the-internet.herokuapp.com/tables');
    await expect(page.locator('h3')).toHaveText('Data Tables');

    const rows = page.locator('#table1 tbody tr');
    await expect(rows).toHaveCount(4);
  });

  test('Navigation & Routing', async ({ page }) => {
    // Navigation testing
    await page.goto('https://example.com');
    await expect(page.locator('h1')).toContainText('Example Domain');

    await page.goto('https://httpbin.org/html');
    await expect(page.locator('h1')).toHaveText('Herman Melville - Moby-Dick');

    await page.goBack();
    await expect(page.locator('h1')).toContainText('Example Domain');
  });

  test('Search & Filtering', async ({ page }) => {
    // Search functionality (using DuckDuckGo as example)
    await page.goto('https://duckduckgo.com');
    await page.fill('#searchbox_input', 'playwright testing');
    await page.click('button[type="submit"]');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Multi-language & Internationalization', async ({ page }) => {
    // Test with different locales
    await page.goto('https://www.wikipedia.org/');
    await expect(page.locator('#www-wikipedia-org')).toBeVisible();

    // Switch to Spanish
    await page.click('text=Español');
    await expect(page.locator('#www-wikipedia-org')).toBeVisible();
  });

  test('Responsive Design & Mobile Testing', async ({ page, browser }) => {
    // Test responsive design
    await page.goto('https://getbootstrap.com/docs/5.0/examples/album/');
    await expect(page.locator('.navbar-brand')).toBeVisible();

    // Test with different viewport sizes
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await expect(page.locator('.navbar-toggler')).toBeVisible();

    await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop
    await expect(page.locator('.navbar-brand')).toBeVisible();
  });

  test('Real E-commerce Site (Demo)', async ({ page }) => {
    // Demo e-commerce site
    await page.goto('https://demo.nopcommerce.com/');
    await expect(page.locator('.header-logo')).toBeVisible();

    // Browse products
    await page.click('text=Computers');
    await expect(page.locator('h1')).toHaveText('Computers');
  });

  test('Social Media & External APIs', async ({ page }) => {
    // GitHub (requires authentication for full testing)
    await page.goto('https://github.com/microsoft/playwright');
    await expect(page.locator('h1')).toContainText('Playwright');

    // Public repository information
    const stars = await page.locator('[aria-label*="star"]').first().textContent();
    console.log('Playwright stars:', stars);
  });

  test('Video & Media Content', async ({ page }) => {
    // Video testing
    await page.goto('https://sample-videos.com/');
    await expect(page.locator('h1')).toContainText('Sample Videos');

    // Note: Would need specific video elements for testing
  });

  test('Real-time Data & WebSockets', async ({ page }) => {
    // Real-time testing (limited options for free public sites)
    await page.goto('https://www.websocket.org/echo.html');
    await expect(page.locator('h1')).toContainText('WebSocket Echo Server');
  });

});

// Additional Live Testing Websites Collection:
/*
E-commerce & Shopping:
- https://demo.nopcommerce.com/ - Full e-commerce demo
- https://www.saucedemo.com/ - Login/logout testing
- https://automationteststore.com/ - Product catalog testing

Forms & Data Entry:
- https://www.practiceautomation.com/form-fields/
- https://demoqa.com/automation-practice-form
- https://testautomationpractice.blogspot.com/

API Testing:
- https://httpbin.org/ - HTTP request testing
- https://jsonplaceholder.typicode.com/ - REST API testing
- https://reqres.in/ - REST API testing

Web Interactions:
- https://the-internet.herokuapp.com/ - Comprehensive testing playground
- https://demoqa.com/ - UI testing components
- https://testpages.herokuapp.com/ - Various test pages

File Operations:
- https://the-internet.herokuapp.com/upload
- https://demo.guru99.com/test/upload/

Search & Navigation:
- https://duckduckgo.com/ - Search engine
- https://www.google.com/ - Search (may have CAPTCHA)
- https://en.wikipedia.org/ - Content navigation

Real Applications:
- https://github.com/ - Version control platform
- https://gitlab.com/ - Alternative git platform
- https://stackoverflow.com/ - Q&A platform

Mobile & Responsive:
- https://getbootstrap.com/docs/5.0/examples/
- https://materializecss.com/
- https://get.foundation/

Performance Testing:
- https://httpbin.org/delay/5 - Delayed responses
- https://the-internet.herokuapp.com/slow - Slow loading pages

Security Testing:
- https://owasp.org/www-project-juice-shop/ - Vulnerable web app
- https://dvwa.co.uk/ - Damn Vulnerable Web App

Note: Always check terms of service and be respectful when testing live sites.
Some sites may have rate limits or require authentication for full functionality.
*/