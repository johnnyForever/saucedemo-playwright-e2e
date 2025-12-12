import type { Page, Locator } from '@playwright/test';

export const productDashboardItem = {
  productItem: (page: Page): Locator => page.locator('.inventory_item'),
  name: (productItem: Locator) => productItem.getByTestId('inventory-item-name'),
  description: (productItem: Locator) => productItem.getByTestId('inventory-item-desc'),
  price: (productItem: Locator) => productItem.getByTestId('inventory-item-price'),
  image: (productItem: Locator) => productItem.locator('img.inventory_item_img'),
  addToCart: (productItem: Locator) => productItem.locator('button:has-text("Add to cart")'),
};

export const productDetailItem = {
  productDetail: (page: Page): Locator => page.locator('.inventory_details'),
  name: (productDetail: Locator): Locator => productDetail.locator('.inventory_details_name'),
  description: (productDetail: Locator): Locator => productDetail.locator('.inventory_details_desc'),
  price: (productDetail: Locator): Locator => productDetail.locator('.inventory_details_price'),
  addToCart: (productDetail: Locator) => productDetail.locator('button:has-text("Add to cart")'),
};
