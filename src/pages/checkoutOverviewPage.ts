import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import type { Product } from "../types/product";

export default class CheckoutOverviewPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  //Locators

  readonly getCartItems = () => this.page.getByTestId("inventory-item");
  readonly getTotalPrice = () => this.page.getByTestId("total-label");
  readonly getFinishButton = () => this.page.getByTestId("finish");
  readonly getItemTotal = () => this.page.getByTestId("subtotal-label");
  readonly getTax = () => this.page.getByTestId("tax-label");
  readonly getTotal = () => this.page.getByTestId("total-label");

  //Actions

  public async clickOnFinish() {
    await this.getFinishButton().click();
  }

  public async verifyCheckoutItems(expectedProducts: Product[]) {
    const cartItems = this.getCartItems();

    await expect(cartItems).toHaveCount(expectedProducts.length);

    for (let i = 0; i < expectedProducts.length; i++) {
      const cartItem = cartItems.nth(i);

      await expect(cartItem.getByTestId("item-quantity")).toHaveText(
        expectedProducts[i].quantity.toString(),
      );

      await expect(cartItem.getByTestId("inventory-item-name")).toHaveText(
        expectedProducts[i].name,
      );

      await expect(cartItem.getByTestId("inventory-item-price")).toHaveText(
        expectedProducts[i].price,
      );
    }
  }

  private removeDollarSign(price: string): number {
    return Number(price.replace("$", ""));
  }

  private calculateItemTotal(products: Product[]): number {
    return products.reduce(
      (total, product) => total + this.removeDollarSign(product.price),
      0,
    );
  }

  public async verifyItemTotal(expectedProducts: Product[]): Promise<void> {
    const expectedItemTotal = Number(
      this.calculateItemTotal(expectedProducts).toFixed(2),
    );
    const itemTotalText = await this.getItemTotal().innerText();
    const actualItemTotal = Number(
      this.removeDollarSign(itemTotalText.replace("Item total: ", "")).toFixed(
        2,
      ),
    );

    expect(actualItemTotal).toEqual(expectedItemTotal);
  }

  public async verifyTax(expectedProducts: Product[], taxRate: number) {
    const expectedItemTotal = this.calculateItemTotal(expectedProducts);
    const expectedTax = Number((expectedItemTotal * taxRate).toFixed(2));
    const taxText = await this.getTax().innerText();
    const actualTax = Number(
      this.removeDollarSign(taxText.replace("Tax: ", "")).toFixed(2),
    );
    expect(actualTax).toEqual(expectedTax);
  }

  public async verifyTotal(expectedProducts: Product[], taxRate: number) {
    const expectedItemTotal = this.calculateItemTotal(expectedProducts);
    const expectedTax = Number((expectedItemTotal * taxRate).toFixed(2));
    const expectedTotal = Number((expectedItemTotal + expectedTax).toFixed(2));
    const totalText = await this.getTotal().innerText();
    const actualTotal = Number(
      this.removeDollarSign(totalText.replace("Total: ", "")).toFixed(2),
    );
    expect(actualTotal).toEqual(expectedTotal);
  }
}
