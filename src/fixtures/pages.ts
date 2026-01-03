import { test as base } from '@playwright/test';
import { LoginPage } from '@/pages/login-page.ts';
import { DashboardPage } from '@/pages/dashboard.ts';
import { ProductDetailPage } from '@/pages/products-detail.ts';

type PagesFixture = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  productDetailPage: ProductDetailPage;
};

export const test = base.extend<PagesFixture>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

   dashboardPage: async ({ page }, use) => {
     await use(new DashboardPage(page));
   },

  productDetailPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },
});
