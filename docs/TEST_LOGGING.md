# Simple Test Logging & Cleanup Tracking

## What It Does

### 1. Test Execution Log

Automatically logs every test run with:

- Test name
- Status (passed/failed/skipped)
- Duration
- Error message (if failed)
- Timestamp

### 2. Cleanup Tracking

Track resources created during tests for cleanup:

- Shopping cart items
- User sessions
- Temporary data
- Any test artifacts

## Usage

### Automatic Logging (Option 1)

Use the logger fixture in your tests:

```typescript
import { test, expect } from '@/fixtures/test-logger.ts';

test('My test', async ({ logger }) => {
  // Test runs normally
  // Logger automatically records the result
});
```

### Manual Logging (Option 2)

Log tests manually:

```typescript
import { getTestLogger } from '@/db/test-logger.ts';

const logger = getTestLogger();

// Log a test
logger.logTest('My test name', 'passed', 1500);
logger.logTest('Failed test', 'failed', 2000, 'Timeout error');
```

### Track Cleanup

Track resources that need cleanup:

```typescript
import { getTestLogger } from '@/db/test-logger.ts';

const logger = getTestLogger();

// Track item added to cart
logger.trackResource('cart-item', 'product-123', 'Shopping cart test');

// After cleanup
logger.markResourceCleaned('cart-item', 'product-123');
```

## View Logs

### NPM Scripts

```bash
# Recent test executions
npm run logs

# Failed tests only
npm run logs:failed

# Test statistics
npm run logs:stats

# Pending cleanup items
npm run logs:cleanup
```

### Direct Commands

```bash
npx tsx src/db/view-logs.ts recent
npx tsx src/db/view-logs.ts failed
npx tsx src/db/view-logs.ts stats
npx tsx src/db/view-logs.ts cleanup
```

## Example: Track Cart Cleanup

```typescript
import { test } from '@/fixtures/test-logger.ts';

test('Add items to cart', async ({ loggedIn, dashboardPage, logger }) => {
  const products = await dashboardPage.getAllProductItems();

  // Add items and track them
  for (let i = 0; i < 3; i++) {
    await products[i].addToCartBtn.click();
    logger.trackResource('cart-item', `product-${i}`, 'Add items to cart');
  }

  // ... test continues ...

  // If you clean up during test
  logger.markResourceCleaned('cart-item', 'product-0');
});
```

## Query Methods

```typescript
const logger = getTestLogger();

// Get recent logs
const recent = logger.getRecentLogs(10);

// Get failed tests
const failed = logger.getFailedTests(20);

// Get statistics
const stats = logger.getTestStats();

// Get pending cleanup
const pending = logger.getPendingCleanupItems();
```

## Database Tables

### test_log

- `test_name` - Name of the test
- `status` - passed/failed/skipped
- `duration_ms` - How long it took
- `error_message` - Error if failed
- `run_date` - When it ran

### test_cleanup

- `resource_type` - Type (cart-item, session, etc.)
- `resource_id` - Unique identifier
- `test_name` - Which test created it
- `cleaned_up` - 0 = pending, 1 = done
- `created_at` - When it was created

Simple and practical! 👍
