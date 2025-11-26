import { test, expect } from './fixtures/login.fixture';

test('Fill in credentials on login page and click login', async ({ loginPageWithCredentials }) => {
  await loginPageWithCredentials('standard_user', 'secret_sauce', 'https://www.saucedemo.com/inventory.html');
});
