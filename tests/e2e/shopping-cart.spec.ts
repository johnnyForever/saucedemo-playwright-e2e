import { test, expect } from '@/fixtures/index.ts';
import { Labels } from '@/data/index.ts';

const userData = {firstName: 'John', lastName: 'Doe', zipCode: '000 00'}

test.only('Succesfully finish shopping with full basket', { tag: '@smoke' }, async ({
  loggedIn,
  dashboardPage,
  shoppingCart,
  verifyShoppingCart,
  verifyProductDetail,
  productsData
}) => {
  await loggedIn.verifyDashboard();
  const products = await dashboardPage.getAllProductItems();
  expect(productsData).toHaveLength(6);

  for (const product of products) {
    await product.addToCartBtn.click();
  }
  await verifyShoppingCart(6);
  await dashboardPage.clickShoppingBasket();
  await shoppingCart.assertCartTittle(Labels.shoppingCart['yourCartTitle']);
  await shoppingCart.countItemsInCart(6);
  await verifyProductDetail(productsData);
  await verifyShoppingCart(6);

  await shoppingCart.checkoutButton.click();
  await shoppingCart.assertCartTittle(Labels.shoppingCart['checkoutTitle']);
  await verifyShoppingCart(6);
  await shoppingCart.fillInCheckout(userData.firstName, userData.lastName, userData.zipCode);
  await shoppingCart.continueBtn.click();

  await verifyShoppingCart(6);
  await shoppingCart.countItemsInCart(6);
  await shoppingCart.assertCartTittle(Labels.shoppingCart['overviewTitle']);
  await shoppingCart.finishButton.click();
  await shoppingCart.verifyCompleteOrderPage();
});
