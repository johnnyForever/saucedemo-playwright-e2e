import type { Page } from '@playwright/test';
import { Labels } from '@/data/index.ts';

export const cartButttons = (page: Page) => ({
  continueBtn: page.getByTestId('continue'),
  checkoutBtn: page.getByRole('button', { name: Labels.shoppingCart['chcekoutButton'] }),
  finishBtn: page.getByRole('button', { name: Labels.shoppingCart['finishButton'] }),
  cancelBtn: page.getByTestId('cancel'),
});