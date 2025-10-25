/**
 * Test data generators and utilities
 */

export class TestDataGenerator {
  /**
   * Generate a unique username (max 15 chars, no underscores)
   */
  static generateUniqueUsername(): string {
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits
    return `user${timestamp}`; // e.g., "user123456" (10 chars)
  }

  /**
   * Generate a unique email with timestamp
   */
  static generateUniqueEmail(): string {
    const timestamp = Date.now();
    return `test${timestamp}@example.com`;
  }

  /**
   * Generate a random password
   */
  static generatePassword(): string {
    return 'TestPassword123!';
  }

  /**
   * Get valid test user credentials
   */
  static getValidUserData() {
    return {
      username: this.generateUniqueUsername(),
      email: this.generateUniqueEmail(),
      password: this.generatePassword(),
    };
  }

  /**
   * Get invalid test data for negative testing
   */
  static getInvalidUserData() {
    return {
      emptyUsername: {
        username: '',
        email: this.generateUniqueEmail(),
        password: this.generatePassword(),
      },
      emptyEmail: {
        username: this.generateUniqueUsername(),
        email: '',
        password: this.generatePassword(),
      },
      emptyPassword: {
        username: this.generateUniqueUsername(),
        email: this.generateUniqueEmail(),
        password: '',
      },
      invalidEmail: {
        username: this.generateUniqueUsername(),
        email: 'invalidemail',
        password: this.generatePassword(),
      },
      shortPassword: {
        username: this.generateUniqueUsername(),
        email: this.generateUniqueEmail(),
        password: '123',
      },
    };
  }
}

/**
 * Common test user for reuse across tests
 * This is a real user that exists in the database
 */
export const EXISTING_USER = {
  username: 'ahmedy_990',
  email: 'ahmedahmed@gmail.com',
  password: '123456',
};

