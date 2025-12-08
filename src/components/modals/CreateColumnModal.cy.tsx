import React from 'react'
import CreateColumnModal from './CreateColumnModal'
import { ThemeProvider } from '@/styles/ThemeProvider'

describe('<CreateColumnModal />', () => {
  const mountWithTheme = (component: React.ReactElement) => {
    cy.mount(
      <ThemeProvider>
        {component}
      </ThemeProvider>
    )
  }

  it('renders modal when open', () => {
    const mockSetIsOpen = cy.stub()
    const mockSetName = cy.stub()
    const mockSetColor = cy.stub()
    const mockHandleCreate = cy.stub()

    mountWithTheme(
      <CreateColumnModal
        isCreateModalOpen={true}
        setIsCreateModalOpen={mockSetIsOpen}
        newColumnName=""
        setNewColumnName={mockSetName}
        newColumnColor="#4F46E5"
        setNewColumnColor={mockSetColor}
        handleColumnCreate={mockHandleCreate}
      />
    )

    // Verify modal title
    cy.contains('Create new column').should('be.visible')
  })

  it('does not render when closed', () => {
    const mockSetIsOpen = cy.stub()
    const mockSetTitle = cy.stub()
    const mockSetColor = cy.stub()
    const mockHandleCreate = cy.stub()

    mountWithTheme(
      <CreateColumnModal
        isCreateModalOpen={false}
        setIsCreateModalOpen={mockSetIsOpen}
        newColumnName=""
        setNewColumnName={mockSetTitle}
        newColumnColor="#4F46E5"
        setNewColumnColor={mockSetColor}
        handleColumnCreate={mockHandleCreate}
      />
    )

    // Modal should not be visible when closed
    cy.contains('Create new column').should('not.be.visible')
  })

  it('displays form fields correctly', () => {
    const mockSetIsOpen = cy.stub()
    const mockSetTitle = cy.stub()
    const mockSetColor = cy.stub()
    const mockHandleCreate = cy.stub()

    mountWithTheme(
      <CreateColumnModal
        isCreateModalOpen={true}
        setIsCreateModalOpen={mockSetIsOpen}
        newColumnName=""
        setNewColumnName={mockSetTitle}
        newColumnColor="#4F46E5"
        setNewColumnColor={mockSetColor}
        handleColumnCreate={mockHandleCreate}
      />
    )

    // Check for input fields
    cy.get('input[type="text"]').should('exist')
    cy.get('input[type="color"]').should('exist')
    
    // Check for buttons
    cy.contains('button', 'Cancelar').should('be.visible')
    cy.contains('button', 'Create Column').should('be.visible')
  })

  it('allows user to type column title', () => {
    const mockSetIsOpen = cy.stub()
    const mockSetTitle = cy.stub()
    const mockSetColor = cy.stub()
    const mockHandleCreate = cy.stub()

    mountWithTheme(
      <CreateColumnModal
        isCreateModalOpen={true}
        setIsCreateModalOpen={mockSetIsOpen}
        newColumnName=""
        setNewColumnName={mockSetTitle}
        newColumnColor="#4F46E5"
        setNewColumnColor={mockSetColor}
        handleColumnCreate={mockHandleCreate}
      />
    )

    // Type in the title input
    cy.get('input[type="text"]').type('New Column')
    
    // Verify setter was called
    cy.wrap(mockSetTitle).should('have.been.called')
  })

  it('allows user to change column color', () => {
    const mockSetIsOpen = cy.stub()
    const mockSetTitle = cy.stub()
    const mockSetColor = cy.stub()
    const mockHandleCreate = cy.stub()

    mountWithTheme(
      <CreateColumnModal
        isCreateModalOpen={true}
        setIsCreateModalOpen={mockSetIsOpen}
        newColumnName=""
        setNewColumnName={mockSetTitle}
        newColumnColor="#4F46E5"
        setNewColumnColor={mockSetColor}
        handleColumnCreate={mockHandleCreate}
      />
    )

    // Change color
    cy.get('input[type="color"]').invoke('val', '#FF5733').trigger('change')
    
    // Verify setter was called
    cy.wrap(mockSetColor).should('have.been.called')
  })

  it('calls handleColumnCreate when create button is clicked', () => {
    const mockSetIsOpen = cy.stub()
    const mockSetTitle = cy.stub()
    const mockSetColor = cy.stub()
    const mockHandleCreate = cy.stub()

    mountWithTheme(
      <CreateColumnModal
        isCreateModalOpen={true}
        setIsCreateModalOpen={mockSetIsOpen}
        newColumnName="Test Column"
        setNewColumnName={mockSetTitle}
        newColumnColor="#4F46E5"
        setNewColumnColor={mockSetColor}
        handleColumnCreate={mockHandleCreate}
      />
    )

    // Click create button
    cy.contains('button', 'Create Column').click()
    
    // Verify handler was called
    cy.wrap(mockHandleCreate).should('have.been.called')
  })

  it('disables create button when title is empty', () => {
    const mockSetIsOpen = cy.stub()
    const mockSetTitle = cy.stub()
    const mockSetColor = cy.stub()
    const mockHandleCreate = cy.stub()

    mountWithTheme(
      <CreateColumnModal
        isCreateModalOpen={true}
        setIsCreateModalOpen={mockSetIsOpen}
        newColumnName=""
        setNewColumnName={mockSetTitle}
        newColumnColor="#4F46E5"
        setNewColumnColor={mockSetColor}
        handleColumnCreate={mockHandleCreate}
      />
    )

    // Create button should be disabled when title is empty
    cy.contains('button', 'Create Column').should('be.disabled')
  })

  it('enables create button when title is provided', () => {
    const mockSetIsOpen = cy.stub()
    const mockSetTitle = cy.stub()
    const mockSetColor = cy.stub()
    const mockHandleCreate = cy.stub()

    mountWithTheme(
      <CreateColumnModal
        isCreateModalOpen={true}
        setIsCreateModalOpen={mockSetIsOpen}
        newColumnName="Valid Title"
        setNewColumnName={mockSetTitle}
        newColumnColor="#4F46E5"
        setNewColumnColor={mockSetColor}
        handleColumnCreate={mockHandleCreate}
      />
    )

    // Create button should be enabled when title is provided
    cy.contains('button', 'Create Column').should('not.be.disabled')
  })

  it('calls setIsCreateModalOpen when cancel button is clicked', () => {
    const mockSetIsOpen = cy.stub()
    const mockSetTitle = cy.stub()
    const mockSetColor = cy.stub()
    const mockHandleCreate = cy.stub()

    mountWithTheme(
      <CreateColumnModal
        isCreateModalOpen={true}
        setIsCreateModalOpen={mockSetIsOpen}
        newColumnName=""
        setNewColumnName={mockSetTitle}
        newColumnColor="#4F46E5"
        setNewColumnColor={mockSetColor}
        handleColumnCreate={mockHandleCreate}
      />
    )

    // Click cancel button
    cy.contains('button', 'Cancelar').click()
    
    // Verify modal close was called
    cy.wrap(mockSetIsOpen).should('have.been.calledWith', false)
  })

  it('calls setIsCreateModalOpen when close button (X) is clicked', () => {
    const mockSetIsOpen = cy.stub()
    const mockSetTitle = cy.stub()
    const mockSetColor = cy.stub()
    const mockHandleCreate = cy.stub()

    mountWithTheme(
      <CreateColumnModal
        isCreateModalOpen={true}
        setIsCreateModalOpen={mockSetIsOpen}
        newColumnName=""
        setNewColumnName={mockSetTitle}
        newColumnColor="#4F46E5"
        setNewColumnColor={mockSetColor}
        handleColumnCreate={mockHandleCreate}
      />
    )

    // Click the close button (X) - find button containing × symbol
    cy.get('button').contains('✕').click()
    
    // Verify modal close was called
    cy.wrap(mockSetIsOpen).should('have.been.calledWith', false)
  })

  it('displays current color value', () => {
    const mockSetIsOpen = cy.stub()
    const mockSetTitle = cy.stub()
    const mockSetColor = cy.stub()
    const mockHandleCreate = cy.stub()

    mountWithTheme(
      <CreateColumnModal
        isCreateModalOpen={true}
        setIsCreateModalOpen={mockSetIsOpen}
        newColumnName=""
        setNewColumnName={mockSetTitle}
        newColumnColor="#FF5733"
        setNewColumnColor={mockSetColor}
        handleColumnCreate={mockHandleCreate}
      />
    )

    // Verify color input has correct value
    cy.get('input[type="color"]').should('have.value', '#ff5733')
  })

  it('shows validation for minimum title length', () => {
    const mockSetIsOpen = cy.stub()
    const mockSetTitle = cy.stub()
    const mockSetColor = cy.stub()
    const mockHandleCreate = cy.stub()

    mountWithTheme(
      <CreateColumnModal
        isCreateModalOpen={true}
        setIsCreateModalOpen={mockSetIsOpen}
        newColumnName="A"
        setNewColumnName={mockSetTitle}
        newColumnColor="#4F46E5"
        setNewColumnColor={mockSetColor}
        handleColumnCreate={mockHandleCreate}
      />
    )

    // Button should be disabled for short titles (less than 2 characters)
    cy.contains('button', 'Create Column').should('be.disabled')
    // Should show error message
    cy.contains('Minimum 2 characters required').should('be.visible')
  })
})
