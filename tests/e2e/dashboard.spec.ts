import { test } from '@/index';
import { ProductData } from '@/types/products';
import { SortProductsFilter } from '@/data/product-filter';

let productsData: ProductData[];

test('Verify dashboard products',{ tag: '@smoke' },
  async ({ loggedIn, dashboardPage, productDetails, exportAllProducts, verifyAllProducts }) => {
    await loggedIn.verifyDashboard();
    await verifyAllProducts();
    await dashboardPage.countInventory(6);
    productsData = await exportAllProducts();
    for (const [index, product] of productsData.entries()) {
      test.step(`Extract product ${index}: ${product.name}`, async () => {});
    }
    await productDetails.verifyProductDetails(productsData);
  }
);

test.only('Test', async ({ page, loggedIn, dashboardPage, productDetails }) => {
  await loggedIn.verifyDashboard();
  // await page.locator('[data-test="product-sort-container"]').selectOption('za');
  // await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
  await dashboardPage.selectSortFilter(SortProductsFilter.Za);
  await dashboardPage.selectSortFilter(SortProductsFilter.Az);
  await dashboardPage.selectSortFilter(SortProductsFilter.LowToHigh);

  await loggedIn.verifyDashboard();
});
