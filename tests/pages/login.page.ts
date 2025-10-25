import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Login Page
 */
export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly registerLink: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.registerLink = page.locator('a[href="/register"]');
    this.errorMessage = page.locator('.error, div:has-text("error"), p:has-text("Invalid")');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async waitForLogin() {
    await this.page.waitForURL(/\/$/, { timeout: 5000 });
  }
  async navigateToRegister() {
  await this.registerLink.click();
  await this.page.waitForLoadState('networkidle');
}
}

