import { expect, type Page, type Locator } from '@playwright/test';
import { Labels } from '@/data/labels';
import { FilterOptions } from '@/data/product-filter';
import { productDashboardItem } from '@/locators/product-locators';

export class DashboardPage {
  readonly page: Page;
  readonly title: Locator;
  readonly shoppingCart: Locator;
  readonly productsComponent: Locator;
  readonly products: Locator;
  readonly productSortFilter: Locator;
  readonly selectedSortFilter: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.app_logo');
    this.shoppingCart = page.locator('#shopping_cart_container');
    this.productsComponent = page.getByText(Labels.productsTitle);
    this.products = productDashboardItem.productItem(page);
    this.productSortFilter = page.getByTestId('product-sort-container');
    this.selectedSortFilter = page.getByTestId('active-option');
  }

  async verifyDashboard() {
    await expect.soft(this.title).toHaveText(Labels.pageHeader);
    await expect.soft(this.shoppingCart).toBeVisible();
    await expect.soft(this.productsComponent).toBeVisible();
    await expect.soft(this.page).toHaveURL(process.env.DASHBOARD_URL!);
  }

  async countInventory(expected: number) {
    return await expect.soft(this.products).toHaveCount(expected);
  }

  async selectSortFilter(filter: FilterOptions) {
    await this.productSortFilter.selectOption(filter.element);
    await expect(this.selectedSortFilter).toHaveText(filter.label);
  }
}
