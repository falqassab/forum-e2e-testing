# GitHub Actions E2E Testing Guide

This guide provides detailed information about the GitHub Actions workflows configured for the Forum Security project's end-to-end testing.

## Workflow Files

### 1. `playwright.yml` - Main CI/CD Workflow

**Purpose:** Run E2E tests on every push and pull request

**Triggers:**
```yaml
on:
  push:
    branches: [ main, master, develop, final-advanced-feature ]
  pull_request:
    branches: [ main, master, develop ]
  workflow_dispatch:  # Manual trigger
```

**Test Coverage:**
- Desktop browsers: Chromium, Firefox, WebKit
- Mobile viewports: Pixel 5, iPhone 12
- All authentication tests (login, signup, logout)
- Cross-browser compatibility


**Artifacts Generated:**
- HTML test reports (30 days retention)
- Test failure videos (30 days retention)
- Playwright traces for debugging (30 days retention)

---

## Getting Started

### Enabling Workflows

1. **Push to GitHub:**
   ```bash
   git add .github/
   git commit -m "Add GitHub Actions workflows for E2E testing"
   git push origin main
   ```

2. **Verify Workflows:**
   - Go to your repository on GitHub
   - Click the **Actions** tab
   - You should see "Playwright E2E Tests" and "Nightly E2E Tests"
---

## Viewing Test Results

### In GitHub UI

1. **Navigate to Actions:**
   - Go to your repository
   - Click **Actions** tab

2. **Select a workflow run:**
   - Click on any workflow run to see details
   - View job summaries, logs, and status

3. **Download artifacts:**
   - Scroll to the "Artifacts" section at the bottom
   - Download `playwright-report-{browser}.zip`
   - Extract and open `index.html`

### Test Reports Include:

- Total tests run
- Pass/fail statistics
- Test duration
- Browser compatibility matrix
- Screenshots and videos of failures
- Stack traces and error messages
- Playwright traces (timeline view)

---

## Manual Workflow Trigger

To run tests manually:

1. Go to **Actions** → **Playwright E2E Tests**
2. Click **Run workflow** (top right)
3. Select branch
4. Click green **Run workflow** button

**Use cases for manual runs:**
- Testing before a release
- Debugging a specific issue
- Validating a fix
- Running tests on a feature branch

---

## Test Matrix Strategy

### Desktop Browsers
```yaml
strategy:
  matrix:
    project: [chromium, firefox, webkit]
```

This creates **3 parallel jobs**:
- Job 1: Chromium tests
- Job 2: Firefox tests
- Job 3: WebKit tests

### Mobile Devices
```yaml
strategy:
  matrix:
    device: ['Pixel 5', 'iPhone 12']
```

This creates **2 parallel jobs**:
- Job 1: Pixel 5 viewport tests
- Job 2: iPhone 12 viewport tests

**Total parallel jobs:** 5 (3 browsers + 2 mobile)

---

## Debugging Failed Tests

### Step 1: Check the Logs

1. Click on the failed job
2. Expand the failed test step
3. Read the error message and stack trace

### Step 2: Download Artifacts

```bash
# Download from GitHub Actions UI
# Extract playwright-report-{browser}.zip
cd playwright-report-{browser}
npx playwright show-report .
```

### Step 3: View Playwright Trace

If tests failed, traces are automatically generated:

```bash
# Download test-traces-{browser}.zip
npx playwright show-trace trace.zip
```

This opens an interactive timeline showing:
- Every action taken
- Network requests
- Console logs
- Screenshots at each step
- DOM snapshots

### Step 4: Reproduce Locally

```bash
# Navigate to e2e-tests directory
cd e2e-tests

# Run the specific failing test
npx playwright test tests/auth/login.spec.ts --project=chromium --headed

# Run with debugging
npx playwright test tests/auth/login.spec.ts --debug
```

---

## Configuration Options

### Adjusting Timeouts

Edit `playwright.yml`:
```yaml
jobs:
  test:
    timeout-minutes: 60  # Increase if tests timeout
```

### Running Specific Tests

Modify the test command:
```yaml
- name: Run Playwright tests
  run: npx playwright test tests/auth/  # Only auth tests
```

### Changing Retry Strategy

In `playwright.config.ts`:
```typescript
use: {
  retries: process.env.CI ? 2 : 0,  // Retry failed tests in CI
}
```
---

##  Performance Optimization

### Current Optimizations

1. **Caching:**
   - npm packages cached via `setup-node@v4`
   - Playwright browsers cached automatically

2. **Parallelization:**
   - Tests run in parallel across browsers
   - Multiple tests run concurrently within each browser

3. **Selective Installation:**
   ```yaml
   npx playwright install --with-deps ${{ matrix.project }}
   ```
   Only installs the browser needed for that job


## Troubleshooting

### Tests Pass Locally but Fail in CI

**Common causes:**
- Timing issues (CI is slower)
- Missing environment variables
- Different Node.js/Go versions
- Database state differences

**Solution:**
```typescript
// Increase timeouts in CI
test.setTimeout(process.env.CI ? 60000 : 30000);
```
