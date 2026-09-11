import { expect, test } from "../../src/fixtures/uiTestFixtures";
import { checkoutInformation } from "../../src/test-data/user";
import type { Product } from "../../src/types/product";

test.describe("Shopping", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test(
    "User should be able to purchase items from the cart",
    { tag: "@purchase" },
    async ({
      loggedInUser,
      productsPage,
      cartPage,
      checkoutPage,
      checkoutOverviewPage,
      checkoutCompletePage,
    }) => {
      const taxRate: number = 0.08;
      const numberOfPurchasedItems: number = 4;
      const selectedProducts: Product[] = await productsPage.addProductsToCart(
        numberOfPurchasedItems,
      );
      await productsPage.verifyCartItemCount(numberOfPurchasedItems);
      await productsPage.verifyProductsShowRemoveButton(numberOfPurchasedItems);
      await productsPage.clickOnCartIcon();
      await cartPage.verifyCartItemCountNamesAndPrices(selectedProducts);
      await cartPage.clickOnCheckout();
      await checkoutPage.fillCheckoutForm(
        checkoutInformation.firstName,
        checkoutInformation.lastName,
        checkoutInformation.postalCode,
      );
      checkoutPage.clickOnContinue();
      await checkoutOverviewPage.verifyItemTotal(selectedProducts);
      await checkoutOverviewPage.verifyTax(selectedProducts, taxRate);
      await checkoutOverviewPage.verifyTotal(selectedProducts, taxRate);
      await checkoutOverviewPage.clickOnFinish();
      await expect(checkoutCompletePage.getCompleteHeader()).toHaveText(
        checkoutCompletePage.orderConfirmation.header,
      );
      await expect(checkoutCompletePage.getCompleteText()).toHaveText(
        checkoutCompletePage.orderConfirmation.message,
      );
    },
  );

  test(
    "User should be able to remove an item from the cart",
    { tag: "@cart" },
    async ({ loggedInUser, productsPage, cartPage }) => {
      const numberOfProducts: number = 3;
      const selectedProducts: Product[] =
        await productsPage.addProductsToCart(numberOfProducts);
      await productsPage.verifyCartItemCount(numberOfProducts);
      await productsPage.clickOnCartIcon();
      await cartPage.verifyCartItemCountNamesAndPrices(selectedProducts);
      const productToRemove = selectedProducts[0];
      await cartPage.removeItem(productToRemove.name);
      const remainingProducts = selectedProducts.slice(1);
      await cartPage.verifyCartItemCountNamesAndPrices(remainingProducts);
      await productsPage.verifyCartItemCount(remainingProducts.length);
    },
  );

  test(
    "User should be able to sort products",
    { tag: "@sorting" },
    async ({ loggedInUser, productsPage }) => {
      const products = await productsPage.getDisplayedProducts();
      // A to Z - name
      await productsPage.selectSortingOption("az");
      const actualAZ = await productsPage.getDisplayedProducts();
      const expectedAZ = [...products].sort((a, b) =>
        a.name.localeCompare(b.name, "en-US"),
      );
      expect(actualAZ).toEqual(expectedAZ);
      // Z to A - name
      await productsPage.selectSortingOption("za");
      const actualZA = await productsPage.getDisplayedProducts();
      const expectedZA = [...products].sort((a, b) =>
        b.name.localeCompare(a.name, "en-US"),
      );
      expect(actualZA).toEqual(expectedZA);
      // low to high - price
      await productsPage.selectSortingOption("lohi");
      const actualLowToHigh = await productsPage.getDisplayedProducts();
      const expectedLowToHigh = [...products].sort(
        (a, b) =>
          Number(a.price.replace("$", "")) - Number(b.price.replace("$", "")),
      );
      expect(actualLowToHigh).toEqual(expectedLowToHigh);
      // Price high to low
      await productsPage.selectSortingOption("hilo");
      const actualHighToLow = await productsPage.getDisplayedProducts();
      const expectedHighToLow = [...products].sort(
        (a, b) =>
          Number(b.price.replace("$", "")) - Number(a.price.replace("$", "")),
      );
      expect(actualHighToLow).toEqual(expectedHighToLow);
    },
  );
});
