import { test } from '@/index';
import { ProductData } from '@/types/products';

let productsData: ProductData[]

test('Verify dashboard products', async ({ loggedIn, dashboardPage, productDetails}) => {
  await loggedIn.verifyDashboard();
  await dashboardPage.verifyAllProducts()
  await dashboardPage.countInventory(6);
  productsData = await dashboardPage.extractAllProducts();
  await productDetails.verifyProductDetails(productsData)
});
