import { test as baseTest } from "@playwright/test";
import LoginPage from "../pages/loginPage";
import ProductPage from "../pages/productsPage";
import CartPage from "../pages/cartPage";
import CheckoutPage from "../pages/checkoutPage";
import CheckoutOverviewPage from "../pages/checkoutOverviewPage";
import CheckoutCompletePage from "../pages/checkoutCompletePage";

interface PageObjectFixtures {
  loginPage: LoginPage;
  productsPage: ProductPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
  loggedInUser: void;
}

export const test = baseTest.extend<PageObjectFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  productsPage: async ({ page }, use) => {
    const productsPage = new ProductPage(page);
    await use(productsPage);
  },
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },
  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },
  checkoutOverviewPage: async ({ page }, use) => {
    const checkoutOverviewPage = new CheckoutOverviewPage(page);
    await use(checkoutOverviewPage);
  },
  checkoutCompletePage: async ({ page }, use) => {
    const checkoutComplete = new CheckoutCompletePage(page);
    await use(checkoutComplete);
  },
  loggedInUser: async ({ loginPage }, use) => {
    const userName = process.env.USERNAME;
    const password = process.env.PASSWORD;
    if (!userName || !password) {
      throw new Error(
        "Username and Password environment variables must be defined",
      );
    }
    await loginPage.fillLoginForm(userName, password);
    await loginPage.clickLoginButton();
    await use();
  },
});

export { expect } from "@playwright/test";
