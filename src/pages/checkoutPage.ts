import type { Page } from "@playwright/test";

export default class CheckoutPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  //Locators
  readonly getFirstNameTextBox = () => this.page.getByTestId("firstName");
  readonly getLastNameTextBox = () => this.page.getByTestId("lastName");
  readonly getPostalCodeTextBox = () => this.page.getByTestId("postalCode");
  readonly getContinueButton = () => this.page.getByTestId("continue");

  //Actions
  public async fillCheckoutForm(
    firstName: string,
    lastName: string,
    postalCode: string,
  ) {
    await this.getFirstNameTextBox().fill(firstName);
    await this.getLastNameTextBox().fill(lastName);
    await this.getPostalCodeTextBox().fill(postalCode);
  }

  public async clickOnContinue() {
    await this.getContinueButton().click();
  }
}
