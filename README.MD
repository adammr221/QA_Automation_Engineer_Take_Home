# Playwright Test Automation

## Installation

Install the project dependencies:

    npm install

## Run Tests Locally

To run the tests in the production environment, create the following file:

    env/.env.prod

with the following content:

    UI_BASE_URL=https://www.saucedemo.com/

    USERNAME=username
    PASSWORD=password

Then run the complete test suite:

    npm run test:all

## GitHub Actions

The test suite can also be executed using GitHub Actions.

Go to:

GitHub → Actions → Playwright Tests → Run workflow

The required environment variables are configured as GitHub Secrets.
