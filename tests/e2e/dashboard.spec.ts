import { test, expect } from '@/index.ts';
import { ProductData } from '@/types/products.ts';
import { SortProductsFilter } from '@/data/product-filter.ts';
import { sortProductData } from '@/utils/sort-products.ts';
import { loadUsers } from '@/db/export-users.ts';
import { Labels } from '@/data/labels.ts';

const numOfProducts = 6;
const { standardUser } = loadUsers();

test(
  'Compare dashboard products with products details',
  { tag: '@smoke' },
  async ({ loggedIn, dashboardPage, productsData, verifyDashboardItems, verifyProductDetail }) => {
    await loggedIn.verifyDashboard();
    await verifyDashboardItems();
    await dashboardPage.countInventory(numOfProducts);
    expect(productsData).toHaveLength(numOfProducts);

    // Compare data of each product from dashboard to what is displayed in detail
    await verifyProductDetail(productsData);
  }
);

test('Sorting of dashboard products with filter', async ({ loggedIn, dashboardPage, productsData }) => {
  await loggedIn.verifyDashboard();
  await dashboardPage.countInventory(numOfProducts);
  expect(productsData).toHaveLength(numOfProducts);

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

test('Inventory sidebar buttons & items in basket icon', async ({ loggedIn, dashboardPage, verifyDashboardItems }) => {
  await loggedIn.verifyDashboard();
  await dashboardPage.sidebar.clickSidebarBtnAndVerify();
  const products = await dashboardPage.getAllProductItems();

  for (const product of products) {
    await product.name.click();
    await dashboardPage.sidebar.clickSidebarBtnAndVerify();
    await dashboardPage.sidebar.clickAllItemsBtn();
    await verifyDashboardItems();
  }

  await dashboardPage.sidebar.clickSidebarBtnAndVerify();

  for (const product of products) {
    await product.addToCart.click();
    await dashboardPage.verifyShoppingBasket(1);
    await dashboardPage.sidebar.clickResetAppBtn();
    await dashboardPage.verifyShoppingBasket(0);
  }

  // Refresh dashboard to have add to cart buttons visible in default state
  await dashboardPage.page.reload({ waitUntil: 'networkidle' });
  await dashboardPage.sidebar.clickSidebarBtnAndVerify();

  for (let i = 0; i < numOfProducts; i++) {
    await products[i].addToCart.click();
    await dashboardPage.verifyShoppingBasket(i + 1);
  }
  await dashboardPage.sidebar.clickResetAppBtn();
  await dashboardPage.verifyShoppingBasket(0);
});

test.only('Logout using sidebar logout button', async ({ loggedIn, loginPage, dashboardPage }) => {
  await loggedIn.verifyDashboard();

  const products = await dashboardPage.getAllProductItems();
  for (let i = 0; i < numOfProducts; i++) {
    await products[i].addToCart.click();
    await dashboardPage.verifyShoppingBasket(i + 1);
  }

  await dashboardPage.sidebar.clickSidebarBtnAndVerify();
  await dashboardPage.sidebar.clickLogoutBtn();

  await loginPage.verifyPageHeader();
  await loginPage.verifyLoginPageContent();

  await loginPage.fillInLoginFields(standardUser.username, standardUser.password);
  await loginPage.loginButton.click();
  await dashboardPage.verifyDashboard();

  // Basket stay full after logout/login
  await dashboardPage.verifyShoppingBasket(6);

  await dashboardPage.sidebar.clickSidebarBtnAndVerify();
  await dashboardPage.sidebar.clickResetAppBtn();
  await dashboardPage.verifyShoppingBasket(0);

  await dashboardPage.sidebar.clickLogoutBtn();
  await loginPage.verifyPageHeader();
  await loginPage.verifyLoginPageContent();
});
