import { test as base } from '@playwright/test';
import { LoginPage } from '@/pages/login-page.ts';
import { DashboardPage } from '@/pages/dashboard.ts';
import { ProductDetails } from '@/pages/products-details.ts';

type PagesFixture = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  productDetails: ProductDetails;
};

export const test = base.extend<PagesFixture>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

   dashboardPage: async ({ page }, use) => {
     await use(new DashboardPage(page));
   },

  productDetails: async ({ page }, use) => {
    await use(new ProductDetails(page));
  },
});
