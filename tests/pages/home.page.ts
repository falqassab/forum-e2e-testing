import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Home Page
 */
export class HomePage {
  readonly page: Page;
  readonly logoutButton: Locator;
  readonly createPostButton: Locator;
  readonly userMenu: Locator;
  readonly loginButton: Locator;
  readonly registerButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logoutButton = page.locator('button:has-text("Logout"), form[action="/logout"] button');
    this.createPostButton = page.locator('button:has-text("Create Post")');
    this.userMenu = page.locator('.hamburger-menu, .menu-toggle');
    this.loginButton = page.locator('button:has-text("Login")');
    this.registerButton = page.locator('button:has-text("Register")');
  }

  async goto() {
    await this.page.goto('/');
  }

  async logout() {
    // Ensure we're on home page and wait for it to load
    await this.page.goto('/', { waitUntil: 'networkidle' });
    await this.page.waitForTimeout(1000);
    
    // Check if hamburger exists (only visible when logged in)
    const hamburger = this.page.locator('label.hamburger, .hamburger, [for="menu-toggle"]');
    const isHamburgerVisible = await hamburger.isVisible().catch(() => false);
    
    if (!isHamburgerVisible) {
      // Already logged out or no menu available
      return;
    }
    
    // Click hamburger to open menu
    await hamburger.click();
    await this.page.waitForTimeout(500);
    
    // Wait for menu to open and logout button to be visible
    await this.logoutButton.waitFor({ state: 'visible', timeout: 5000 });
    
    // Click logout button
    await this.logoutButton.click();
    await this.page.waitForTimeout(500);
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      // Check if hamburger menu exists (visible to logged-in users)
      const hamburger = this.page.locator('.hamburger');
      const isHamburgerVisible = await hamburger.isVisible({ timeout: 2000 });
      
      if (isHamburgerVisible) {
        // Click the hamburger to open menu
        await hamburger.click();
        await this.page.waitForTimeout(300);
        
        // Check if logout button is visible in the dropdown
        return await this.logoutButton.isVisible({ timeout: 2000 });
      }
      
      return false;
    } catch {
      return false;
    }
  }

    async isLoggedOut(): Promise<boolean> {
    try {
      // Check UI
      const loginVisible = await this.loginButton.isVisible({ timeout: 2000 });

      // Check session cookie
      const cookies = await this.page.context().cookies();
      const sessionExists = cookies.some(c => c.name === 'session_id');

      return loginVisible && !sessionExists;
    } catch {
      return false;
    }
  }
}

