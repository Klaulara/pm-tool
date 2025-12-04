import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
    specPattern: "src/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/component.tsx",
  },

  e2e: {
    setupNodeEvents() {
      // implement node event listeners here
    },
  },
});
