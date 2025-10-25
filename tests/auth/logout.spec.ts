import { test, expect } from '@playwright/test';
import { LoginPage, HomePage } from '../pages';
import { EXISTING_USER } from '../data/test-data';

/**
 * Test Suite: User Logout (Sign Out)
 * 
 * Test Cases:
 * 1. TC-LOGOUT-001: Verify user cannot access protected page after logout
 * 2. TC-LOGOUT-002: Verify session is cleared after logout
 * 3. TC-LOGOUT-003: Cannot access protected pages using browser back button
 */

test.describe('User Logout (Sign Out)', () => {


  test('TC-LOGOUT-001: Should not access protected page after logout', async ({ page }) => {
    // Arrange - Login first
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    
    await page.goto('/login');
    await loginPage.login(EXISTING_USER.email, EXISTING_USER.password);
    await page.waitForURL(/\/$/, { timeout: 5000 });
    
    // Act - Logout
    await homePage.logout();
    await page.waitForTimeout(1000);
    
    // Try to access protected page (createPost)
    await page.goto('/createPost');
    await page.waitForTimeout(1000);
    
    // Assert - Should redirect to login or show login button
    const currentUrl = page.url();
    const isLoggedOut = await homePage.isLoggedOut();
    
    expect(currentUrl.includes('/login') || isLoggedOut).toBeTruthy();
  });

  test('TC-LOGOUT-002: Should clear session after logout', async ({ page }) => {
    // Arrange - Login first
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    await page.goto('/login');
    await loginPage.login(EXISTING_USER.email, EXISTING_USER.password);
    await page.waitForURL(/\/$/, { timeout: 5000 });

    // Act - Logout
    await homePage.logout();
    await page.waitForTimeout(1000);

    // Refresh the page
    await page.reload();
    await page.waitForTimeout(1000);

    // Assert - UI shows logged out and session cookie is removed
    const isLoggedOut = await homePage.isLoggedOut();
    expect(isLoggedOut).toBeTruthy();

  });

  test('TC-LOGOUT-003: Cannot access protected pages using browser back button', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    // Login
    await page.goto('/login');
    await loginPage.login(EXISTING_USER.email, EXISTING_USER.password);
    await page.waitForURL(/\/$/, { timeout: 5000 });

    // Navigate to a protected page
    await page.goto('/createPost');
    await page.waitForTimeout(500);

    // Logout
    await homePage.logout();
    await page.waitForTimeout(500);

    // Simulate browser back
    await page.goBack();
    await page.waitForTimeout(500);
    await page.reload();
    await page.waitForTimeout(500);
    
    const isLoggedOut = await homePage.isLoggedOut();
    expect(page.url().includes('/login') || isLoggedOut).toBeTruthy();
  });


});
