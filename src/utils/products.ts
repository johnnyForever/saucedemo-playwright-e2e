import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { ProductData } from '@/types/products';
import { productItem } from '@/locators/productLocators';

export async function extractProducts(products: Locator): Promise<ProductData[]> {
  const productLocators = await products.all();

  return Promise.all(
    productLocators.map(async (product) => {
      const name = await productItem.name(product).innerText();
      const desc = await productItem.description(product).innerText();
      const price = await productItem.price(product).innerText();
      const img = await productItem.image(product).getAttribute('src');

      return {
        name: name.trim(),
        description: desc.trim(),
        price: price.trim(),
        priceValue: parseFloat(price.replace('$', '')),
        imageSrc: img || '',
      };
    })
  );
}

export async function verifyAllProducts(products: Locator): Promise<void> {
  const count = await products.count();
  for (let i = 0; i < count; i++) {
    const product = products.nth(i);
    const name = await productItem.name(product).innerText();
    const desc = await productItem.description(product).innerText();
    const priceText = await productItem.price(product).innerText();
    const imgSrc = await productItem.image(product).getAttribute('src');

    expect.soft(name.trim()).toBeTruthy();
    expect.soft(name.trim().length).toBeGreaterThan(10);
    expect.soft(desc.trim().length).toBeGreaterThan(15);
    expect.soft(imgSrc).toContain(process.env.DASHBOARD_PICTURE_URL);
    expect.soft(priceText).toMatch(/^\$\d+\.\d{2}$/);
    }
}