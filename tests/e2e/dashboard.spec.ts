import { test } from '@/index.ts';
import { ProductData } from '@/types/products.ts';
import { SortProductsFilter } from '@/data/product-filter.ts';
import { sortProductData } from '@/utils/sort-products.ts';

test('Verify dashboard products with products detail',{ tag: '@smoke' }, async ({ 
    loggedIn, dashboardPage, productDetails, exportAllProducts, verifyAllProducts }) => {
  await loggedIn.verifyDashboard();
  await verifyAllProducts();
  await dashboardPage.countInventory(6);

  // Export data of each product on main dashboard
  const productsData: ProductData[] = await exportAllProducts();
  for (const [index, product] of productsData.entries()) {
    test.step(`Extracted product number ${index + 1}: 
      name: ${product.name},
      description: ${product.description},
      price: ${product.price}`, async () => {});
  }

  // Compare data of each product from dashboard to what is displayed in detail
  await productDetails.verifyProductDetails(productsData);
  }
);

test.only('Sorting of dashboard products with filter', async ({ 
    loggedIn, dashboardPage, exportAllProducts}) => {
  await loggedIn.verifyDashboard();
  let defaultData: ProductData[] = await exportAllProducts();

  await dashboardPage.selectSortFilter(SortProductsFilter.Za);
  defaultData = sortProductData(SortProductsFilter.Za, defaultData)
  await dashboardPage.verifyProductsSorting(defaultData);

  await dashboardPage.selectSortFilter(SortProductsFilter.Az);
  defaultData = sortProductData(SortProductsFilter.Az, defaultData)
  await dashboardPage.verifyProductsSorting(defaultData);

  await dashboardPage.selectSortFilter(SortProductsFilter.HighToLow);
  defaultData = sortProductData(SortProductsFilter.HighToLow, defaultData)
  await dashboardPage.verifyProductsSorting(defaultData);

  await dashboardPage.selectSortFilter(SortProductsFilter.LowToHigh);
  defaultData = sortProductData(SortProductsFilter.LowToHigh, defaultData)
  await dashboardPage.verifyProductsSorting(defaultData);

  await dashboardPage.selectSortFilter(SortProductsFilter.Az);
  defaultData = sortProductData(SortProductsFilter.Az, defaultData)
  await dashboardPage.verifyProductsSorting(defaultData);

  await dashboardPage.selectSortFilter(SortProductsFilter.HighToLow);
  defaultData = sortProductData(SortProductsFilter.HighToLow, defaultData)
  await dashboardPage.verifyProductsSorting(defaultData);

  await dashboardPage.selectSortFilter(SortProductsFilter.Az);
  defaultData = sortProductData(SortProductsFilter.Az, defaultData)
  await dashboardPage.verifyProductsSorting(defaultData);
});
