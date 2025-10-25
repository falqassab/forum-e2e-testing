import { test, expect } from '@playwright/test';
import { LoginPage, RegisterPage, HomePage } from '../pages';
import { EXISTING_USER } from '../data/test-data';

/**
 * Test Suite: User Login (Sign In)
 * 
 * Test Cases:
 * 1. TC-LOGIN-001: Successful login with valid credentials
 * 2. TC-LOGIN-002: Login with wrong password
 * 3. TC-LOGIN-003: Login with unregistered username
 * 4. TC-LOGIN-004: Login with empty email
 * 5. TC-LOGIN-005: Login with empty password
 * 6. TC-LOGIN-006: Login with both fields empty
 * 7. TC-LOGIN-007: Verify user remains logged in after page refresh
 * 8. TC-LOGIN-008: Verify navigation to register page from login
 */

test.describe('User Login (Sign In)', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('/login');
  });

  test('TC-LOGIN-001: Should successfully login with valid credentials', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    
    // Act
    await loginPage.login(EXISTING_USER.email, EXISTING_USER.password);
    
    // Assert - Should redirect to home page
    await expect(page).toHaveURL(/\/$/, { timeout: 5000 });
    
    // Verify user is logged in
    const isLoggedIn = await homePage.isLoggedIn();
    expect(isLoggedIn).toBeTruthy();
  });

  test('TC-LOGIN-002: Should fail to login with wrong password', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    
    // Act
    await loginPage.login(EXISTING_USER.email, 'WrongPassword123!');
    
    // Assert - Should show error or stay on login page
    await page.waitForTimeout(1000);
    
    // Check if error message is visible
    const hasError = await loginPage.errorMessage.isVisible().catch(() => false);
    const currentUrl = page.url();
    
    // Either error is shown OR still on login page
    expect(hasError || currentUrl.includes('/login')).toBeTruthy();
    
    // Should NOT be logged in
    const homePage = new HomePage(page);
    await homePage.goto();
    const isLoggedIn = await homePage.isLoggedIn();
    expect(isLoggedIn).toBeFalsy();
  });

  test('TC-LOGIN-003: Should fail to login with unregistered email', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('nonexistent@example.com', 'SomePassword123!');

    await page.waitForTimeout(1000);

    const hasError = await loginPage.errorMessage.isVisible().catch(() => false);
    const currentUrl = page.url();
    expect(hasError || currentUrl.includes('/login')).toBeTruthy();

    const homePage = new HomePage(page);
    await homePage.goto();
    const isLoggedIn = await homePage.isLoggedIn();
    expect(isLoggedIn).toBeFalsy();
  });

  test('TC-LOGIN-004: Should show validation error when email is empty', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('', EXISTING_USER.password);

    await page.waitForTimeout(500);

    const emailInvalid = await page.$eval('input[name="email"]', el => (el as HTMLInputElement).checkValidity() === false);
    expect(emailInvalid).toBeTruthy();


    expect(page.url()).toContain('/login');
  });

  test('TC-LOGIN-005: Should show validation error when password is empty', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(EXISTING_USER.email, '');

    await page.waitForTimeout(500);

    const passwordInvalid = await page.$eval('input[name="password"]', el => (el as HTMLInputElement).checkValidity() === false);
    expect(passwordInvalid).toBeTruthy();


    expect(page.url()).toContain('/login');
  });

  test('TC-LOGIN-006: Should show validation error when both fields are empty', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('', ''); // Both fields empty

  // Check if the inputs are invalid according to HTML5
  const emailInvalid = await page.$eval('input[name="email"]', el => (el as HTMLInputElement).checkValidity() === false);
  const passwordInvalid = await page.$eval('input[name="password"]', el => (el as HTMLInputElement).checkValidity() === false);

  expect(emailInvalid).toBeTruthy();
  expect(passwordInvalid).toBeTruthy();

  // URL should still be /login
  expect(page.url()).toContain('/login');
  });

  test('TC-LOGIN-007: Should remain logged in after page refresh', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    await loginPage.login(EXISTING_USER.email, EXISTING_USER.password);
    await expect(page).toHaveURL(/\/$/, { timeout: 5000 });

    // Refresh the page
    await page.reload();
    await page.waitForTimeout(1000);

    // Verify still logged in
    const isLoggedIn = await homePage.isLoggedIn();
    expect(isLoggedIn).toBeTruthy();
  });

  test('TC-LOGIN-008: Should navigate to Register page when clicking Register link', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const registerPage = new RegisterPage(page);

    await loginPage.navigateToRegister();

    await expect(page).toHaveURL(/\/register/, { timeout: 3000 });
    const isRegisterFormVisible = await registerPage.isRegisterFormVisible();
    expect(isRegisterFormVisible).toBeTruthy();
  });

});
