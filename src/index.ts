import { mergeTests } from '@playwright/test';
import { test as pages } from '@/fixtures/pages.ts';
import { test as loggedIn } from '@/fixtures/logged-in.ts';
import { test as loginError } from '@/fixtures/login-error.ts';
import { test as verifyAllProducts } from '@/fixtures/verify-products-details.ts';
import { test as exportAllProducts } from '@/fixtures/extract-all-products.ts';

export const test = mergeTests(
  loggedIn, 
  loginError, 
  pages, 
  verifyAllProducts, 
  exportAllProducts);

export { expect } from '@playwright/test';