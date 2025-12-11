import type { Page, Locator } from '@playwright/test';
import { expect, test } from '@playwright/test';
import elementText from '@/data/textations.json';
import { ProductData } from '@/types/products';
import { productDashboardItem } from '@/locators/product-locators';

export class DashboardPage {
  readonly page: Page;
  readonly title: Locator;
  readonly shoppingCart: Locator;
  readonly productsComponent: Locator;
  readonly addToCartBtn: Locator;
  readonly products: Locator

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.app_logo');
    this.shoppingCart = page.locator('#shopping_cart_container');
    this.productsComponent = page.getByText(elementText.products_title);
    this.addToCartBtn = page.getByRole('button', { name: /add to cart/i });
    this.products = productDashboardItem.product(page);
  }

  async verifyDashboard() {
    await expect(this.title).toHaveText(elementText.page_header);
    await expect(this.shoppingCart).toBeVisible();
    await expect(this.productsComponent).toBeVisible();
    await expect(this.page).toHaveURL(process.env.DASHBOARD_URL!);
  }

  async verifyAllProducts(): Promise<void> {
    const count = await this.products.count();
    for (let i = 0; i < count; i++) {
      const product = this.products.nth(i);
      const name = await productDashboardItem.name(product).innerText();
      const desc = await productDashboardItem.description(product).innerText();
      const priceText = await productDashboardItem.price(product).innerText();
      const imgSrc = await productDashboardItem.image(product).getAttribute('src');

      expect.soft(name.trim()).toBeTruthy();
      expect.soft(name.trim().length).toBeGreaterThan(10);
      expect.soft(desc.trim().length).toBeGreaterThan(15);
      expect.soft(imgSrc).toContain(process.env.DASHBOARD_PICTURE_URL);
      expect.soft(priceText).toMatch(/^\$\d+\.\d{2}$/);
    }
  }

  async extractAllProducts(): Promise<ProductData[]> {
    const productLocators = await this.products.all();
    return Promise.all(
      productLocators.map(async (product:Locator) => {
        const name = await productDashboardItem.name(product).innerText();
        const desc = await productDashboardItem.description(product).innerText();
        const price = await productDashboardItem.price(product).innerText();
        const img = await productDashboardItem.image(product).getAttribute('src');

        await test.step(`Extracting product:
          name: ${name}
          description: ${desc}
          price: ${price}
          image found: ${img}`, async () => {});

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
  
  async countInventory(expected: number) {
    return await expect.soft(this.products).toHaveCount(expected);
  }
}
