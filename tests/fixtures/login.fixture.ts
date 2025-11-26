import { test as baseTest, expect, type Page } from '@playwright/test';

type LoginFixtures = {
  loginPage: Page;
  loginPageWithCredentials: (email: string, password: string, url: string) => Promise<void>;
};

export const test = baseTest.extend<LoginFixtures>({
  loginPage: async ({ page }, use) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Swag Labs/);

    await expect(page.getByPlaceholder('Username')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();

    const loginButton = page.locator('#login-button');
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeEnabled();

    await use(page);
  },

loginPageWithCredentials: async ({ loginPage }, use) => {
    const login = async (username: string, password: string, url: string) => {
      await loginPage.getByPlaceholder('Username').fill(username);
      await loginPage.getByPlaceholder('Password').fill(password);
      await loginPage.locator('#login-button').click();

      await loginPage.waitForURL(url);
    };

      await use(login);
  },
});

export { expect };