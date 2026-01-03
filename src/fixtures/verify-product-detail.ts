import { test as base, expect } from '@playwright/test';
import { ProductDetailPage } from '@/pages/products-detail.ts';
import { ProductData } from '@/types/products.ts';
import { DashboardPage } from '@/pages/dashboard.ts';

type VerifyProductDetailFixture = {
  verifyProductDetail: (expectedProducts: ProductData[]) => Promise<void>;
};

export const test = base.extend<VerifyProductDetailFixture>({
  verifyProductDetail: async ({ page }, use) => {
    await use(async (expectedProducts: ProductData[]) => {
      const dashboardPage = new DashboardPage(page);
      const productDetailPage = new ProductDetailPage(page);

      const count = await dashboardPage.productsItems.count();
      for (let i = 0; i < count; i++) {
        const productItem = dashboardPage.getProductItem(i);
        const expectedData = expectedProducts[i];
        await productItem.name.click();

        // On product detail
        const detail = await productDetailPage.productDetailData();
        expect.soft(detail.name).toBe(expectedData.name);
        expect.soft(detail.description).toBe(expectedData.description);
        expect.soft(detail.price).toBe(expectedData.price);
        expect.soft(detail.addToCart).toBe(true);
        await productDetailPage.goBackFromItemDetail();

        // On dashboard page
        await expect(dashboardPage.title).toBeVisible();
      }
    });
  },
});
