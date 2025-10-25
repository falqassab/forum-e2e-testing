import { test, expect } from '@playwright/test';
import { RegisterPage, LoginPage, HomePage } from '../pages';
import { TestDataGenerator } from '../data/test-data';
import { EXISTING_USER } from '../data/test-data';

/**
 * Test Suite: User Registration (Signup)
 * 
 * Test Cases:
 * 1. TC-REG-001: Successful user registration with valid data
 * 2. TC-REG-002: Registration fails with empty username
 * 3. TC-REG-003: Registration fails with empty email
 * 4. TC-REG-004: Registration fails with empty password
 * 5. TC-REG-005: Registration fails with invalid email format
 * 6. TC-REG-006: Registration fails with username too long (>15 chars)
 */

test.describe('User Registration (Signup)', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to register page before each test
    await page.goto('/register');
  });

  test('TC-REG-001: Should successfully register a new user with valid data', async ({ page }) => {
    // Arrange
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    
    // Generate unique user data
    const userData = TestDataGenerator.getValidUserData();
    
    // Act - Register new user
    await registerPage.register(userData.username, userData.email, userData.password);
    
    // Assert - Should redirect to login page or home
    await page.waitForTimeout(2000);
    const currentUrl = page.url();
    
    if (currentUrl.includes('/login')) {
      // If redirected to login, login with the new credentials
      await loginPage.login(userData.email, userData.password);
      await page.waitForTimeout(1000);
    }
    
    // Verify user is successfully registered and logged in
    await homePage.goto();
    const isLoggedIn = await homePage.isLoggedIn();
    expect(isLoggedIn).toBeTruthy();
  });

  test('TC-REG-002: Should fail to register with empty username', async ({ page }) => {
    // Arrange
    const registerPage = new RegisterPage(page);
    const userData = TestDataGenerator.getValidUserData();
    
    // Act - Try to register with empty username
    await registerPage.register('', userData.email, userData.password);
    
    // Assert - Should stay on register page
    await page.waitForTimeout(1000);
    const currentUrl = page.url();
    expect(currentUrl.includes('/register')).toBeTruthy();
  });

  test('TC-REG-003: Should fail to register with empty email', async ({ page }) => {
    // Arrange
    const registerPage = new RegisterPage(page);
    const userData = TestDataGenerator.getValidUserData();
    
    // Act - Try to register with empty email
    await registerPage.register(userData.username, '', userData.password);
    
    // Assert - Should stay on register page
    await page.waitForTimeout(1000);
    const currentUrl = page.url();
    expect(currentUrl.includes('/register')).toBeTruthy();
  });

  test('TC-REG-004: Should fail to register with empty password', async ({ page }) => {
    // Arrange
    const registerPage = new RegisterPage(page);
    const userData = TestDataGenerator.getValidUserData();
    
    // Act - Try to register with empty password
    await registerPage.register(userData.username, userData.email, '');
    
    // Assert - Should stay on register page
    await page.waitForTimeout(1000);
    const currentUrl = page.url();
    expect(currentUrl.includes('/register')).toBeTruthy();
  });

  test('TC-REG-005: Should fail to register with invalid email format', async ({ page }) => {
    // Arrange
    const registerPage = new RegisterPage(page);
    const userData = TestDataGenerator.getValidUserData();
    
    // Act - Try to register with invalid email
    await registerPage.register(userData.username, 'invalidemail', userData.password);
    
    // Assert - Should stay on register page (HTML5 validation)
    await page.waitForTimeout(1000);
    const currentUrl = page.url();
    expect(currentUrl.includes('/register')).toBeTruthy();
  });

  test('TC-REG-006: Should fail to register with username too long', async ({ page }) => {
    // Arrange
    const registerPage = new RegisterPage(page);
    const userData = TestDataGenerator.getValidUserData();
    const longUsername = 'verylongusername123'; // More than 15 characters
    
    // Act - Try to register with username > 15 chars
    await registerPage.register(longUsername, userData.email, userData.password);
    
    // Assert - Should show error or stay on register page
    await page.waitForTimeout(1000);
    const hasError = await registerPage.errorMessage.isVisible().catch(() => false);
    const currentUrl = page.url();
    
    expect(hasError || currentUrl.includes('/register')).toBeTruthy();
  });
  
  test('TC-REG-007: Should fail to register with existing username', async ({ page }) => {
    // Arrange
    const registerPage = new RegisterPage(page);
    const userData = TestDataGenerator.getValidUserData();
    
    // Act - Try to register with empty username
    await registerPage.register(EXISTING_USER.username, userData.email, userData.password);
    
    // Assert - Should stay on register page
    await page.waitForTimeout(1000);
    const currentUrl = page.url();
    expect(currentUrl.includes('/register')).toBeTruthy();
  });

  test('TC-REG-008: Should fail to register with existing email', async ({ page }) => {
    // Arrange
    const registerPage = new RegisterPage(page);
    const userData = TestDataGenerator.getValidUserData();
    
    // Act - Try to register with empty username
    await registerPage.register(userData.username, EXISTING_USER.email, userData.password);
    
    // Assert - Should stay on register page
    await page.waitForTimeout(1000);
    const currentUrl = page.url();
    expect(currentUrl.includes('/register')).toBeTruthy();
  });
  
  test('TC-REG-009: All buttons should be visible on Register page', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  await registerPage.goto();

  const allButtonsVisible = await registerPage.areAllButtonsVisible();
  expect(allButtonsVisible).toBeTruthy();
});


});
