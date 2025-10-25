import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Register Page
 */
export class RegisterPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly registerButton: Locator;
  readonly loginLink: Locator;
  readonly googleLoginButton: Locator;
  readonly githubLoginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.registerButton = page.locator('button[type="submit"]');
    this.loginLink = page.locator('a[href="/login"]');
    this.googleLoginButton = page.locator('a.auth-login.google'); 
    this.githubLoginButton = page.locator('a.auth-login.github');
    this.errorMessage = page.locator('.error-message, .error, p:has-text("error"), p:has-text("exist")');
  }

  async goto() {
    await this.page.goto('/register');
  }

  async register(username: string, email: string, password: string) {
    await this.usernameInput.fill(username);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.registerButton.click();
  }

  async isRegisterFormVisible(): Promise<boolean> {
  try {
    // We check if the username input is visible as the main indicator of the register form
    return await this.usernameInput.isVisible({ timeout: 2000 });
  } catch {
    return false;
  }

  
}
  async areAllButtonsVisible(): Promise<boolean> {
    try {
      const registerVisible = await this.registerButton.isVisible({ timeout: 2000 });
      const loginLinkVisible = await this.loginLink.isVisible({ timeout: 2000 });
      const googleVisible = await this.googleLoginButton.isVisible({ timeout: 2000 }).catch(() => true); // optional, ignore if not present
      const githubVisible = await this.githubLoginButton.isVisible({ timeout: 2000 }).catch(() => true);

      return registerVisible && loginLinkVisible && googleVisible && githubVisible;
    } catch {
      return false;
    }
  }

  async waitForRegistration() {
    await this.page.waitForURL(/\/(login|$)/, { timeout: 5000 });
  }
}

