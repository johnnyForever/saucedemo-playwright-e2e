import { expect, type Page, type Locator } from '@playwright/test';
import { Labels } from '@/data/labels.ts';
import { ProductData } from '@/types/products.ts';
import { FilterOptions } from '@/data/product-filter.ts';
import { productItem } from '@/locators/product-locators.ts';

export class DashboardPage {
  readonly page: Page;
  readonly title: Locator;
  readonly shoppingCart: Locator;
  readonly productsComponent: Locator;
  readonly productsItems: Locator;
  readonly productSortFilter: Locator;
  readonly selectedSortFilter: Locator;
  readonly sidebarBurgerButton: Locator;
  readonly sidebarBurgerItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.app_logo');
    this.shoppingCart = page.locator('#shopping_cart_container');
    this.productsComponent = page.getByText(Labels.elementLabels['productsTitle']);
    this.productsItems = page.locator('.inventory_item'),
    this.productSortFilter = page.getByTestId('product-sort-container');
    this.selectedSortFilter = page.getByTestId('active-option');
    this.sidebarBurgerButton = page.getByRole('button', { name: /Open Menu/i });
    this.sidebarBurgerItems = page.locator('.bm-item-list').locator('a');
  }

  async verifyDashboard() {
    await expect.soft(this.title).toHaveText(Labels.elementLabels['pageHeader']);
    await expect.soft(this.shoppingCart).toBeVisible();
    await expect.soft(this.productsComponent).toBeVisible();
    await expect.soft(this.page).toHaveURL(process.env.DASHBOARD_URL!);
  }

  async countInventory(expected: number) {
    return await expect.soft(this.productsItems).toHaveCount(expected);
  }

  async clickSidebarBtnAndVerify() {
    await this.sidebarBurgerButton.click();
    await expect(this.sidebarBurgerItems.filter({ hasText: Labels.sidebarElLabels['allItems'] })).toBeVisible();
    await expect(this.sidebarBurgerItems.filter({ hasText: Labels.sidebarElLabels['about'] })).toBeVisible();
    await expect(
      this.sidebarBurgerItems.filter({
        hasText: Labels.sidebarElLabels.about,
      })
    ).toHaveAttribute('href', process.env.ABOUT_URL!);
    await expect(this.sidebarBurgerItems.filter({ hasText: Labels.sidebarElLabels['logout'] })).toBeVisible();
    await expect(this.sidebarBurgerItems.filter({ hasText: Labels.sidebarElLabels['resetApp'] })).toBeVisible();
  }

  async selectSortFilter(filterOption: FilterOptions) {
    await this.productSortFilter.selectOption(filterOption.elementAttribute);
    await expect(this.selectedSortFilter).toHaveText(filterOption.label);
  }

  async verifyProductsSorting(expectedProducts: ProductData[]): Promise<void> {
    const count = await this.productsItems.count();
    expect(count).toBe(expectedProducts.length);
    for (let i = 0; i < count; i++) {
      const product = this.getProductItem(i);
      const expectedData = expectedProducts[i];
      await expect.soft(product.name).toHaveText(expectedData.name, { timeout: 7000 });
      await expect.soft(product.description).toHaveText(expectedData.description, { timeout: 7000 });
      await expect.soft(product.price).toHaveText(expectedData.price, { timeout: 7000 });
    }
  }

  async getAllProductItems() {
    const count = await this.productsItems.count();
    const products = [];
    for (let i = 0; i < count; i++) {
      products.push(this.getProductItem(i));
    }
    return products;
  }

  getProductItem(index: number) {
    const root = this.productsItems.nth(index);
    return productItem(root);
  }

  async getProductItemAsync(index: number) {
    await this.productsItems.nth(index).waitFor({ state: 'visible' });
    return this.getProductItem(index);
  }
}
