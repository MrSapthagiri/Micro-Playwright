import { chromium } from '@playwright/test';

async function multipleUsersLogin() {

    const browser = await chromium.launch({ headless: false });

    // Admin User
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();

    await adminPage.goto('https://www.saucedemo.com/');
    await adminPage.fill('#user-name', 'standard_user');
    await adminPage.fill('#password', 'secret_sauce');
    await adminPage.click('#login-button');

    // Customer User
    const customerContext = await browser.newContext();
    const customerPage = await customerContext.newPage();

    await customerPage.goto('https://www.saucedemo.com/');
    await customerPage.fill('#user-name', 'problem_user');
    await customerPage.fill('#password', 'secret_sauce');
    await customerPage.click('#login-button');

}