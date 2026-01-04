import { expect, type Page, type Locator } from '@playwright/test';
import { Labels } from '@/data/labels.ts';

export class SideBar {
  readonly page: Page;
  readonly sidebarBurgerButton: Locator;
  readonly sidebarBurgerItems: Locator;
  readonly allItemsBtn: Locator;
  readonly aboutBtn: Locator;
  readonly logoutBtn: Locator;
  readonly resetAppBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebarBurgerButton = page.getByRole('button', { name: /Open Menu/i });
    this.sidebarBurgerItems = page.locator('.bm-item-list').locator('a');
    this.allItemsBtn = this.sidebarBurgerItems.filter({ hasText: Labels.sidebarElLabels['allItems'] });
    this.aboutBtn = this.sidebarBurgerItems.filter({ hasText: Labels.sidebarElLabels['about'] });
    this.logoutBtn = this.sidebarBurgerItems.filter({ hasText: Labels.sidebarElLabels['logout'] });
    this.resetAppBtn = this.sidebarBurgerItems.filter({ hasText: Labels.sidebarElLabels['resetApp'] });
  }

  async clickSidebarBtnAndVerify() {
    await this.sidebarBurgerButton.click();
    await expect.soft(this.allItemsBtn).toBeVisible();
    await expect.soft(this.aboutBtn).toBeVisible();
    await expect.soft(this.aboutBtn).toHaveAttribute('href', process.env.ABOUT_URL!);
    await expect.soft(this.logoutBtn).toBeVisible();
    await expect.soft(this.resetAppBtn).toBeVisible();
  }

  async clickAllItemsBtn() {
    await expect(this.allItemsBtn).toBeEnabled();
    await this.allItemsBtn.click();
  }

  async clickResetAppBtn() {
    await expect(this.resetAppBtn).toBeEnabled();
    await this.resetAppBtn.click();
  }

  async clickLogoutBtn() {
    await expect(this.logoutBtn).toBeEnabled();
    await this.logoutBtn.click();
  }
}
