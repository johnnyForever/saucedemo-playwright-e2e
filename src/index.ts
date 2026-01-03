import { mergeTests } from '@playwright/test';
import { test as pageObjects } from '@/fixtures/pages.ts';
import { test as loggedIn } from '@/fixtures/logged-in.ts';
import { test as loginError } from '@/fixtures/login-error.ts';
import { test as verifyDashboardItems } from '@/fixtures/verify-dashboard-items.ts';
import { test as exportAllProducts } from '@/fixtures/extract-all-products.ts';
import { test as verifyProductDetail } from '@/fixtures/verify-product-detail.ts';

export const test = mergeTests(
  loggedIn, 
  loginError, 
  pageObjects, 
  verifyDashboardItems, 
  exportAllProducts,
  verifyProductDetail
 );

export { expect } from '@playwright/test';