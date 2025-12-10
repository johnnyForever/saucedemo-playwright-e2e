import { test as base, expect } from '@playwright/test';
import { LoginPage } from '@/pages/loginPage';

type LoginErrorFixture = {
  loginErrorMsg: {
    verifyErrorMessage: (text: string) => Promise<boolean>;
  };
};

export const loginErrorMessage = base.extend<LoginErrorFixture>({
  loginErrorMsg: async ({ page }, use) => {
    const loginErrorPage = new LoginPage(page);
    await use({
      verifyErrorMessage: async (text: string) => {
        try {
          await expect(page.getByText(text)).toBeVisible();
          await loginErrorPage.verifyErrorIconsCount();
          await loginErrorPage.verifyErrorIconsVisibility();
          await loginErrorPage.verifyErrorbackgroundColor();
          return true
        } catch {
          return false
        }
      }
    });
  }
});