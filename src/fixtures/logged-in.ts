import { test as base } from '@playwright/test';
import { LoginPage } from '@/pages/login-page.ts';
import { DashboardPage } from '@/pages/dashboard.ts';
import { loadUsers } from '@/db/export-users.ts';

const { standardUser } = loadUsers();

type LoggedInFixture = {
  loggedIn: DashboardPage;
  username: string;
  password: string;
};

export const test = base.extend<LoggedInFixture>({
  username: async ({}, use) => {
    await use(standardUser.username);
  },
  password: async ({}, use) => {
    await use(standardUser.password);
  },

  loggedIn: async ({ page, username, password }, use) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.openSaucedemoUrl();
    await loginPage.verifyPageHeader();
    await loginPage.verifyLoginPageContent();
    await loginPage.fillInLoginFields(username, password);
    await loginPage.loginButton.click();
 
    await use(new DashboardPage(page));
    },
  }
);