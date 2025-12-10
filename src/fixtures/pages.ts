import { test as base } from '@playwright/test';
import { LoginPage } from '@/pages/loginPage';
import { DashboardPage } from '@/pages/dashboard';

type PagesFixture = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

export const pages = base.extend<PagesFixture>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
});
