import type { Page } from '@playwright/test';
import { productDetail } from '@/locators/product-locators.ts';

export class ProductDetailPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goBackFromItemDetail() {
    await this.page.goBack();
  }

  async productDetailData() {
    const detailData = productDetail(this.page);
    return {
      name: await detailData.name.innerText(),
      description: await detailData.description.innerText(),
      price: await detailData.price.innerText(),
      addToCart: await detailData.addToCart.isVisible(),
    };
  }
}
