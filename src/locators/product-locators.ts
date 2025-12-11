import type { Page, Locator } from '@playwright/test';

export const productDashboardItem = {
  product: (page: Page): Locator => page.locator('.inventory_item'),
  name: (product: Locator) => product.getByTestId('inventory-item-name'),
  description: (product: Locator) => product.getByTestId('inventory-item-desc'),
  price: (product: Locator) => product.getByTestId('inventory-item-price'),
  image: (product: Locator) => product.locator('img.inventory_item_img'),
};

export const productDetailItem = {
  name: (page: Page): Locator => page.locator('.inventory_details_name'),
  description: (page: Page): Locator => page.locator('.inventory_details_desc'),
  price: (page: Page): Locator => page.locator('.inventory_details_price'),
};
