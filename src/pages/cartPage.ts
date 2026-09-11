import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import type { Product } from "../types/product";

export default class CartPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators

  readonly getCartItems = () => this.page.getByTestId("inventory-item");
  readonly getCheckoutButton = () => this.page.getByTestId("checkout");

  // Actions

  public async verifyCartItemCountNamesAndPrices(expectedProducts: Product[]) {
    const cartItems = this.getCartItems();
    await expect(cartItems).toHaveCount(expectedProducts.length);
    for (let i = 0; i < expectedProducts.length; i++) {
      const cartItem = cartItems.nth(i);
      await expect(cartItem.getByTestId("inventory-item-name")).toHaveText(
        expectedProducts[i].name,
      );
      await expect(cartItem.getByTestId("inventory-item-price")).toHaveText(
        expectedProducts[i].price,
      );
      await expect(cartItem.getByTestId("item-quantity")).toHaveText(
        expectedProducts[i].quantity.toString(),
      );
    }
  }

  public async clickOnCheckout() {
    await this.getCheckoutButton().click();
  }

  public async removeItem(productName: string) {
    const cartItem = this.getCartItems().filter({
      has: this.page.getByTestId("inventory-item-name").filter({
        hasText: productName,
      }),
    });

    await cartItem.getByRole("button", { name: "Remove" }).click();
  }
}
