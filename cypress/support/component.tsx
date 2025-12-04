// ***********************************************************
// This example support/component.tsx is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

import { mount } from 'cypress/react'
import { ThemeProvider } from '@/styles/ThemeProvider'
import React from 'react'

// Augment the Cypress namespace to include type definitions for
// your custom command.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      mount: typeof customMount
    }
  }
}

// Wrapper component with ThemeProvider
const customMount = (component: React.ReactElement, options = {}) => {
  return mount(
    <ThemeProvider>
      {component}
    </ThemeProvider>,
    options
  )
}

Cypress.Commands.add('mount', customMount)

// Example use:
// cy.mount(<MyComponent />)
