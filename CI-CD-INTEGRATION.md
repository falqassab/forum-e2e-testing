# CI/CD Integration Guide

This guide explains how to integrate the Playwright end-to-end testing framework into various CI/CD pipelines.

## GitHub Actions

**IMPLEMENTED** - See `.github/workflows/` for complete implementations:
- `playwright.yml` - Main E2E tests (runs on push/PR)

### Quick Start

The workflows are already configured and will run automatically on:
- Push to main branches
- Pull requests
- Manual trigger

### Example Configuration

Here's the reference implementation (already in `.github/workflows/playwright.yml`):

```yaml
name: Playwright E2E Tests
on:
  workflow_dispatch:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        project: [chromium, firefox, webkit]
    steps:
      - name: Checkout E2E repo
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: |
          npm ci
          npx playwright install --with-deps ${{ matrix.project }}

      - name: Run tests
        run: npx playwright test --project=${{ matrix.project }}
        env:
          BASE_URL: ${{ secrets.BASE_URL }}
          CI: true

```

## Best Practices

### 1. **Parallelization**

Run tests in parallel to reduce execution time:

```yaml
# GitHub Actions Example
strategy:
  matrix:
    shardIndex: [1, 2, 3, 4]
    shardTotal: [4]
steps:
  - run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}
```

### 2. **Caching**

Cache dependencies to speed up builds:

```yaml
# GitHub Actions
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

### 3. **Environment Variables**

Set environment-specific variables:

```yaml
env:
  BASE_URL: http://localhost:8070
  CI: true
```

### 4. **Retry Failed Tests**

Configure retries in CI:

```typescript
// playwright.config.ts
retries: process.env.CI ? 2 : 0,
```

### 5. **Test Reports**

Always upload test reports and artifacts:
- HTML reports for visualization
- Screenshots for failed tests
- Videos for debugging
- Traces for detailed analysis

### 6. **Notifications**

Set up notifications for test failures:
- Slack notifications
- Email alerts
- GitHub commit status checks

### 7. **Scheduled Tests**

Run tests on a schedule:

```yaml
# GitHub Actions
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight
```
---

## Troubleshooting CI/CD Issues

### Common Issues

1. **Browser Installation Fails**
   ```bash
   npx playwright install --with-deps
   ```

2. **Port Already in Use**
   ```bash
   lsof -ti:8070 | xargs kill -9
   ```

3. **Timeout Issues**
   - Increase timeout in config
   - Add explicit waits
   - Check server startup time

4. **Flaky Tests**
   - Use auto-waiting
   - Avoid sleep()
   - Use proper assertions

