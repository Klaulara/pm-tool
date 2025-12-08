describe('Kanban Board Drag and Drop E2E', () => {
  beforeEach(() => {
    // Visit the board page
    cy.visit('/boards/test-board-1')
  })

  it('loads the board with tasks in columns', () => {
    // Verify columns are visible
    cy.contains('To Do').should('be.visible')
    cy.contains('In Progress').should('be.visible')
    cy.contains('Done').should('be.visible')
    
    // Verify at least one task is visible
    cy.get('[data-testid="task-card"]').should('have.length.greaterThan', 0)
  })

  it('drags task from one column to another', () => {
    // Get initial column task count
    cy.get('[data-column="todo"]').find('[data-testid="task-card"]').its('length').as('initialCount')
    
    // Drag first task from "To Do" to "In Progress"
    cy.get('[data-column="todo"]')
      .find('[data-testid="task-card"]')
      .first()
      .as('draggedTask')
    
    cy.get('@draggedTask').invoke('text').as('taskText')
    
    // Perform drag and drop using native Cypress commands
    cy.get('@draggedTask')
      .trigger('mousedown', { which: 1, force: true })
      .wait(100)
    
    cy.get('[data-column="in-progress"]')
      .trigger('mousemove', { force: true })
      .wait(100)
      .trigger('mouseup', { force: true })
    
    // Wait for animation
    cy.wait(500)
    
    // Verify task moved
    cy.get('[data-column="in-progress"]').within(() => {
      cy.get('@taskText').then((text) => {
        const taskText = String(text)
        cy.contains(taskText).should('be.visible')
      })
    })
  })

  it('reorders tasks within the same column', () => {
    // Get tasks in "To Do" column
    cy.get('[data-column="todo"]')
      .find('[data-testid="task-card"]')
      .should('have.length.greaterThan', 1)
    
    // Get text of first and second tasks
    cy.get('[data-column="todo"]')
      .find('[data-testid="task-card"]')
      .first()
      .invoke('text')
      .as('firstTask')
    
    cy.get('[data-column="todo"]')
      .find('[data-testid="task-card"]')
      .eq(1)
      .invoke('text')
      .as('secondTask')
    
    // Drag first task below second task
    cy.get('[data-column="todo"]')
      .find('[data-testid="task-card"]')
      .first()
      .trigger('mousedown', { which: 1, force: true })
      .trigger('mousemove', { clientX: 100, clientY: 200, force: true })
      .wait(100)
      .trigger('mouseup', { force: true })
    
    cy.wait(500)
    
    // Verify order changed
    cy.get('[data-column="todo"]')
      .find('[data-testid="task-card"]')
      .first()
      .then(($el) => {
        cy.get('@secondTask').then((text) => {
          const secondTaskText = String(text)
          expect($el.text()).to.include(secondTaskText)
        })
      })
  })

  it('shows visual feedback during drag', () => {
    cy.get('[data-testid="task-card"]')
      .first()
      .trigger('mousedown', { which: 1 })
      .wait(100)
    
    // Task should show dragging state (opacity change or transform)
    cy.get('[data-testid="task-card"]')
      .first()
      .should('have.css', 'opacity')
      .and('match', /0\.\d+/)
  })

  it('cancels drag on escape key', () => {
    cy.get('[data-testid="task-card"]')
      .first()
      .invoke('text')
      .as('taskText')
      .then(() => {
        cy.get('[data-testid="task-card"]')
          .first()
          .trigger('mousedown', { which: 1 })
          .wait(100)
          .trigger('keydown', { key: 'Escape' })
          .wait(100)
        
        // Task should remain in original position
        cy.get('@taskText').then((text) => {
          const taskText = String(text)
          cy.contains(taskText).should('be.visible')
        })
      })
  })

  it('prevents dropping in invalid areas', () => {
    // Try to drag task outside of droppable areas
    cy.window().then((win) => {
      cy.get('[data-testid="task-card"]')
        .first()
        .trigger('mousedown', { which: 1, force: true })
        .trigger('mousemove', { clientX: win.innerWidth - 50, clientY: win.innerHeight - 50, force: true })
        .wait(100)
        .trigger('mouseup', { force: true })
    })
    
    cy.wait(500)
    
    // Task should remain in original column
    cy.get('[data-testid="task-card"]').first().should('be.visible')
  })
})

describe('Task Card Interactions', () => {
  beforeEach(() => {
    cy.visit('/boards/test-board-1')
  })

  it('opens task details modal on click (not during drag)', () => {
    cy.get('[data-testid="task-card"]')
      .first()
      .click()
    
    // Modal should open
    cy.get('[role="dialog"]').should('be.visible')
    cy.contains('Task Details').should('be.visible')
  })

  it('shows delete button on hover', () => {
    // Delete button should be hidden initially
    cy.get('.delete-button').should('not.be.visible')
    
    // Hover over task card
    cy.get('[data-testid="task-card"]')
      .first()
      .trigger('mouseenter')
    
    // Delete button should be visible
    cy.get('.delete-button').first().should('be.visible')
  })

  it('deletes task after confirmation', () => {
    cy.get('[data-testid="task-card"]')
      .first()
      .invoke('text')
      .as('taskToDelete')
    
    // Hover and click delete button
    cy.get('[data-testid="task-card"]')
      .first()
      .trigger('mouseenter')
    
    cy.get('.delete-button').first().click()
    
    // Confirmation modal should appear
    cy.contains('Delete Task').should('be.visible')
    
    // Confirm deletion
    cy.contains('button', 'Delete').click()
    
    // Task should be removed
    cy.get('@taskToDelete').then((text) => {
      const taskText = String(text)
      cy.contains(taskText).should('not.exist')
    })
  })

  it('cancels task deletion', () => {
    cy.get('[data-testid="task-card"]')
      .first()
      .invoke('text')
      .as('taskText')
    
    // Hover and click delete button
    cy.get('[data-testid="task-card"]')
      .first()
      .trigger('mouseenter')
    
    cy.get('.delete-button').first().click()
    
    // Cancel deletion
    cy.contains('button', 'Cancel').click()
    
    // Task should still exist
    cy.get('@taskText').then((text) => {
      const taskText = String(text)
      cy.contains(taskText).should('be.visible')
    })
  })
})
