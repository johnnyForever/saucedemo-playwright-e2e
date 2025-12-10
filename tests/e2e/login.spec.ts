import { test, expect } from '@/index';
import elementText from '@/data/textations.json';
import { loadUsers } from '@/db/exportUsers';

const { activeUsers, standardUser, lockedUser, nonExistingUser } = loadUsers();

activeUsers.forEach((user) => {
  test.describe('Login successfully with all active users', () => {
    test.use({
      username: user.username,
      password: user.password,
    });
      test.skip(`Login successfully to saucedemo with ${user.username}`, async ({ loggedIn}) => {
        await loggedIn.verifyDashboard()
    });
  });
});

test.skip('Successfull login works @smoke', async ({loginPage, dashboardPage,}) => {
  await loginPage.openSaucedemoUrl();
  await loginPage.verifyPageHeader();
  await loginPage.verifyLoginPageContent();

  // Reload login page to verify if all elements reappear correctly
  await loginPage.page.reload({ waitUntil: 'networkidle' });
  await loginPage.verifyPageHeader();
  await loginPage.verifyLoginPageContent();
  await loginPage.fillInLoginFields(
    standardUser.username, 
    standardUser.password);
  await loginPage.loginButton.click();
  await dashboardPage.verifyDashboard();

  // Reload dashboard to verify if user stay logged in
  await loginPage.page.reload({ waitUntil: 'networkidle' });
  await dashboardPage.verifyDashboard();
});

test.skip('Login with missing password or username', async ({loginPage, loginErrorMsg, dashboardPage}) => {
  await loginPage.openSaucedemoUrl();
  await loginPage.verifyPageHeader();
  await loginPage.verifyLoginPageContent();
  await loginPage.loginButton.click();
  expect.soft(await loginErrorMsg.verifyErrorMessage(elementText.error_username_required)).toBe(true);

  // Login is not possible without password
  await loginPage.usernameField.fill(standardUser.username);
  await loginPage.loginButton.click();
  await loginPage.verifyLoginPageContent();
  expect.soft(await loginErrorMsg.verifyErrorMessage(elementText.error_password_required)).toBe(true);
  await loginPage.verifyPageHeader();
  await loginPage.verifyLoginPageContent();

  // Login is not possible without username
  await loginPage.usernameField.clear();
  await loginPage.passwordField.fill(standardUser.password);
  await loginPage.loginButton.click();
  await loginPage.verifyLoginPageContent();
  expect.soft(await loginErrorMsg.verifyErrorMessage(elementText.error_username_required)).toBe(true);
  await loginPage.verifyPageHeader();
  await loginPage.verifyLoginPageContent();

  // Successfull login
  await loginPage.usernameField.fill(standardUser.username);
  await loginPage.loginButton.click();
  await dashboardPage.verifyDashboard();
});

test.skip('Locked out and non existing user cannot login', async ({loginPage, loginErrorMsg}) => {
  await loginPage.openSaucedemoUrl();
  await loginPage.verifyPageHeader();
  await loginPage.verifyLoginPageContent();

  // Locked out user cannot login and correct error is displayed
  await loginPage.fillInLoginFields(
    lockedUser.username,
    lockedUser.password);
  await loginPage.clickLoginBtnAndVerifyApi();
  expect.soft(await loginErrorMsg.verifyErrorMessage(elementText.error_locked_out_user)).toBe(true);
  await loginPage.verifyPageHeader();
  await loginPage.verifyLoginPageContent();

  // Try to login without password
  await loginPage.usernameField.clear();
  await loginPage.passwordField.clear();
  await loginPage.usernameField.fill(lockedUser.username);
  await loginPage.loginButton.click();
  expect.soft(await loginErrorMsg.verifyErrorMessage(elementText.error_password_required)).toBe(true);

  // Try to login second time with username and password
  await loginPage.passwordField.fill(lockedUser.password);
  await loginPage.clickLoginBtnAndVerifyApi();
  expect.soft(await loginErrorMsg.verifyErrorMessage(elementText.error_locked_out_user)).toBe(true);
  await loginPage.verifyPageHeader();
  await loginPage.verifyLoginPageContent();

  // Non existing user cannot login
  await loginPage.usernameField.clear();
  await loginPage.passwordField.clear();
  await loginPage.fillInLoginFields(
    nonExistingUser.username,
    nonExistingUser.password);
  await loginPage.clickLoginBtnAndVerifyApi();
  expect.soft(await loginErrorMsg.verifyErrorMessage(elementText.error_non_existing_user)).toBe(true);
  await loginPage.verifyPageHeader();
  await loginPage.verifyLoginPageContent();
});

test.skip('Input special characters to username and password fields', async ({loginPage}) => {
  let testText = '1234*/-+Test.,?';
  
  await loginPage.openSaucedemoUrl();
  await loginPage.verifyPageHeader();
  await loginPage.verifyLoginPageContent();

  await loginPage.usernameField.fill(testText);
  await expect.soft(loginPage.usernameField).toHaveValue(testText);

  await loginPage.passwordField.fill(testText);
  await expect.soft(loginPage.passwordField).toHaveValue(testText);
});
