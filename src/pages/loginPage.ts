import type { Page } from "@playwright/test";

export default class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  //Locators
  readonly getUserNameTextBox = () => this.page.getByTestId("username");
  readonly getPasswordTextBox = () => this.page.getByTestId("password");
  readonly getLoginButton = () => this.page.getByTestId("login-button");

  //Actions
  public async fillLoginForm(userName: string, password: string) {
    await this.getUserNameTextBox().fill(userName);
    await this.getPasswordTextBox().fill(password);
  }

  public async clickLoginButton() {
    await this.getLoginButton().click();
  }
}
