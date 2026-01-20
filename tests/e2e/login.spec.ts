import { test, expect } from '@/fixtures/index.ts';
import { Labels } from '@/data/index.ts';
import { loadUsers } from '@/db/export-users.ts';

const { activeUsers, standardUser, lockedUser, nonExistingUser } = loadUsers();
const testText = '1234*/-+Test.,?ABC@[]56789';

activeUsers.forEach((user) => {
  test.describe('Login successfully with all active users', () => {
    test.use({
      username: user.username,
      password: user.password,
    });
    test(`Login successfully to saucedemo with ${user.username}`, async ({ loggedIn }) => {
      await loggedIn.verifyDashboard();
    });
  });
});

test('Successfull login works', { tag: '@smoke' }, async ({ loginPage, dashboardPage }) => {
  await loginPage.openSaucedemoUrl();
  await loginPage.verifyPageHeader();
  await loginPage.verifyLoginPageContent();

  await test.step('Reload login page to verify if all elements reappear correctly', async () => {
    await loginPage.page.reload({ waitUntil: 'networkidle' });
    await loginPage.verifyPageHeader();
    await loginPage.verifyLoginPageContent();
  });

  await loginPage.fillInLoginFields(standardUser.username, standardUser.password);
  await loginPage.loginButton.click();
  await dashboardPage.verifyDashboard();

  await test.step('Reload dashboard to verify if user stay logged in', async () => {
    await loginPage.page.reload({ waitUntil: 'networkidle' });
    await dashboardPage.verifyDashboard();
  });
});

test('Login with missing password or username', async ({ loginPage, loginErrorMsg, dashboardPage }) => {
  await loginPage.openSaucedemoUrl();
  await loginPage.verifyPageHeader();
  await loginPage.verifyLoginPageContent();
  await loginPage.loginButton.click();
  expect.soft(await loginErrorMsg.verifyErrorMessage(Labels.errorMessages['usernameRequired'])).toBe(true);

  await test.step('Login is not possible without password', async () => {
    await loginPage.usernameField.fill(standardUser.username);
    await loginPage.loginButton.click();
    await loginPage.verifyLoginPageContent();
    expect.soft(await loginErrorMsg.verifyErrorMessage(Labels.errorMessages['passwordRequired'])).toBe(true);
    await loginPage.verifyPageHeader();
    await loginPage.verifyLoginPageContent();
  });

  await test.step('Login is not possible without username', async () => {
    await loginPage.usernameField.clear();
    await loginPage.passwordField.fill(standardUser.password);
    await loginPage.loginButton.click();
    await loginPage.verifyLoginPageContent();
    expect.soft(await loginErrorMsg.verifyErrorMessage(Labels.errorMessages['usernameRequired'])).toBe(true);
    await loginPage.verifyPageHeader();
    await loginPage.verifyLoginPageContent();
  });

  await test.step('Successfull login', async () => {
    await loginPage.usernameField.fill(standardUser.username);
    await loginPage.loginButton.click();
    await dashboardPage.verifyDashboard();
  });
});

test('Locked out and non existing user cannot login', async ({ loginPage, loginErrorMsg }) => {
  await loginPage.openSaucedemoUrl();
  await loginPage.verifyPageHeader();
  await loginPage.verifyLoginPageContent();

  await test.step('Locked out user cannot login and correct error is displayed', async () => {
    await loginPage.fillInLoginFields(lockedUser.username, lockedUser.password);
    await loginPage.clickLoginBtnAndVerifyApi();
    expect.soft(await loginErrorMsg.verifyErrorMessage(Labels.errorMessages['lockedOutUser'])).toBe(true);
    await loginPage.verifyPageHeader();
    await loginPage.verifyLoginPageContent();
  });

  await test.step('Try to login without password', async () => {
    await loginPage.usernameField.clear();
    await loginPage.passwordField.clear();
    await loginPage.usernameField.fill(lockedUser.username);
    await loginPage.loginButton.click();
    expect.soft(await loginErrorMsg.verifyErrorMessage(Labels.errorMessages['passwordRequired'])).toBe(true);
  });

  await test.step('Try to login second time with username and password', async () => {
    await loginPage.passwordField.fill(lockedUser.password);
    await loginPage.clickLoginBtnAndVerifyApi();
    expect.soft(await loginErrorMsg.verifyErrorMessage(Labels.errorMessages['lockedOutUser'])).toBe(true);
    await loginPage.verifyPageHeader();
    await loginPage.verifyLoginPageContent();
  });

  await test.step('Non existing user cannot login', async () => {
    await loginPage.usernameField.clear();
    await loginPage.passwordField.clear();
    await loginPage.fillInLoginFields(nonExistingUser.username, nonExistingUser.password);
    await loginPage.clickLoginBtnAndVerifyApi();
    expect.soft(await loginErrorMsg.verifyErrorMessage(Labels.errorMessages['nonExistingUser'])).toBe(true);
    await loginPage.verifyPageHeader();
    await loginPage.verifyLoginPageContent();
  });
});

test('Input special characters to username and password fields', async ({ loginPage }) => {
  await loginPage.openSaucedemoUrl();
  await loginPage.verifyPageHeader();
  await loginPage.verifyLoginPageContent();

  await loginPage.usernameField.fill(testText);
  await expect.soft(loginPage.usernameField).toHaveValue(testText);

  await loginPage.passwordField.fill(testText);
  await expect.soft(loginPage.passwordField).toHaveValue(testText);
});
