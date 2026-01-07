import { expect, type Page, type Locator } from '@playwright/test';
import { component, checkoutCredentials, completeOrder } from '@/locators/index.ts';
import { Labels, Colors } from '@/data/index.ts';
import { hexToRgb } from '@/utils/index.ts';

export class ShoppingCart {
  readonly page: Page;
  readonly cartTittle: Locator;
  readonly productsItems: Locator;
  readonly continueBtn: Locator;
  readonly orderCompleted: { header: Locator; fullText: Locator; goHomeButton: Locator };
  readonly finishButton: Locator;
  readonly checkoutButton: Locator;
  readonly userData: { firstName: Locator; lastName: Locator; zipCode: Locator; };

  constructor(page: Page) {
    this.page = page;
    this.cartTittle = this.page.getByTestId('title');
    this.productsItems = this.page.locator(component.inventoryItem);
    this.continueBtn = this.page.getByTestId('continue');
    this.orderCompleted = completeOrder(this.page);
    this.checkoutButton = this.page.getByRole('button', { name: Labels.shoppingCart['chcekoutButton'] });
    this.finishButton = this.page.getByRole('button', { name: Labels.shoppingCart['finishButton'] });
    this.userData = checkoutCredentials(this.page);
  }

  async assertCartTittle(title: string) {
    await expect(this.cartTittle).toBeVisible();
    await expect(this.cartTittle).toHaveText(`${title}`);
  }

  async countItemsInCart(expected: number) {
    return await expect.soft(this.productsItems).toHaveCount(expected);
  }

  async fillInCheckout(firstName: string = '', lastName: string = '', zipCode: string = ''): Promise<void> {
    if (firstName !== '') {
      await this.userData.firstName.fill(firstName);
    }
    if (lastName !== '') {
      await this.userData.lastName.fill(lastName);
    }
    if (zipCode !== '') {
      await this.userData.zipCode.fill(zipCode);
    }
    expect(this.userData.firstName).toHaveValue(firstName);
    expect(this.userData.lastName).toHaveValue(lastName);
    expect(this.userData.zipCode).toHaveValue(zipCode);
  }

  async verifyCompleteOrderPage() {
    await this.assertCartTittle(Labels.shoppingCart['orderCompleteTitle']);
    await expect.soft(this.orderCompleted.header).toHaveText(Labels.shoppingCart['completeOrder']);
    await expect.soft(this.orderCompleted.fullText).toHaveText(Labels.shoppingCart['completeOrderFullText']);
    await expect.soft(this.orderCompleted.goHomeButton).toBeVisible();
    await expect.soft(this.orderCompleted.goHomeButton).toHaveCSS('background-color', hexToRgb(Colors.eucalyptus));
  }

  async verifyYourCart() {
  }
}
