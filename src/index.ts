import { mergeTests } from '@playwright/test';
import { test as pages } from '@/fixtures/pages';
import { test as loggedIn } from '@/fixtures/logged-in';
import { test as loginError } from '@/fixtures/login-error';
import { test as verifyAllProducts } from '@/fixtures/verify-all-products';
import { test as exportAllProducts } from '@/fixtures/extract-all-products';

export const test = mergeTests(
  loggedIn, 
  loginError, 
  pages, 
  verifyAllProducts, 
  exportAllProducts);

export { expect } from '@playwright/test';