import { test } from '@/index';
import { ProductData } from '@/types/products';

let productsData: ProductData[]

test.only('Verify dashboard products', {tag: '@smoke'}, async ({ loggedIn ,dashboardPage ,productDetails, exportAllProducts, verifyAllProducts}) => {
  await loggedIn.verifyDashboard();
  await verifyAllProducts()
  await dashboardPage.countInventory(6);
  productsData = await exportAllProducts();
  await productDetails.verifyProductDetails(productsData)
});

test('Test', async ({ page, loggedIn, dashboardPage, productDetails}) => {
  await loggedIn.verifyDashboard();
  // await page.locator('[data-test="product-sort-container"]').selectOption('za');
  // await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
  await dashboardPage.selectSortFilter('Price (low to high)')
  await dashboardPage.selectSortFilter('Price (high to low)')

await loggedIn.verifyDashboard();
});

