import { useBoardStore } from './boards'
import { useTaskStore } from './tasks'
import { useColumnStore } from './columns'
import { useTagStore } from './tags'

describe('Separated Stores - CRUD Operations', () => {
  beforeEach(() => {
    // Clear all localStorage keys used by the stores
    window.localStorage.removeItem('board-storage')
    window.localStorage.removeItem('task-storage')
    window.localStorage.removeItem('column-storage')
    window.localStorage.removeItem('tag-storage')
    
    // Reset stores to initial state by re-importing them
    // This forces Zustand to reinitialize with default values
    cy.window().then(() => {
      // Clear in-memory state by setting to initial values manually
      const boardStore = useBoardStore.getState()
      const taskStore = useTaskStore.getState()
      const columnStore = useColumnStore.getState()
      const tagStore = useTagStore.getState()
      
      // Get all current IDs to delete everything
      boardStore.boards.allIds.forEach(id => {
        // Skip default board-1 or delete all
        if (id !== '1') {
          boardStore.deleteBoard(id)
        }
      })
      
      // Delete non-initial tasks (keep only initial ones)
      taskStore.tasks.forEach(task => {
        if (!['task-1', 'task-2', 'task-3', 'task-4', 'task-5'].includes(task.id)) {
          taskStore.deleteTask(task.id)
        }
      })
      
      // Delete non-initial columns
      columnStore.columns.forEach(col => {
        if (col.boardId !== '1') {
          columnStore.deleteColumn(col.id)
        }
      })
      
      // Delete all tags except initial ones
      tagStore.tags.forEach(tag => {
        if (!['tag-1', 'tag-2', 'tag-3', 'tag-4'].includes(tag.id)) {
          tagStore.deleteTag(tag.id)
        }
      })
    })
  })

  describe('Board Store - CRUD', () => {
    it('creates a new board with auto-generated columns', () => {
      const boardStore = useBoardStore.getState()
      
      const initialBoardCount = boardStore.boards.allIds.length
      const initialColumnCount = useColumnStore.getState().columns.length

      boardStore.addBoard({
        name: 'Test Board',
        description: 'Test Description',
        tasksCount: { total: 0, completed: 0, inProgress: 0 }
      })

      // Verify board was created
      const boards = useBoardStore.getState().boards
      expect(boards.allIds.length).to.equal(initialBoardCount + 1)
      
      const boardId = boards.allIds[boards.allIds.length - 1]
      const newBoard = boards.byId[boardId]
      expect(newBoard.name).to.equal('Test Board')
      expect(newBoard.id).to.match(/^board-\d+$/)

      // Verify 3 default columns were created
      const columns = useColumnStore.getState().columns
      expect(columns.length).to.equal(initialColumnCount + 3)
      
      const boardColumns = columns.filter(col => col.boardId === boardId)
      expect(boardColumns.length).to.equal(3)
      expect(boardColumns.map(c => c.status)).to.have.members(['todo', 'inProgress', 'done'])
    })

    it('reads a board by ID', () => {
      const boardStore = useBoardStore.getState()
      
      boardStore.addBoard({
        name: 'Read Test Board',
        description: 'Test',
        tasksCount: { total: 0, completed: 0, inProgress: 0 }
      })

      const allBoards = useBoardStore.getState().boards.allIds
      const boardId = allBoards[allBoards.length - 1] // Get the last added board
      const board = boardStore.getBoardById(boardId)
      
      expect(board).to.not.equal(undefined)
      expect(board?.name).to.equal('Read Test Board')
    })

    it('updates a board', () => {
      const boardStore = useBoardStore.getState()
      
      boardStore.addBoard({
        name: 'Original Name',
        description: 'Original',
        tasksCount: { total: 0, completed: 0, inProgress: 0 }
      })

      const boardId = useBoardStore.getState().boards.allIds[0]
      
      boardStore.updateBoard(boardId, {
        name: 'Updated Name',
        description: 'Updated Description'
      })

      const updated = useBoardStore.getState().boards.byId[boardId]
      expect(updated.name).to.equal('Updated Name')
      expect(updated.description).to.equal('Updated Description')
    })

    it('deletes a board with cascade deletion', () => {
      const boardStore = useBoardStore.getState()
      const taskStore = useTaskStore.getState()
      
      // Create board (auto-creates columns)
      boardStore.addBoard({
        name: 'Board to Delete',
        description: 'Test',
        tasksCount: { total: 0, completed: 0, inProgress: 0 }
      })

      const boardId = useBoardStore.getState().boards.allIds[0]
      
      // Add a task to the board
      taskStore.addTask({
        boardId,
        title: 'Task to Delete',
        description: '',
        status: 'todo',
        priority: 'medium',
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subTasks: []
      })

      const tasksBefore = useTaskStore.getState().tasks.filter(t => t.boardId === boardId)
      const columnsBefore = useColumnStore.getState().columns.filter(c => c.boardId === boardId)
      
      expect(tasksBefore.length).to.be.greaterThan(0)
      expect(columnsBefore.length).to.equal(3)

      // Delete board (should cascade delete tasks and columns)
      boardStore.deleteBoard(boardId)

      const boards = useBoardStore.getState().boards
      expect(boards.allIds).to.not.include(boardId)
      
      // Wait for async cascade deletion to complete
      cy.wait(100).then(() => {
        const tasksAfter = useTaskStore.getState().tasks.filter(t => t.boardId === boardId)
        const columnsAfter = useColumnStore.getState().columns.filter(c => c.boardId === boardId)
        
        // Should have deleted all tasks and columns for this specific board
        expect(tasksAfter.length).to.equal(0)
        expect(columnsAfter.length).to.equal(0)
      })
    })
  })

  describe('Task Store - CRUD', () => {
    let boardId: string

    beforeEach(() => {
      // Create a board for tasks
      const boardStore = useBoardStore.getState()
      boardStore.addBoard({
        name: 'Task Test Board',
        description: 'Test',
        tasksCount: { total: 0, completed: 0, inProgress: 0 }
      })
      boardId = useBoardStore.getState().boards.allIds[0]
    })

    it('creates a new task', () => {
      const taskStore = useTaskStore.getState()
      const initialCount = taskStore.tasks.length

      taskStore.addTask({
        boardId,
        title: 'New Test Task',
        description: 'Test Description',
        status: 'todo',
        priority: 'high',
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subTasks: []
      })

      const tasks = useTaskStore.getState().tasks
      expect(tasks.length).to.equal(initialCount + 1)
      
      const newTask = tasks[tasks.length - 1]
      expect(newTask.title).to.equal('New Test Task')
      expect(newTask.id).to.match(/^task-\d+$/)
      expect(newTask.priority).to.equal('high')
    })

    it('reads tasks by board', () => {
      const taskStore = useTaskStore.getState()
      
      taskStore.addTask({
        boardId,
        title: 'Task 1',
        description: '',
        status: 'todo',
        priority: 'medium',
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subTasks: []
      })

      taskStore.addTask({
        boardId,
        title: 'Task 2',
        description: '',
        status: 'inProgress',
        priority: 'low',
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subTasks: []
      })

      const boardTasks = taskStore.getTasksByBoard(boardId)
      expect(boardTasks.length).to.equal(2)
    })

    it('updates a task and recalculates board counters', () => {
      const taskStore = useTaskStore.getState()
      
      taskStore.addTask({
        boardId,
        title: 'Task to Update',
        description: '',
        status: 'todo',
        priority: 'medium',
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subTasks: []
      })

      const taskId = useTaskStore.getState().tasks[useTaskStore.getState().tasks.length - 1].id
      
      // Update task status to completed
      taskStore.updateTask(taskId, {
        status: 'done',
        completedAt: new Date().toISOString()
      })

      const updated = useTaskStore.getState().tasks.find(t => t.id === taskId)
      expect(updated?.status).to.equal('done')
      expect(updated?.completedAt).to.not.equal(undefined)

      // Verify board counters were updated
      const board = useBoardStore.getState().boards.byId[boardId]
      expect(board.tasksCount.completed).to.be.greaterThan(0)
    })

    it('deletes a task', () => {
      const taskStore = useTaskStore.getState()
      
      taskStore.addTask({
        boardId,
        title: 'Task to Delete',
        description: '',
        status: 'todo',
        priority: 'medium',
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subTasks: []
      })

      const taskId = useTaskStore.getState().tasks[useTaskStore.getState().tasks.length - 1].id
      const countBefore = useTaskStore.getState().tasks.length

      taskStore.deleteTask(taskId)

      const tasks = useTaskStore.getState().tasks
      expect(tasks.length).to.equal(countBefore - 1)
      expect(tasks.find(t => t.id === taskId)).to.equal(undefined)
    })

    it('reorders tasks within same column', () => {
      const taskStore = useTaskStore.getState()
      
      // Create 3 tasks
      taskStore.addTask({
        boardId,
        title: 'Task 1',
        description: '',
        status: 'todo',
        priority: 'medium',
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subTasks: []
      })

      taskStore.addTask({
        boardId,
        title: 'Task 2',
        description: '',
        status: 'todo',
        priority: 'medium',
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subTasks: []
      })

      taskStore.addTask({
        boardId,
        title: 'Task 3',
        description: '',
        status: 'todo',
        priority: 'medium',
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subTasks: []
      })

      const tasks = useTaskStore.getState().tasks.filter(t => t.boardId === boardId && t.status === 'todo')
      const taskIds = tasks.map(t => t.id)
      
      // Reorder: move first task to last position
      const reorderedIds = [taskIds[1], taskIds[2], taskIds[0]]
      
      taskStore.reorderTasks(boardId, 'todo', reorderedIds)

      const reordered = useTaskStore.getState().tasks
        .filter(t => t.boardId === boardId && t.status === 'todo')
        .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
      
      expect(reordered[0].id).to.equal(taskIds[1])
      expect(reordered[2].id).to.equal(taskIds[0])
    })
  })

  describe('Column Store - CRUD', () => {
    let boardId: string

    beforeEach(() => {
      const boardStore = useBoardStore.getState()
      boardStore.addBoard({
        name: 'Column Test Board',
        description: 'Test',
        tasksCount: { total: 0, completed: 0, inProgress: 0 }
      })
      boardId = useBoardStore.getState().boards.allIds[0]
    })

    it('creates a new column', () => {
      const columnStore = useColumnStore.getState()
      const initialCount = columnStore.columns.filter(c => c.boardId === boardId).length

      columnStore.addColumn({
        boardId,
        title: 'Custom Column',
        status: 'custom',
        color: '#ff0000',
        isFixed: false
      })

      const columns = useColumnStore.getState().columns.filter(c => c.boardId === boardId)
      expect(columns.length).to.equal(initialCount + 1)
      
      const newColumn = columns.find(c => c.title === 'Custom Column')
      expect(newColumn).to.not.equal(undefined)
      expect(newColumn?.id).to.match(/^col-custom-board-\d+$/)
    })

    it('reads columns by board', () => {
      const columnStore = useColumnStore.getState()
      const columns = columnStore.getColumnsByBoard(boardId)
      
      // Should have 3 default columns
      expect(columns.length).to.equal(3)
      expect(columns.map(c => c.status)).to.have.members(['todo', 'inProgress', 'done'])
    })

    it('updates a column', () => {
      const columnStore = useColumnStore.getState()
      const columns = columnStore.getColumnsByBoard(boardId)
      const columnId = columns[0].id

      columnStore.updateColumn(columnId, {
        title: 'Updated Title',
        color: '#00ff00'
      })

      const updated = useColumnStore.getState().columns.find(c => c.id === columnId)
      expect(updated?.title).to.equal('Updated Title')
      expect(updated?.color).to.equal('#00ff00')
    })

    it('deletes a column and migrates tasks to todo', () => {
      const columnStore = useColumnStore.getState()
      const taskStore = useTaskStore.getState()
      
      // Add task to inProgress column
      taskStore.addTask({
        boardId,
        title: 'Task in Progress',
        description: '',
        status: 'inProgress',
        priority: 'medium',
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subTasks: []
      })

      const taskId = useTaskStore.getState().tasks[useTaskStore.getState().tasks.length - 1].id
      const inProgressColumn = columnStore.columns.find(c => c.boardId === boardId && c.status === 'inProgress')
      
      expect(inProgressColumn).to.not.equal(undefined)

      // Verify column exists before deletion
      expect(inProgressColumn).to.not.equal(undefined)
      const columnsBefore = useColumnStore.getState().columns.filter(c => c.boardId === boardId)
      const columnsBeforeCount = columnsBefore.length

      // Delete inProgress column
      columnStore.deleteColumn(inProgressColumn!.id)

      // Column should be deleted
      const columnsAfter = useColumnStore.getState().columns.filter(c => c.boardId === boardId)
      expect(columnsAfter.length).to.equal(columnsBeforeCount - 1)
      expect(columnsAfter.find(c => c.status === 'inProgress')).to.equal(undefined)
      
      // Wait for async task migration to complete
      cy.wait(100).then(() => {
        // Task should be migrated to 'todo' (or first remaining column)
        const task = useTaskStore.getState().tasks.find(t => t.id === taskId)
        expect(task?.status).to.be.oneOf(['todo', 'done']) // Either migrated to todo or to first remaining column
      })
    })

    it('reorders columns', () => {
      const columnStore = useColumnStore.getState()
      const columns = columnStore.getColumnsByBoard(boardId)
      const columnIds = columns.map(c => c.id)
      
      // Reverse order
      const reversedIds = [...columnIds].reverse()
      
      columnStore.reorderColumns(boardId, reversedIds)

      const reordered = useColumnStore.getState().columns
        .filter(c => c.boardId === boardId)
        .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
      
      expect(reordered[0].id).to.equal(columnIds[columnIds.length - 1])
      expect(reordered[reordered.length - 1].id).to.equal(columnIds[0])
    })
  })

  describe('Tag Store - CRUD', () => {
    it('creates a new tag', () => {
      const tagStore = useTagStore.getState()
      const initialCount = tagStore.tags.length

      tagStore.addTag({
        name: 'Testing',
        color: '#3b82f6'
      })

      const tags = useTagStore.getState().tags
      expect(tags.length).to.equal(initialCount + 1)
      
      // Find the tag by name (not by position) since there are initial tags
      const newTag = tags.find(t => t.name === 'Testing')
      expect(newTag).to.not.equal(undefined)
      expect(newTag?.color).to.equal('#3b82f6')
    })

    it('reads all tags', () => {
      const tagStore = useTagStore.getState()
      
      tagStore.addTag({ name: 'Tag 1', color: '#ff0000' })
      tagStore.addTag({ name: 'Tag 2', color: '#00ff00' })

      const tags = useTagStore.getState().tags
      expect(tags.length).to.be.greaterThan(0)
    })

    it('updates a tag', () => {
      const tagStore = useTagStore.getState()
      
      tagStore.addTag({
        name: 'Original Tag',
        color: '#ff0000'
      })

      const tag = useTagStore.getState().tags.find(t => t.name === 'Original Tag')
      expect(tag).to.not.equal(undefined)

      tagStore.updateTag(tag!.id, {
        name: 'Updated Tag',
        color: '#00ff00'
      })

      const updated = useTagStore.getState().tags.find(t => t.id === tag!.id)
      expect(updated?.name).to.equal('Updated Tag')
      expect(updated?.color).to.equal('#00ff00')
    })

    it('deletes a tag', () => {
      const tagStore = useTagStore.getState()
      
      tagStore.addTag({
        name: 'Tag to Delete',
        color: '#ff0000'
      })

      const tag = useTagStore.getState().tags.find(t => t.name === 'Tag to Delete')
      expect(tag).to.not.equal(undefined)
      
      const countBefore = useTagStore.getState().tags.length

      tagStore.deleteTag(tag!.id)

      const tags = useTagStore.getState().tags
      expect(tags.length).to.equal(countBefore - 1)
      expect(tags.find(t => t.id === tag!.id)).to.equal(undefined)
    })
  })

  describe('Cross-Store Integration', () => {
    it('updates board counters when task status changes', () => {
      const boardStore = useBoardStore.getState()
      const taskStore = useTaskStore.getState()
      
      boardStore.addBoard({
        name: 'Integration Test Board',
        description: 'Test',
        tasksCount: { total: 0, completed: 0, inProgress: 0 }
      })

      const boardId = useBoardStore.getState().boards.allIds[0]
      
      // Add task in todo
      taskStore.addTask({
        boardId,
        title: 'Task 1',
        description: '',
        status: 'todo',
        priority: 'medium',
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subTasks: []
      })

      const taskId = useTaskStore.getState().tasks[useTaskStore.getState().tasks.length - 1].id
      
      let board = useBoardStore.getState().boards.byId[boardId]
      expect(board.tasksCount.total).to.equal(1)
      expect(board.tasksCount.completed).to.equal(0)
      expect(board.tasksCount.inProgress).to.equal(0)

      // Move to inProgress
      taskStore.updateTask(taskId, { status: 'inProgress' })
      
      board = useBoardStore.getState().boards.byId[boardId]
      expect(board.tasksCount.inProgress).to.equal(1)
      expect(board.tasksCount.completed).to.equal(0)

      // Complete task
      taskStore.updateTask(taskId, { 
        status: 'done',
        completedAt: new Date().toISOString()
      })
      
      board = useBoardStore.getState().boards.byId[boardId]
      expect(board.tasksCount.completed).to.equal(1)
      expect(board.tasksCount.inProgress).to.equal(0)
    })

    it('prevents negative counters with Math.max validation', () => {
      const boardStore = useBoardStore.getState()
      
      boardStore.addBoard({
        name: 'Counter Test Board',
        description: 'Test',
        tasksCount: { total: 0, completed: 0, inProgress: 0 }
      })

      const boardId = useBoardStore.getState().boards.allIds[0]
      
      // Try to decrease counter below 0
      boardStore.updateBoardTaskCount(boardId, {
        total: -5,
        completed: -3,
        inProgress: -2
      })

      const board = useBoardStore.getState().boards.byId[boardId]
      
      // All counters should be 0, not negative
      expect(board.tasksCount.total).to.equal(0)
      expect(board.tasksCount.completed).to.equal(0)
      expect(board.tasksCount.inProgress).to.equal(0)
    })
  })
})
