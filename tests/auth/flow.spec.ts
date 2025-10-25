import { test, expect } from '@playwright/test';
import { RegisterPage, LoginPage, HomePage } from '../pages';
import { TestDataGenerator } from '../data/test-data';

/**
 * Test Suite: Register → Login → Logout (End-to-End Positive Flow)
 *
 * Test Case:
 * TC-REG-LOGIN-LOGOUT-001: Register new user, handle both redirect cases, login and logout successfully
 */

test.describe('Register → Login → Logout Flow', () => {

  test('TC-REG-LOGIN-LOGOUT-001: Should register new user, login, and logout successfully', async ({ page }) => {
    // Arrange
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    // Generate unique user data
    const userData = TestDataGenerator.getValidUserData();

    // --- Step 1: Register New User ---
    await registerPage.goto();
    await registerPage.register(userData.username, userData.email, userData.password);

    // Wait for redirect after registration
    await page.waitForTimeout(2000);
    const currentUrl = page.url();

    // --- Step 2: Decide Flow Based on Redirect ---
    if (currentUrl.includes('/login')) {
      // Case A: Redirected to login page
      await loginPage.login(userData.email, userData.password);
      await page.waitForURL(/\/$/, { timeout: 5000 });
    } else if (currentUrl.match(/\/($|home)/)) {
      // Case B: Automatically logged in after registration
      // Proceed with logout, then login again to verify credentials
      const isLoggedIn = await homePage.isLoggedIn();
      expect(isLoggedIn).toBeTruthy();

      // Logout
      await homePage.logout();
      await page.waitForTimeout(1000);

      // Login again using the same registered credentials
      await loginPage.goto();
      await loginPage.login(userData.email, userData.password);
      await page.waitForURL(/\/$/, { timeout: 5000 });
    }

    // --- Step 3: Verify Login Success ---
    const isLoggedInAfter = await homePage.isLoggedIn();
    expect(isLoggedInAfter).toBeTruthy();

    // --- Step 4: Logout to End Session ---
    await homePage.logout();
    await page.waitForTimeout(1000);

    // --- Step 5: Verify Logout Success ---
    const isLoggedOut = await homePage.isLoggedOut();
    expect(isLoggedOut).toBeTruthy();
  });

});
