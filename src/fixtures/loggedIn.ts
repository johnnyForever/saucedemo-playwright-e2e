import { test as base } from '@playwright/test';
import { LoginPage } from '@/pages/loginPage';
import { DashboardPage } from '@/pages/dashboard';
import { loadUsers } from '@/db/exportUsers';

const { standardUser } = loadUsers();

type LoggedInFixture = {
  loggedIn: DashboardPage;
  username: string;
  password: string;
};

export const loggedIn = base.extend<LoggedInFixture>({
  username: async ({}, use) => {
    await use(standardUser.username);
  },

  password: async ({}, use) => {
    await use(standardUser.password);
  },

  loggedIn: async ({ browser, username, password }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const loginPage = new LoginPage(page);
    const loggedIn = new DashboardPage(page);

    await loginPage.openSaucedemoUrl();
    await loginPage.verifyPageHeader();
    await loginPage.verifyLoginPageContent();
    await loginPage.fillInLoginFields(username, password);
    await loginPage.loginButton.click();

    await use(loggedIn);
    await context.close();
  },
});
