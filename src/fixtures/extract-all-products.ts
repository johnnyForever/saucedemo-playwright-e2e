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
        productElements.map(async (product: Locator) => {
          const name = await productDashboardItem.name(product).innerText();
          const description = await productDashboardItem.description(product).innerText();
          const priceText = await productDashboardItem.price(product).innerText();
          const imageSrc = (await productDashboardItem.image(product).getAttribute('src')) || '';

          return {
            name: name.trim(),
            description: description.trim(),
            price: priceText.trim(),
            priceValue: parseFloat(priceText.replace('$', '')),
            imageSrc,
          } as ProductData;
        })
      );
      return products;
    };
    await use(exportProducts);
  },
});