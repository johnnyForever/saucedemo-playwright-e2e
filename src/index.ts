import { mergeTests } from '@playwright/test';
import { test as pages } from '@/fixtures/pages';
import { test as loggedIn } from '@/fixtures/logged-in';
import { test as loginError } from '@/fixtures/login-error';

export const test = mergeTests(loggedIn, loginError, pages);

export { expect} from '@playwright/test';