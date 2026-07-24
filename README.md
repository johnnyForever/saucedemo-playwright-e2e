# Saucedemo E2E Testing with Playwright

This is end-to-end test automation framework built with Playwright and TypeScript for testing [saucedemo.com](https://www.saucedemo.com/), a demo e-commerce application created by Sauce Labs. This project was created as a showcase of modern test automation best practices, demonstrating how to build a maintainable, scalable, and production-ready testing solution.

## Features

- **Playwright** - Modern browser automation
- **TypeScript** - Type-safe test code
- **Page Object Model** - Maintainable test architecture
- **Custom Fixtures** - Reusable test components
- **Docker Support** - Containerized testing
- **Allure Reports** - Detailed test reporting
- **GitHub Actions** - CI/CD with automated test reporting and annotations

## Prerequisites

- Node.js >= 20.0.0
- npm or yarn
- Docker (optional, for containerized testing)

## Quick Start

1. **Clone and install**

   ```bash
   git clone <repository-url>
   cd saucedemo-e2e
   npm install
   ```

2. **Set up environment**

   ```bash
   cp .env.example .env
   ```

   The `.env` file contains necessary credentials (PASSWORD is already set to the correct value).

3. **Run tests**

   ```bash
   # All tests
   npm test

   # Smoke tests only
   npm run test:smoke

   # Security tests only
   npm run test:security

   # Specific browser
   npx playwright test --project=chromium
   ```

4. **View results**

   ```bash
   # Open HTML report
   npm run report
   ```

## Project Structure

```
saucedemo-e2e/
├── src/
│   ├── components/     # Reusable UI components
│   ├── data/           # Test data, labels, and centralized test inputs
│   ├── fixtures/       # Custom Playwright fixtures
│   ├── locators/       # Page element locators
│   ├── pages/          # Page Object Model classes
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Helper functions (sorting, colors)
├── tests/
│   └── e2e/           # Test specifications
├── docs/              # Documentation (DOCKER.md)
├── .github/
│   └── workflows/     # GitHub Actions CI/CD
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

## Running Tests

### Local Development

```bash
# All tests with UI
npx playwright test --ui

# Specific test file
npx playwright test tests/e2e/login.spec.ts

# Debug mode
npx playwright test --debug

# Headed mode (see browser)
npx playwright test --headed

# Multiple browsers
npx playwright test --project=chromium --project=firefox
```

### Docker

```bash
# Run all tests in Docker
npm run docker:test

# Run smoke tests
npm run docker:smoke

# Access container shell
npm run docker:shell
```

### Available Fixtures

**Page Objects:**

- `loginPage` - Login page object
- `dashboardPage` - Dashboard page object
- `shoppingCart` - Shopping cart page object

**Authentication:**

- `loggedIn` - Pre-authenticated session with standard user
- `username` - Configurable username for login
- `password` - Configurable password for login

**Verification Helpers:**

- `verifyShoppingCart(count)` - Verify shopping cart badge count
- `verifyProductDetail(products)` - Verify product detail pages match data
- `verifyDashboardItems()` - Verify all dashboard product items
- `loginErrorMsg.verifyErrorMessage(text)` - Verify login error messages

**Data:**

- `productsData` - Extracted product data from dashboard

**Setup/Teardown:**

- `testSetup` - Clears cookies/storage before each test (auto)
- `workerCleanup` - Cleanup at worker level (auto)

## Configuration

### Browser Configuration

Edit `playwright.config.ts` to customize:

- Timeout settings
- Browser projects (chromium, firefox, webkit, mobile)
- Video/screenshot settings
- Base URL
- Retries (0 locally, 2 in CI)

### Environment Variables

Create `.env` file (use `.env.example` as template):

```env
PASSWORD='secret_sauce'
DASHBOARD_URL='/inventory.html'
TOKEN_EP='submit.backtrace.io/UNIVERSE/TOKEN/json'
DASHBOARD_PICTURE_URL='/static/media/'
ABOUT_URL='https://saucelabs.com/'
```

## CI/CD

GitHub Actions workflow.

1. Checks out code
2. Sets up Node.js 24
3. Installs dependencies with `npm ci`
4. Installs Playwright browsers with OS dependencies
5. Runs all containerized tests with required environment variables
6. Generates test annotations and summaries using GitHub reporter
7. Uploads HTML test reports as artifacts 
8. Uploads JUnit XML reports as artifacts

- (`/.github/workflows/pr-check.yml`) runs smoke tests on every push/PR to `main` branch
- (`/.github/workflows/full-tests.yml`) runs all tests on demand

## Reports

### HTML Report

```bash
npm run report
# Opens browser with interactive test results
```

### Allure Report

```bash
npx allure generate allure-results --clean
npx allure open allure-report
```

Run specific tags:

```bash
npm run test:smoke
npm run test:security
npx playwright test --grep '@smoke'
npx playwright test --grep '@security'
```

## License

MIT

## Author

Filip Gajdoš