# Forum Application - End-to-End Testing Framework

This project contains a comprehensive end-to-end testing framework for the Forum application using Playwright and TypeScript.

## Overview

This testing framework validates the forum application's core functionality including:
- User registration (signup)
- User authentication (login)
- User session management (logout)
- Error handling and validation
- Cross-browser compatibility
- Mobile responsiveness

## Test Coverage

### Authentication Tests

#### Registration Tests (`signup.spec.ts`)

| Test ID | Test Case                  | Description                                       |
|---------|----------------------------|---------------------------------------------------|
| TC-REG-001 | Valid Registration      | Successful user registration with valid data      |
| TC-REG-002 | Empty Username          | Registration fails with empty username            |
| TC-REG-003 | Empty Email             | Registration fails with empty email               |
| TC-REG-004 | Empty Password          | Registration fails with empty password            |
| TC-REG-005 | Invalid Email Format    | Registration fails with invalid email             |
| TC-REG-006 | Invalid username Format | Registration fails with invalid username          |
| TC-REG-007 | Duplicate Username      | Registration fails with existing username         |
| TC-REG-008 | Duplicate Email         | Registration fails with existing email            |
| TC-REG-009 | All buttons visible     | All buttons should be visible on                  |

All buttons should be visible on Register page
#### Login Tests (`login.spec.ts`)

| Test ID      | Test Case                  | Description                                  |
|--------------|----------------------------|----------------------------------------------|
| TC-LOGIN-001 | Valid Login                | Successful login with valid credentials      |
| TC-LOGIN-002 | Unregistered User          | Login fails with unregistered email.         |
| TC-LOGIN-003 | Wrong Password             | Login fails with incorrect password          |
| TC-LOGIN-004 | Empty email                | Login fails with empty email field           |
| TC-LOGIN-005 | Empty Password             | Login fails with empty password field        |
| TC-LOGIN-006 | All Empty                  | Login fails with all fields empty            |
| TC-LOGIN-007 | Session Persistence        | User remains logged in after page refresh    |
| TC-LOGIN-008 | Navigation                 | Successful navigation to register page       |

#### Logout Tests (`logout.spec.ts`)
| Test ID       | Test Case         | Description                                          |
|---------------|-------------------|------------------------------------------------------|
| TC-LOGOUT-001 | Session Clearing  | Session is cleared after logout                      |
| TC-LOGOUT-002 | Protected Routes  | Protected pages redirect after logout                |
| TC-LOGOUT-003 | Browser Back      | Cannot access protected pages using back button      |

## Prerequisites

- **Node.js**: v16 or higher
- **npm**: v7 or higher
- **Running Forum Application**: The forum app should be running on `http://localhost:8070`

## Installation

1. Navigate to the forum-e2e-testing directory:
```bash
cd e2e-testing
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Run tests in UI mode (interactive)
```bash
npm run test:ui
```

### Run tests with specific browser
```bash
# Chrome only
npm run test:chrome

# Firefox only
npm run test:firefox

# Safari only
npm run test:safari
```

### Run mobile tests
```bash
npm run test:mobile
```

### Run cross-browser tests
```bash
npm run test:all
```

### Debug tests
```bash
npm run test:debug
```

### Generate code (Record actions)
```bash
npm run codegen
```

## Test Reports

After running tests, view the HTML report:
```bash
npm run report
```

The report includes:
- Test execution results
- Screenshots on failure
- Video recordings on failure
- Execution traces for debugging

Reports are generated in the `playwright-report` directory.

## Test Structure

```
forum-e2e-testing/
├── tests/
│   ├── auth/
│   │   ├── signup.spec.ts       # Registration tests
│   │   ├── login.spec.ts        # Login tests
│   │   └── logout.spec.ts       # Logout tests
│   ├── pages/
│   │   ├── register.page.ts     # Register page object
│   │   ├── login.page.ts        # Login page object
│   │   ├── home.page.ts         # Home page object
│   │   └── index.ts             # Page exports
│   └── data/
│       └── test-data.ts         # Test data generators
├── playwright.config.ts         # Playwright configuration
├── package.json                 # Dependencies and scripts
├── CI-CD-INTEGRATION.md         # CI/CD setup guide
└── README.md                    # This file
```

### Page Object Model (POM)

The framework uses Page Object Model for maintainability:

- **RegisterPage** (`pages/register.page.ts`): Handles registration page interactions
- **LoginPage** (`pages/login.page.ts`): Handles login page interactions
- **HomePage** (`pages/home.page.ts`): Handles home page and navigation
- **index.ts**: Central export for clean imports

### Test Data Management

Dynamic test data generation (`data/test-data.ts`) ensures:
- No test data conflicts
- Unique users for each test run
- Reusable test data utilities
- Separation of concerns

## CI/CD Integration

See [CI-CD-INTEGRATION.md] for detailed integration guides for:
- GitHub Actions

## Best Practices

1. **Test Isolation**: Each test is independent and can run in any order
2. **Dynamic Data**: Tests generate unique data to avoid conflicts
3. **Explicit Waits**: Uses Playwright's auto-waiting mechanisms
4. **Page Objects**: Separates page interactions from test logic
5. **Clear Assertions**: Meaningful assertion messages
6. **Error Handling**: Graceful handling of edge cases
7. **Screenshots & Videos**: Captured on failures for debugging

## Browser Support

- Chromium (Chrome, Edge)
- Firefox
- WebKit (Safari)
- Mobile Chrome (Android)
- Mobile Safari (iOS)

## Mobile Testing

Tests run on mobile viewports:
- **Pixel 5** (Android)
- **iPhone 12** (iOS)

## Writing New Tests

1. Create test file in appropriate directory (e.g., `tests/auth/`, `tests/posts/`)
2. Import page objects from `../pages` and test data from `../data/test-data`
3. Use descriptive test names with test IDs (TC-XXX-###)
4. Follow AAA pattern (Arrange, Act, Assert)
5. Add test documentation

Example:
```typescript
import { test, expect } from '@playwright/test';
import { LoginPage, HomePage } from '../pages';
import { TestDataGenerator } from '../data/test-data';

test('TC-XXX-001: Should do something specific', async ({ page }) => {
  // Arrange
  const loginPage = new LoginPage(page);
  const testData = TestDataGenerator.getValidUserData();
  
  // Act
  await loginPage.goto();
  await loginPage.login(testData.username, testData.password);
  
  // Assert
  await expect(page).toHaveURL(/\//);
});
```

### Creating New Page Objects

Add new page objects in `tests/pages/`:

```typescript
// tests/pages/create-post.page.ts
import { Page, Locator } from '@playwright/test';

export class CreatePostPage {
  readonly page: Page;
  readonly titleInput: Locator;
  readonly contentTextarea: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titleInput = page.locator('input[name="title"]');
    this.contentTextarea = page.locator('textarea[name="content"]');
    this.submitButton = page.locator('button[type="submit"]');
  }

  async goto() {
    await this.page.goto('/createPost');
  }

  async createPost(title: string, content: string) {
    await this.titleInput.fill(title);
    await this.contentTextarea.fill(content);
    await this.submitButton.click();
  }
}
```

Then export it in `tests/pages/index.ts`:
```typescript
export { CreatePostPage } from './create-post.page';
```

## Troubleshooting

### Forum app not running
Ensure the forum application is running on port 8070 before running tests.

### Browser installation issues
```bash
npx playwright install --with-deps
```

### Port conflicts
Update `baseURL` in `playwright.config.ts` if using a different port.

### Test timeouts
Increase timeout in `playwright.config.ts` if needed:
```typescript
timeout: 60 * 1000, // 60 seconds
```
