/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command for drag and drop with @dnd-kit
Cypress.Commands.add('dragAndDrop', (dragSelector: string, dropSelector: string) => {
  cy.get(dragSelector)
    .trigger('mousedown', { which: 1, force: true })
    .wait(100)
    
  cy.get(dropSelector)
    .trigger('mousemove', { force: true })
    .wait(100)
    .trigger('mouseup', { force: true })
})

// Custom command for drag to coordinates
Cypress.Commands.add('dragToCoordinates', (selector: string, x: number, y: number) => {
  cy.get(selector)
    .trigger('mousedown', { which: 1, force: true })
    .trigger('mousemove', { clientX: x, clientY: y, force: true })
    .wait(100)
    .trigger('mouseup', { force: true })
})

declare global {
  namespace Cypress {
    interface Chainable {
      dragAndDrop(dragSelector: string, dropSelector: string): Chainable<void>
      dragToCoordinates(selector: string, x: number, y: number): Chainable<void>
    }
  }
}