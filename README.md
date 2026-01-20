# Saucedemo E2E Testing with Playwright

End-to-end test automation for [saucedemo.com](https://www.saucedemo.com/) using Playwright and TypeScript. This project demonstrates a complete testing setup with Page Object Model, custom fixtures, test execution logging, and Docker support.

## Features

- **Playwright 1.57.0** - Modern browser automation
- **TypeScript** - Type-safe test code
- **Page Object Model** - Maintainable test architecture
- **Custom Fixtures** - Reusable test components
- **SQLite Test Logging** - Track test execution history
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

   # Specific browser
   npx playwright test --project=chromium
   ```

4. **View results**

   ```bash
   # Open HTML report
   npm run report

   # View test logs from database
   npm run logs
   npm run logs:failed
   npm run logs:stats
   ```

## Project Structure

```
saucedemo-e2e/
├── src/
│   ├── components/     # Reusable UI components
│   ├── data/           # Test data, labels, and centralized test inputs
│   ├── db/             # SQLite database utilities and queries
│   ├── fixtures/       # Custom Playwright fixtures
│   ├── locators/       # Page element locators
│   ├── pages/          # Page Object Model classes
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Helper functions (sorting, colors, logging)
├── tests/
│   └── e2e/           # Test specifications
├── docs/              # Documentation (TEST_LOGGING.md, DOCKER.md)
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

# View logs
npm run docker:logs
```

## Test Logging

Every test execution is automatically logged to SQLite database (`playwright.db`). View logs using:

```bash
# Recent test executions
npm run logs

# Failed tests only
npm run logs:failed

# Test statistics
npm run logs:stats
```

The logger tracks:

- Test name
- Status (passed/failed/skipped)
- Duration
- Error messages
- Execution timestamp

See [docs/TEST_LOGGING.md](docs/TEST_LOGGING.md) for details.

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@/fixtures/index.ts';
import { Labels, checkoutUserData } from '@/data/index.ts';

test('My test', async ({ loginPage, dashboardPage }) => {
  await loginPage.openSaucedemoUrl();
  await loginPage.fillInLoginFields('standard_user', 'secret_sauce');
  await loginPage.loginButton.click();
  await dashboardPage.verifyDashboard();
});
```

### Using Test Steps

```typescript
test('Checkout flow', async ({ loggedIn, shoppingCart }) => {
  await test.step('Add items to cart', async () => {
    // ...
  });

  await test.step('Complete checkout', async () => {
    await shoppingCart.fillInCheckout(
      checkoutUserData.valid.firstName,
      checkoutUserData.valid.lastName,
      checkoutUserData.valid.zipCode
    );
  });
});
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

**Logging:**

- `logger` - Test execution logger (for manual custom logging)
- `autoLogger` - Auto-fixture that logs all test executions (runs automatically)

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

**Required:**

- `PASSWORD` - Password for test users (default: 'secret_sauce')

**Optional:**

- `DASHBOARD_URL` - Dashboard page path
- `ABOUT_URL` - About page URL for verification
- `DEBUG_LOGGER` - Set to 'true' to enable logger debug output

## CI/CD

GitHub Actions workflow (`.github/workflows/playwright.yml`) runs tests on every push/PR to `main` branch:

1. Checks out code
2. Sets up Node.js 24
3. Installs dependencies with `npm ci`
4. Installs Playwright browsers with OS dependencies
5. Runs all tests with required environment variables
6. Generates test annotations and summaries using GitHub reporter
7. Uploads test reports as artifacts (14-day retention)

### Viewing CI Test Results

After a workflow run completes, you can view test results in multiple ways:

**1. GitHub Annotations (Inline)**

- Test failures appear as annotations directly in the workflow run
- Click on failed tests to see error messages and stack traces
- File and line links navigate directly to the source code

**2. Workflow Artifacts**

- Go to the workflow run page
- Download the `playwright-report` artifact
- Extract and open `index.html` locally to view the full interactive report

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

### Database Logs

```bash
npm run logs           # Recent executions
npm run logs:failed    # Failed tests
npm run logs:stats     # Statistics
```

## Troubleshooting

### Tests Failing Locally

1. Clear test data: `npm run clean`
2. Reinstall browsers: `npx playwright install`
3. Check `.env` file exists and has correct PASSWORD

### Database Locked

```bash
# Stop any running processes
# Delete database
rm playwright.db
# Run tests again - database will be recreated
```

### Docker Issues

```bash
# Rebuild image
docker-compose build --no-cache

# Clean up
docker-compose down -v
```

## Contributing

1. Create feature branch
2. Write tests with proper test.step() organization
3. Ensure all tests pass locally
4. Update documentation if needed
5. Submit pull request

## Test Tags

- `@smoke` - Critical path tests (login, checkout)

Run specific tags:

```bash
npm run test:smoke
npx playwright test --grep @smoke
```

## License

MIT

## Author

Filip Gajdoš
