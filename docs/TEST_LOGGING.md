# Simple Test Logging

## What It Does

Automatically logs every test run with:

- Test name
- Status (passed/failed/skipped)
- Duration
- Error message (if failed)
- Timestamp

## Usage

### Automatic Logging

All tests are automatically logged when you use the merged test fixture from `@/fixtures/index.ts`:

```typescript
import { test, expect } from '@/fixtures/index.ts';

test('My test', async ({ page }) => {
  // Test runs normally
  // Auto-logger records the result automatically
});
```

The `autoLogger` fixture runs in the background for every test - no need to include it in parameters!

### Manual Logging

If you need to log custom events or additional test data, use the logger fixture directly:

```typescript
import { test } from '@/fixtures/index.ts';

test('My test', async ({ logger }) => {
  // Manually log custom test events
  logger.logTest('Custom event', 'passed', 1000);
});
```

Or log tests manually outside of fixtures:

```typescript
import { getTestLogger } from '@/db/test-logger.ts';

const logger = getTestLogger();

// Log a test
logger.logTest('My test name', 'passed', 1500);
logger.logTest('Failed test', 'failed', 2000, 'Timeout error');
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
```

### Direct Commands

```bash
npx tsx src/db/view-logs.ts recent
npx tsx src/db/view-logs.ts failed
npx tsx src/db/view-logs.ts stats
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
```

## Database Tables

### test_log

- `test_name` - Name of the test
- `status` - passed/failed/skipped
- `duration_ms` - How long it took
- `error_message` - Error if failed
- `run_date` - When it ran

Simple and practical! 👍
