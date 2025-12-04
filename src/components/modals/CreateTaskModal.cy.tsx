import React from 'react'
import CreateTaskModal from './CreateTaskModal'

describe('<CreateTaskModal />', () => {
  it('renders and displays modal correctly', () => {
    const mockSetIsOpen = cy.stub()
    const mockSetTaskName = cy.stub()
    const mockSetTaskDescription = cy.stub()
    const mockSetTaskPriority = cy.stub()
    const mockSetTaskDueDate = cy.stub()
    const mockHandleCreate = cy.stub()

    cy.mount(
      <CreateTaskModal 
        isCreateModalOpen={true}
        setIsCreateModalOpen={mockSetIsOpen}
        newTaskName=""
        setNewTaskName={mockSetTaskName}
        newTaskDescription=""
        setNewTaskDescription={mockSetTaskDescription}
        newTaskPriority="low"
        setNewTaskPriority={mockSetTaskPriority}
        newTaskDueDate=""
        setNewTaskDueDate={mockSetTaskDueDate}
        handleCreateTask={mockHandleCreate}
      />
    )

    // Verify modal title
    cy.contains('Crear Nueva Tarea').should('be.visible')
    
    // Verify form fields exist
    cy.get('input#task-name').should('exist')
    cy.get('textarea').should('exist') // Changed from textarea#task-description
    cy.get('select#task-priority').should('exist')
    cy.get('input#task-due-date').should('exist')
  })

  it('allows user to fill out the form', () => {
    const mockSetIsOpen = cy.stub()
    const mockSetTaskName = cy.stub()
    const mockSetTaskDescription = cy.stub()
    const mockSetTaskPriority = cy.stub()
    const mockSetTaskDueDate = cy.stub()
    const mockHandleCreate = cy.stub()

    cy.mount(
      <CreateTaskModal 
        isCreateModalOpen={true}
        setIsCreateModalOpen={mockSetIsOpen}
        newTaskName=""
        setNewTaskName={mockSetTaskName}
        newTaskDescription=""
        setNewTaskDescription={mockSetTaskDescription}
        newTaskPriority="low"
        setNewTaskPriority={mockSetTaskPriority}
        newTaskDueDate=""
        setNewTaskDueDate={mockSetTaskDueDate}
        handleCreateTask={mockHandleCreate}
      />
    )

    // Fill task name
    cy.get('input#task-name').type('Test Task')
    cy.wrap(mockSetTaskName).should('have.been.called')

    // Fill description
    cy.get('textarea#task-description').type('Test Description')
    cy.wrap(mockSetTaskDescription).should('have.been.called')

    // Select priority
    cy.get('select#task-priority').select('high')
    cy.wrap(mockSetTaskPriority).should('have.been.called')
  })

  it('switches between Write and Preview tabs', () => {
    const mockSetIsOpen = cy.stub()
    const mockSetTaskName = cy.stub()
    const mockSetTaskDescription = cy.stub()
    const mockSetTaskPriority = cy.stub()
    const mockSetTaskDueDate = cy.stub()
    const mockHandleCreate = cy.stub()

    cy.mount(
      <CreateTaskModal 
        isCreateModalOpen={true}
        setIsCreateModalOpen={mockSetIsOpen}
        newTaskName="Test"
        setNewTaskName={mockSetTaskName}
        newTaskDescription="**Bold text**"
        setNewTaskDescription={mockSetTaskDescription}
        newTaskPriority="low"
        setNewTaskPriority={mockSetTaskPriority}
        newTaskDueDate=""
        setNewTaskDueDate={mockSetTaskDueDate}
        handleCreateTask={mockHandleCreate}
      />
    )

    // Default should be Write tab
    cy.contains('button', 'Write').should('exist')
    cy.contains('button', 'Preview').should('exist')

    // Click Preview tab
    cy.contains('button', 'Preview').click()
    
    // Should show markdown preview
    cy.get('strong').should('contain', 'Bold text')
  })

  it('calls handleCreateTask when form is submitted', () => {
    const mockSetIsOpen = cy.stub()
    const mockSetTaskName = cy.stub()
    const mockSetTaskDescription = cy.stub()
    const mockSetTaskPriority = cy.stub()
    const mockSetTaskDueDate = cy.stub()
    const mockHandleCreate = cy.stub()

    cy.mount(
      <CreateTaskModal 
        isCreateModalOpen={true}
        setIsCreateModalOpen={mockSetIsOpen}
        newTaskName="Valid Task Name"
        setNewTaskName={mockSetTaskName}
        newTaskDescription="Description"
        setNewTaskDescription={mockSetTaskDescription}
        newTaskPriority="medium"
        setNewTaskPriority={mockSetTaskPriority}
        newTaskDueDate=""
        setNewTaskDueDate={mockSetTaskDueDate}
        handleCreateTask={mockHandleCreate}
      />
    )

    // Click create button
    cy.contains('button', 'Crear Tarea').click()
    
    // Verify handleCreateTask was called
    cy.wrap(mockHandleCreate).should('have.been.called')
  })

  it('disables create button when task name is empty', () => {
    const mockSetIsOpen = cy.stub()
    const mockSetTaskName = cy.stub()
    const mockSetTaskDescription = cy.stub()
    const mockSetTaskPriority = cy.stub()
    const mockSetTaskDueDate = cy.stub()
    const mockHandleCreate = cy.stub()

    cy.mount(
      <CreateTaskModal 
        isCreateModalOpen={true}
        setIsCreateModalOpen={mockSetIsOpen}
        newTaskName=""
        setNewTaskName={mockSetTaskName}
        newTaskDescription=""
        setNewTaskDescription={mockSetTaskDescription}
        newTaskPriority="low"
        setNewTaskPriority={mockSetTaskPriority}
        newTaskDueDate=""
        setNewTaskDueDate={mockSetTaskDueDate}
        handleCreateTask={mockHandleCreate}
      />
    )

    // Create button should be disabled
    cy.contains('button', 'Crear Tarea').should('be.disabled')
  })
})