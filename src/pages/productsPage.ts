import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import type { Product } from "../types/product";

export default class ProductPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  //Locators

  readonly getProductItems = () => this.page.getByTestId("inventory-item");
  readonly getShoppingCartBadge = () =>
    this.page.getByTestId("shopping-cart-badge");
  readonly getShoppingCart = () => this.page.getByTestId("shopping-cart-link");
  readonly getSortDropdown = () =>
    this.page.getByTestId("product-sort-container");

  // Actions

  public async addProductsToCart(numberOfProducts: number) {
    const products = this.getProductItems();
    await expect(products.first()).toBeVisible();
    const count = await products.count();
    const selectedProducts = [];
    if (count < numberOfProducts) {
      throw new Error(
        `Expected at least ${numberOfProducts} products, but found ${count}`,
      );
    }
    for (let i = 0; i < numberOfProducts; i++) {
      const product = products.nth(i);
      const name = await product.getByTestId("inventory-item-name").innerText();
      const price = await product
        .getByTestId("inventory-item-price")
        .innerText();
      // click on nth item
      await product.getByRole("button", { name: "Add to cart" }).click();
      // add name and price to selectedProducts array.
      selectedProducts.push({
        name,
        price,
        quantity: 1,
      }); //Schema: {name: string, price: string, quantity: 1}
    }
    return selectedProducts;
  }

  public async verifyCartItemCount(expectedCount: number) {
    await expect(this.getShoppingCartBadge()).toHaveText(
      expectedCount.toString(),
    );
  }

  public async verifyProductsShowRemoveButton(numberOfProducts: number) {
    const products = this.getProductItems();
    for (let i = 0; i < numberOfProducts; i++) {
      await expect(
        products.nth(i).getByRole("button", { name: "Remove" }),
      ).toBeVisible();
    }
  }

  public async clickOnCartIcon() {
    await this.getShoppingCart().click();
  }

  public async selectSortingOption(sortOption: "az" | "za" | "lohi" | "hilo") {
    await this.getSortDropdown().selectOption(sortOption);
  }

  public async getDisplayedProducts() {
    const products = this.getProductItems();
    await expect(products.first()).toBeVisible();
    const displayedProducts: Product[] = [];
    for (let i = 0; i < (await products.count()); i++) {
      const product = products.nth(i);
      const name = await product.getByTestId("inventory-item-name").innerText();
      const price = await product
        .getByTestId("inventory-item-price")
        .innerText();
      displayedProducts.push({
        name,
        price,
        quantity: 1,
      });
    }

    return displayedProducts;
  }
}
