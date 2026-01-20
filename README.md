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
- **GitHub Actions** - CI/CD ready

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
│   ├── data/           # Test data and labels
│   ├── db/             # SQLite database utilities
│   ├── fixtures/       # Custom Playwright fixtures
│   ├── locators/       # Page element locators
│   ├── pages/          # Page Object Model classes
│   └── types/          # TypeScript type definitions
├── tests/
│   └── e2e/           # Test specifications
├── docs/              # Documentation
├── playwright.config.ts
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

- `loginPage` - Login page object
- `dashboardPage` - Dashboard page object
- `shoppingCart` - Shopping cart page object
- `loggedIn` - Pre-authenticated session
- `verifyShoppingCart` - Cart verification helper
- `productsData` - Product test data
- `logger` - Test execution logger (manual usage)

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
ABOUT_URL='https://saucelabs.com/'
```

## CI/CD

GitHub Actions workflow (`.github/playwright.yml`) runs tests on every push/PR:

1. Installs dependencies
2. Runs tests on `ubuntu-latest`
3. Uploads test reports as artifacts
4. Stores test results in database

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
