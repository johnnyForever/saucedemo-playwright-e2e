import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { ProductData } from '@/types/products';
import { productDashboardItem, productDetailItem } from '@/locators/product-locators';

export class ProductDetails {
  readonly page: Page;
  readonly products: Locator
  readonly productDetail: Locator

  constructor(page: Page) {
    this.page = page;
    this.products = productDashboardItem.productItem(page);
    this.productDetail = productDetailItem.productDetail(page);
  }

  async verifyProductDetails(productData: ProductData[]): Promise<void> {
    const count = await this.products.count();
    for (let i = 0; i < count; i++) {
      const product = await this.products.nth(i);
      await productDashboardItem.name(product).click();

      const nameRecieved = await productDetailItem.name(this.productDetail);
      const descRecieved = await productDetailItem.description(this.productDetail);
      const priceRecieved = await productDetailItem.price(this.productDetail);
      const addBtn = await productDetailItem.addToCart(this.productDetail).isVisible();

      await expect.soft(nameRecieved).toHaveText(productData[i].name);
      await expect.soft(descRecieved).toHaveText(productData[i].description);
      await expect.soft(priceRecieved).toHaveText(productData[i].price);
      expect.soft(addBtn).toBe(true);
      await this.page.goBack();
    }
  }
}
