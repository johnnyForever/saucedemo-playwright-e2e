import type { Locator, Page } from '@playwright/test';
import { Labels } from '@/data/labels.ts';

export const productItem = (root: Locator) => ({
  name: root.getByTestId('inventory-item-name'),
  description: root.getByTestId('inventory-item-desc'),
  price: root.getByTestId('inventory-item-price'),
  image: root.locator('img.inventory_item_img'),
  addToCart: root.locator(`button:has-text("${Labels.elementLabels['addToCartButton']}")`),
});

export const productDetail = (root: Page) => ({
  name: root.locator('.inventory_details_name'),
  description: root.locator('.inventory_details_desc'),
  price: root.locator('.inventory_details_price'),
  image: root.locator('img.inventory_detail_img'),
  addToCart: root.locator(`button:has-text("${Labels.elementLabels['addToCartButton']}")`),
});
