import { expect, type Page, type Locator } from '@playwright/test';
import { Labels } from '@/data/labels.ts';
import { ProductData } from '@/types/products.ts';
import { FilterOptions } from '@/data/product-filter.ts';
import { productItem } from '@/locators/product-locators.ts';
import { Colors } from '@/data/colors.ts';
import { hexToRgb } from '@/utils/hex-to-rgb.ts';
import { SideBar } from '@/components/sidebar.ts';

export class DashboardPage{
  readonly page: Page;
  readonly sidebar: SideBar;
  readonly title: Locator;
  readonly shoppingCart: Locator;
  readonly productsComponent: Locator;
  readonly productsItems: Locator;
  readonly productSortFilter: Locator;
  readonly selectedSortFilter: Locator;
  readonly shoppingBasket: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = new SideBar(page);
    this.title = page.locator('.app_logo');
    this.shoppingCart = page.locator('#shopping_cart_container');
    this.productsComponent = page.getByText(Labels.elementLabels['productsTitle']);
    this.productsItems = page.locator('.inventory_item'),
    this.productSortFilter = page.getByTestId('product-sort-container');
    this.selectedSortFilter = page.getByTestId('active-option');
    this.shoppingBasket = page.getByTestId('shopping-cart-link').getByTestId('shopping-cart-badge');
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

  async clickShoppingBasket() {
    await this.shoppingBasket.locator('..').click();
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

  async verifyShoppingBasket(items: number) {
    if (items > 0) { 
      await expect(this.shoppingBasket).toBeVisible();
      await expect.soft(this.shoppingBasket).toHaveCSS('background-color', hexToRgb(Colors.alizarinCrimson));
      await expect.soft(this.shoppingBasket).toHaveText(String(items));
    } else {
      expect(this.shoppingBasket).toBeHidden();
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
