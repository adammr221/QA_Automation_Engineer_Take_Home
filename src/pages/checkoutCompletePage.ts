import type { Page } from "@playwright/test";

export default class CheckoutCompletePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  readonly orderConfirmation = {
    header: "Thank you for your order!",
    message:
      "Your order has been dispatched, and will arrive just as fast as the pony can get there!",
  };

  //Locators
  readonly getCompleteHeader = () => this.page.getByTestId("complete-header");
  readonly getCompleteText = () => this.page.getByTestId("complete-text");
}
