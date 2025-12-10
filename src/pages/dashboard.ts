import type { Page, Locator } from '@playwright/test';
import { expect, test } from '@playwright/test';
import elementText from '@/data/textations.json';

export class DashboardPage {
  readonly page: Page;
  readonly title: Locator;
  readonly shoppingCart: Locator;
  readonly productsComponent: Locator;
  readonly products: Locator;
  readonly addToCartBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.app_logo');
    this.shoppingCart = page.locator('#shopping_cart_container');
    this.productsComponent = page.getByText(elementText.products_title);
    this.products = page.locator('.inventory_item');
    this.addToCartBtn = page.getByRole('button', { name: /add to cart/i });
  }

  async verifyDashboard() {
    await expect(this.title).toHaveText(elementText.page_header);
    await expect(this.shoppingCart).toBeVisible();
    await expect(this.productsComponent).toBeVisible();
    await expect(this.page).toHaveURL(process.env.DASHBOARD_URL!);
  }

  async countInventory(expected: number) {
    return await expect(this.products).toHaveCount(expected);
  }
}
