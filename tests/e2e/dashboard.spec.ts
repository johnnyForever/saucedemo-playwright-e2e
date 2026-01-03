import { test, expect } from '@/index.ts';
import { ProductData } from '@/types/products.ts';
import { SortProductsFilter } from '@/data/product-filter.ts';
import { sortProductData } from '@/utils/sort-products.ts';
import { Labels } from '@/data/labels.ts';

test(
  'Compare dashboard products with products details',
  { tag: '@smoke' },
  async ({ loggedIn, dashboardPage, productsData, verifyDashboardItems, verifyProductDetail }) => {
    await loggedIn.verifyDashboard();
    await verifyDashboardItems();
    await dashboardPage.countInventory(6);
    expect(productsData).toHaveLength(6);

    // Compare data of each product from dashboard to what is displayed in detail
    await verifyProductDetail(productsData);
  }
);

test('Sorting of dashboard products with filter', async ({ loggedIn, dashboardPage, productsData }) => {
  await loggedIn.verifyDashboard();
  await dashboardPage.countInventory(6);
  expect(productsData).toHaveLength(6);

  let defaultData: ProductData[] = productsData;

  await dashboardPage.verifyProductsSorting(defaultData);

  await dashboardPage.selectSortFilter(SortProductsFilter.za);
  defaultData = await sortProductData(SortProductsFilter.za, defaultData);
  await dashboardPage.verifyProductsSorting(defaultData);

  await dashboardPage.selectSortFilter(SortProductsFilter.az);
  defaultData = await sortProductData(SortProductsFilter.az, defaultData);
  await dashboardPage.verifyProductsSorting(defaultData);

  await dashboardPage.selectSortFilter(SortProductsFilter.highToLow);
  defaultData = await sortProductData(SortProductsFilter.highToLow, defaultData);
  await dashboardPage.verifyProductsSorting(defaultData);

  await dashboardPage.selectSortFilter(SortProductsFilter.lowToHigh);
  defaultData = await sortProductData(SortProductsFilter.lowToHigh, defaultData);
  await dashboardPage.verifyProductsSorting(defaultData);

  await dashboardPage.selectSortFilter(SortProductsFilter.az);
  defaultData = await sortProductData(SortProductsFilter.az, defaultData);
  await dashboardPage.verifyProductsSorting(defaultData);

  await dashboardPage.selectSortFilter(SortProductsFilter.highToLow);
  defaultData = await sortProductData(SortProductsFilter.highToLow, defaultData);
  await dashboardPage.verifyProductsSorting(defaultData);

  await dashboardPage.selectSortFilter(SortProductsFilter.az);
  defaultData = await sortProductData(SortProductsFilter.az, defaultData);
  await dashboardPage.verifyProductsSorting(defaultData);
});

test.only('Inventory sidebar buttons', async ({ loggedIn, dashboardPage, verifyDashboardItems }) => {
  await loggedIn.verifyDashboard();
  await dashboardPage.clickSidebarBtnAndVerify();

  const products = await dashboardPage.getAllProductItems();
  for (const product of products) {
    await product.name.click();
    await dashboardPage.clickSidebarBtnAndVerify();
    await dashboardPage.sidebarBurgerItems.filter({ hasText: Labels.sidebarElLabels['allItems'] }).click();
    await verifyDashboardItems();
  }
});
