import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { ProductData } from '@/types/products';
import { productDashboardItem, productDetailItem } from '@/locators/product-locators';

export class ProductDetails {
  readonly page: Page;
  private readonly products: Locator

  constructor(page: Page) {
    this.page = page;
    this.products = productDashboardItem.product(page);
  }

  async verifyProductDetails(productData: ProductData[]): Promise<void> {
    const count = await this.products.count();
    for (let i = 0; i < count; i++) {
      const product = this.products.nth(i);
      await productDashboardItem.name(product).click();

      const nameRecieved = await productDetailItem.name(this.page);
      const descRecieved = await productDetailItem.description(this.page);
      const priceRecieved = await productDetailItem.price(this.page);

      await expect.soft(nameRecieved).toHaveText(productData[i].name);
      await expect.soft(descRecieved).toHaveText(productData[i].description);
      await expect.soft(priceRecieved).toHaveText(productData[i].price);

      await this.page.goBack();
    }
  }
}
