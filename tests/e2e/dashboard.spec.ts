import { test, expect } from '@/index';
import { loadUsers } from '@/db/exportUsers';
import { extractProducts, verifyAllProducts } from '@/utils/products';

test('First dashboard test', async ({ loggedIn}) => {
  await loggedIn.verifyDashboard();
  await loggedIn.countInventory(6)
  //await loggedIn.verifyAllProducts();
  //const products = await Test.verifyAllProductsDetails();
  await verifyAllProducts(loggedIn.products)
  const products = await extractProducts(loggedIn.products);
  await test.step(`Verifying product number ${products.map(p => p.name)} with name`, async () => {
  })
})