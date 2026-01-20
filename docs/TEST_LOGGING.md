# Simple Test Logging

## What It Does

Automatically logs every test run with:

- Test name
- Status (passed/failed/skipped)
- Duration
- Error message (if failed)
- Timestamp

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
