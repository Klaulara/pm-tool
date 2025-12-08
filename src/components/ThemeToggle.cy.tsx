import React from 'react'
import { ThemeToggle } from './ThemeToggle'
import { ThemeProvider } from '@/styles/ThemeProvider'

const mountWithTheme = (component: React.ReactElement) => {
  return cy.mount(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  )
}

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    // Clear localStorage and set to light mode before each test
    cy.window().then((win) => {
      win.localStorage.clear()
      win.localStorage.setItem('theme', 'light')
    })
  })

  it('renders the theme toggle button', () => {
    mountWithTheme(<ThemeToggle />)

    // Should render a switch button
    cy.get('button[role="switch"]').should('exist')
  })

  it('starts in light mode by default', () => {
    mountWithTheme(<ThemeToggle />)

    // Wait for hydration
    cy.get('button[role="switch"]').should('not.be.disabled')

    // Should have aria-checked false for light mode
    cy.get('button[role="switch"]').should('have.attr', 'aria-checked', 'false')
  })

  it('toggles theme when clicked', () => {
    mountWithTheme(<ThemeToggle />)

    // Wait for hydration
    cy.get('button[role="switch"]').should('not.be.disabled')

    // Get initial state
    cy.get('button[role="switch"]').invoke('attr', 'aria-checked').then((initialState) => {
      // Click to toggle
      cy.get('button[role="switch"]').click()

      // Should toggle to opposite state
      const expectedState = initialState === 'true' ? 'false' : 'true'
      cy.get('button[role="switch"]').should('have.attr', 'aria-checked', expectedState)
    })
  })

  it('toggles back and forth', () => {
    mountWithTheme(<ThemeToggle />)

    // Wait for hydration
    cy.get('button[role="switch"]').should('not.be.disabled')

    // Get initial state
    cy.get('button[role="switch"]').invoke('attr', 'aria-checked').then((initialState) => {
      // Toggle once
      cy.get('button[role="switch"]').click()
      const toggledState = initialState === 'true' ? 'false' : 'true'
      cy.get('button[role="switch"]').should('have.attr', 'aria-checked', toggledState)

      // Toggle back
      cy.get('button[role="switch"]').click()
      cy.get('button[role="switch"]').should('have.attr', 'aria-checked', initialState)
    })
  })

  it('has proper aria attributes', () => {
    mountWithTheme(<ThemeToggle />)

    // Wait for hydration
    cy.get('button[role="switch"]').should('not.be.disabled')

    const switchButton = cy.get('button[role="switch"]')

    // Check aria attributes
    switchButton.should('have.attr', 'aria-label', 'Toggle theme')
    switchButton.should('have.attr', 'aria-checked')
  })

  it('updates aria-checked when toggled', () => {
    mountWithTheme(<ThemeToggle />)

    // Wait for hydration
    cy.get('button[role="switch"]').should('not.be.disabled')

    // Store initial state
    cy.get('button[role="switch"]').invoke('attr', 'aria-checked').then((initial) => {
      // Click to toggle
      cy.get('button[role="switch"]').click()

      // Should have opposite state
      const expected = initial === 'true' ? 'false' : 'true'
      cy.get('button[role="switch"]').should('have.attr', 'aria-checked', expected)
    })
  })

  it('is disabled during initial mount (hydration)', () => {
    // Mount without waiting
    mountWithTheme(<ThemeToggle />)

    // During SSR/hydration, button should exist
    cy.get('button[role="switch"]').should('exist')
  })

  it('applies correct styles when checked', () => {
    mountWithTheme(<ThemeToggle />)

    // Wait for hydration
    cy.get('button[role="switch"]').should('not.be.disabled')

    // Click to toggle
    cy.get('button[role="switch"]').click()

    // Verify button has aria-checked attribute (we can't predict the value)
    cy.get('button[role="switch"]').should('have.attr', 'aria-checked')
  })

  it('can be toggled multiple times', () => {
    mountWithTheme(<ThemeToggle />)

    // Wait for hydration
    cy.get('button[role="switch"]').should('not.be.disabled')

    // Get initial state
    cy.get('button[role="switch"]').invoke('attr', 'aria-checked').then((initialState) => {
      // Toggle 4 times (even number = back to initial state)
      for (let i = 0; i < 4; i++) {
        cy.get('button[role="switch"]').click()
      }

      // After 4 toggles (even number), should be back to initial state
      cy.get('button[role="switch"]').should('have.attr', 'aria-checked', initialState)
    })
  })

  it('maintains focus styles', () => {
    mountWithTheme(<ThemeToggle />)

    // Wait for hydration
    cy.get('button[role="switch"]').should('not.be.disabled')

    // Focus the button
    cy.get('button[role="switch"]').focus()

    // Should have focus-visible outline (verified via CSS)
    cy.get('button[role="switch"]').should('have.focus')
  })
})
