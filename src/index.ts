import { mergeTests } from '@playwright/test';
import { pages } from '@/fixtures/pages';
import { loggedIn } from '@/fixtures/loggedIn';
import { loginErrorMessage } from '@/fixtures/loginError';

export const test = mergeTests(pages, loginErrorMessage, loggedIn);
export { expect } from '@playwright/test';