export interface TestLog {
  test_name: string;
  status: string;
  duration_ms: number;
  error_message: string | null;
  run_date: string;
}

export interface TestLogRow {
  test_name: string;
  status: string;
  duration_ms: number | null;
  error_message: string | null;
  run_date: string;
}

export interface FailedTestRow {
  test_name: string;
  error_message: string | null;
  run_date: string;
}

export interface TestStatsRow {
  total_tests: number;
  passed: number;
  failed: number;
  skipped: number;
  avg_duration_ms: number;
  first_run: string;
  last_run: string;
}