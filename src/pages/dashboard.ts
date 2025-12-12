import { expect, type Page, type Locator } from '@playwright/test';
import { Labels } from '@/data/labels.ts';
import { ProductData } from '@/types/products.ts';
import { FilterOptions } from '@/data/product-filter.ts';
import { productDashboardItem } from '@/locators/product-locators.ts';

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

  async selectSortFilter(filterOption: FilterOptions) {
    await this.productSortFilter.selectOption(filterOption.element);
    await expect(this.selectedSortFilter).toHaveText(filterOption.label);
  }

  async verifyProductsSorting(expectedProducts: ProductData[]): Promise<void> {
    const count = await this.products.count();
    expect(count).toBe(expectedProducts.length);
    for (let i = 0; i < count; i++) {
      const product = this.products.nth(i);
      const expected = expectedProducts[i];
    
      await expect.soft(productDashboardItem.name(product)).toHaveText(expected.name);
      await expect.soft(productDashboardItem.description(product)).toHaveText(expected.description);
      await expect.soft(productDashboardItem.price(product)).toHaveText(expected.price);
    }
  }
}