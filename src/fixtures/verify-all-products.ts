import { test as base, expect } from '@playwright/test';
import { productDashboardItem } from '@/locators/product-locators';;
import { DashboardPage } from '@/pages/dashboard';

type VerifyProductsFixture = {
  verifyAllProducts: () => Promise<void>;
};

export const test = base.extend<VerifyProductsFixture>({
  verifyAllProducts: async ({ page }, use) => {
    const dashboard = new DashboardPage(page);
    const verify = async () => {
      const count = await dashboard.products.count();
      for (let i = 0; i < count; i++) {
        
        const product = dashboard.products.nth(i);
        const name = await productDashboardItem.name(product).innerText();
        const desc = await productDashboardItem.description(product).innerText();
        const priceText = await productDashboardItem.price(product).innerText();
        const imgSrc = await productDashboardItem.image(product).getAttribute('src');
        const addBtnVisible = await productDashboardItem.addToCart(product).isVisible();

        expect.soft(name.trim()).toBeTruthy();
        expect.soft(name.trim().length).toBeGreaterThan(10);
        expect.soft(desc.trim().length).toBeGreaterThan(15);
        expect.soft(imgSrc).toContain(process.env.DASHBOARD_PICTURE_URL!);
        expect.soft(priceText).toMatch(/^\$\d+\.\d{2}$/);
        expect.soft(addBtnVisible).toBe(true);
      }
    };
    await use(verify);
  },
});