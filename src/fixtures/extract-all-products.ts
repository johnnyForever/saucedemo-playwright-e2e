// fixtures/export-products.fixtures.ts
import { test as base, type Locator } from '@playwright/test';
import { productDashboardItem } from '@/locators/product-locators';
import { DashboardPage } from '@/pages/dashboard';
import { ProductData } from '@/types/products';

type ExportProductsFixture = {
  exportAllProducts: () => Promise<ProductData[]>;
};

export const test = base.extend<ExportProductsFixture>({
  exportAllProducts: async ({ page }, use) => {
    const dashboard = new DashboardPage(page);

    const exportProducts = async (): Promise<ProductData[]> => {
      const productElements = await dashboard.products.all(); 

      const products = await Promise.all(
        productElements.map(async (product: Locator, index) => {
          const name = await productDashboardItem.name(product).innerText();
          return await test.step(`Extract product ${index + 1}: ${name}`, async () => {
            const desc = await productDashboardItem.description(product).innerText();
            const priceText = await productDashboardItem.price(product).innerText();
            const imgSrc = (await productDashboardItem.image(product).getAttribute('src')) || '';

            return {
              name: name.trim(),
              description: desc.trim(),
              price: priceText.trim(),
              priceValue: parseFloat(priceText.replace('$', '')),
              imageSrc: imgSrc,
            };
          });
        })
      );
      return products;
    };
    await use(exportProducts);
  },
});