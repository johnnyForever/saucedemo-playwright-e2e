import type { Locator } from '@playwright/test';

export const productItem = {
  name: (product: Locator) => product.getByTestId('inventory-item-name'),
  description: (product: Locator) => product.getByTestId('inventory-item-desc'),
  price: (product: Locator) => product.getByTestId('inventory-item-price'),
  image: (product: Locator) => product.locator('img.inventory_item_img'),
};