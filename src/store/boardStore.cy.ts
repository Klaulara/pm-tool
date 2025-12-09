import { useBoardStore } from './boardStore'

describe('BoardStore - State Management', () => {
  // No intentamos limpiar el store, solo trabajamos con el estado actual
  
  describe('Board Actions', () => {
    beforeEach(() => {
      // Reset store to clean state before each test
      useBoardStore.getState().resetStore()
    })

    it('adds a new board', () => {
      const store = useBoardStore.getState()
      const initialCount = store.boards.length

      store.addBoard({
        name: 'Test Board',
        description: 'Test Description',
        tasksCount: { total: 0, completed: 0, inProgress: 0 }
      })

      const boards = useBoardStore.getState().boards
      expect(boards.length).to.equal(initialCount + 1)
      
      // Find the board we just added
      const addedBoard = boards.find(b => b.name === 'Test Board')
      expect(addedBoard).to.not.equal(undefined)
      expect(addedBoard?.name).to.equal('Test Board')
    })

    it('updates an existing board', () => {
      const store = useBoardStore.getState()
      
      // Add a new board to update
      store.addBoard({
        name: 'Original Name',
        description: 'Original Description',
        tasksCount: { total: 0, completed: 0, inProgress: 0 }
      })

      // Get the board we just added
      const board = useBoardStore.getState().boards.find(b => b.name === 'Original Name')
      expect(board).to.not.equal(undefined)
      const boardId = board!.id
      
      store.updateBoard(boardId, { name: 'Updated Name' })

      const updatedBoard = useBoardStore.getState().getBoardById(boardId)
      expect(updatedBoard?.name).to.equal('Updated Name')
      expect(updatedBoard?.description).to.equal('Original Description')
    })

    it('deletes a board', () => {
      const store = useBoardStore.getState()
      
      store.addBoard({
        name: 'Board to Delete',
        description: 'Will be deleted',
        tasksCount: { total: 0, completed: 0, inProgress: 0 }
      })

      const board = useBoardStore.getState().boards.find(b => b.name === 'Board to Delete')
      expect(board).to.not.equal(undefined)
      const boardId = board!.id
      const initialCount = useBoardStore.getState().boards.length
      
      store.deleteBoard(boardId)

      expect(useBoardStore.getState().boards.length).to.equal(initialCount - 1)
      expect(store.getBoardById(boardId)).to.equal(undefined)
    })

    it('toggles board star status', () => {
      const store = useBoardStore.getState()
      
      store.addBoard({
        name: 'Board to Star',
        description: 'Test',
        tasksCount: { total: 0, completed: 0, inProgress: 0 },
        isStarred: false
      })

      const board = useBoardStore.getState().boards.find(b => b.name === 'Board to Star')
      expect(board).to.not.equal(undefined)
      const boardId = board!.id
      
      // Toggle to starred
      store.toggleStarBoard(boardId)
      expect(useBoardStore.getState().getBoardById(boardId)?.isStarred).to.equal(true)

      // Toggle back to unstarred
      store.toggleStarBoard(boardId)
      expect(useBoardStore.getState().getBoardById(boardId)?.isStarred).to.equal(false)
    })

    it('gets board by ID', () => {
      const store = useBoardStore.getState()
      
      store.addBoard({
        name: 'Findable Board',
        description: 'Test',
        tasksCount: { total: 0, completed: 0, inProgress: 0 }
      })

      const addedBoard = useBoardStore.getState().boards.find(b => b.name === 'Findable Board')
      expect(addedBoard).to.not.equal(undefined)
      const boardId = addedBoard!.id
      const board = store.getBoardById(boardId)

      expect(board).to.not.equal(undefined)
      expect(board?.name).to.equal('Findable Board')
    })

    it('returns undefined for non-existent board ID', () => {
      const store = useBoardStore.getState()
      const board = store.getBoardById('non-existent-id')

      expect(board).to.equal(undefined)
    })
  })

  describe('Task Actions', () => {
    let testBoardId: string

    beforeEach(() => {
      // Reset store to clean state before each test
      useBoardStore.getState().resetStore()
      
      // Add a fresh board for each task test
      const store = useBoardStore.getState()
      store.addBoard({
        name: 'Task Test Board ' + Date.now(),
        description: 'For testing tasks',
        tasksCount: { total: 0, completed: 0, inProgress: 0 }
      })
      const board = useBoardStore.getState().boards.find(b => b.description === 'For testing tasks')
      testBoardId = board!.id
    })

    it('adds a new task', () => {
      const store = useBoardStore.getState()
      const initialCount = store.tasks.length

      store.addTask({
        title: 'New Task',
        priority: 'medium',
        status: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subTasks: [],
        boardId: testBoardId
      })

      const tasks = useBoardStore.getState().tasks
      expect(tasks.length).to.equal(initialCount + 1)
      
      const addedTask = tasks.find(t => t.title === 'New Task')
      expect(addedTask).to.not.equal(undefined)
      expect(addedTask?.title).to.equal('New Task')
    })

    it('updates a task', () => {
      const store = useBoardStore.getState()

      store.addTask({
        title: 'Task to Update ' + Date.now(),
        priority: 'low',
        status: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subTasks: [],
        boardId: testBoardId
      })

      const task = useBoardStore.getState().tasks.find(t => t.title.startsWith('Task to Update'))
      expect(task).to.not.equal(undefined)
      const taskId = task!.id

      store.updateTask(taskId, { 
        title: 'Updated Task',
        priority: 'high'
      })

      const updatedTask = useBoardStore.getState().tasks.find(t => t.id === taskId)
      expect(updatedTask?.title).to.equal('Updated Task')
      expect(updatedTask?.priority).to.equal('high')
    })

    it('deletes a task', () => {
      const store = useBoardStore.getState()

      store.addTask({
        title: 'Task to Delete ' + Date.now(),
        priority: 'medium',
        status: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subTasks: [],
        boardId: testBoardId
      })

      const task = useBoardStore.getState().tasks.find(t => t.title.startsWith('Task to Delete'))
      expect(task).to.not.equal(undefined)
      const taskId = task!.id
      const initialCount = useBoardStore.getState().tasks.length

      store.deleteTask(taskId)

      expect(useBoardStore.getState().tasks.length).to.equal(initialCount - 1)
    })

    it('moves task to different status', () => {
      const store = useBoardStore.getState()

      store.addTask({
        title: 'Task to Move ' + Date.now(),
        priority: 'medium',
        status: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subTasks: [],
        boardId: testBoardId
      })

      const task = useBoardStore.getState().tasks.find(t => t.title.startsWith('Task to Move'))
      expect(task).to.not.equal(undefined)
      const taskId = task!.id

      store.moveTask(taskId, 'inProgress')

      const movedTask = useBoardStore.getState().tasks.find(t => t.id === taskId)
      expect(movedTask?.status).to.equal('inProgress')
    })

    it('gets tasks by board', () => {
      const store = useBoardStore.getState()

      // Add another board
      store.addBoard({
        name: 'Another Board ' + Date.now(),
        description: 'Test',
        tasksCount: { total: 0, completed: 0, inProgress: 0 }
      })
      const anotherBoard = useBoardStore.getState().boards.find(b => b.name.startsWith('Another Board'))
      const anotherBoardId = anotherBoard!.id

      // Add tasks to different boards
      store.addTask({
        title: 'Task 1 ' + Date.now(),
        priority: 'low',
        status: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subTasks: [],
        boardId: testBoardId
      })

      store.addTask({
        title: 'Task 2 ' + Date.now(),
        priority: 'medium',
        status: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subTasks: [],
        boardId: anotherBoardId
      })

      const board1Tasks = store.getTasksByBoard(testBoardId)
      const board2Tasks = store.getTasksByBoard(anotherBoardId)

      // Should have at least the tasks we just added
      expect(board1Tasks.find(t => t.title.startsWith('Task 1'))).to.not.equal(undefined)
      expect(board2Tasks.find(t => t.title.startsWith('Task 2'))).to.not.equal(undefined)
    })

    it('gets tasks by status', () => {
      const store = useBoardStore.getState()

      store.addTask({
        title: 'Todo Task ' + Date.now(),
        priority: 'low',
        status: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subTasks: [],
        boardId: testBoardId
      })

      store.addTask({
        title: 'In Progress Task ' + Date.now(),
        priority: 'medium',
        status: 'inProgress',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subTasks: [],
        boardId: testBoardId
      })

      const todoTasks = store.getTasksByStatus(testBoardId, 'todo')
      const inProgressTasks = store.getTasksByStatus(testBoardId, 'inProgress')

      expect(todoTasks.find(t => t.title.startsWith('Todo Task'))).to.not.equal(undefined)
      expect(inProgressTasks.find(t => t.title.startsWith('In Progress Task'))).to.not.equal(undefined)
    })
  })

  describe('SubTask Actions', () => {
    let testBoardId: string
    let testTaskId: string

    beforeEach(() => {
      // Reset store to clean state before each test
      useBoardStore.getState().resetStore()
      
      const store = useBoardStore.getState()
      store.addBoard({
        name: 'SubTask Test Board ' + Date.now(),
        description: 'For subtask testing',
        tasksCount: { total: 0, completed: 0, inProgress: 0 }
      })

      const board = useBoardStore.getState().boards.find(b => b.description === 'For subtask testing')
      testBoardId = board!.id

      store.addTask({
        title: 'Parent Task ' + Date.now(),
        priority: 'medium',
        status: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subTasks: [],
        boardId: testBoardId
      })

      const task = useBoardStore.getState().tasks.find(t => t.title.startsWith('Parent Task'))
      testTaskId = task!.id
    })

    it('adds a subtask to a task', () => {
      const store = useBoardStore.getState()
      
      // Get initial count
      const initialTask = useBoardStore.getState().tasks.find(t => t.id === testTaskId)
      const initialCount = initialTask?.subTasks.length || 0

      store.addSubTask(testTaskId, 'New SubTask')

      const task = useBoardStore.getState().tasks.find(t => t.id === testTaskId)
      expect(task?.subTasks.length).to.equal(initialCount + 1)
      
      // Find the subtask we just added
      const newSubTask = task?.subTasks.find(st => st.title === 'New SubTask')
      expect(newSubTask).to.not.equal(undefined)
      expect(newSubTask?.completed).to.equal(false)
    })

    it('toggles subtask completion', () => {
      const store = useBoardStore.getState()

      store.addSubTask(testTaskId, 'SubTask to Toggle')
      
      // Find the subtask we just added
      let task = useBoardStore.getState().tasks.find(t => t.id === testTaskId)
      const subTask = task?.subTasks.find(st => st.title === 'SubTask to Toggle')
      expect(subTask).to.not.equal(undefined)
      const subTaskId = subTask!.id

      // Toggle to completed
      store.toggleSubTask(testTaskId, subTaskId)
      task = useBoardStore.getState().tasks.find(t => t.id === testTaskId)
      const toggledSubTask = task?.subTasks.find(st => st.id === subTaskId)
      expect(toggledSubTask?.completed).to.equal(true)

      // Toggle back to incomplete
      store.toggleSubTask(testTaskId, subTaskId)
      task = useBoardStore.getState().tasks.find(t => t.id === testTaskId)
      const reToggledSubTask = task?.subTasks.find(st => st.id === subTaskId)
      expect(reToggledSubTask?.completed).to.equal(false)
    })

    it('deletes a subtask', () => {
      const store = useBoardStore.getState()

      // Get initial count
      const initialTask = useBoardStore.getState().tasks.find(t => t.id === testTaskId)
      const initialCount = initialTask?.subTasks.length || 0

      const uniqueId = Date.now()
      store.addSubTask(testTaskId, `SubTask 1 ${uniqueId}`)
      store.addSubTask(testTaskId, `SubTask 2 ${uniqueId}`)

      // Should have 2 more subtasks
      let task = useBoardStore.getState().tasks.find(t => t.id === testTaskId)
      expect(task?.subTasks.length).to.equal(initialCount + 2)

      // Find SubTask 1 and delete it
      const subTask1 = task?.subTasks.find(st => st.title === `SubTask 1 ${uniqueId}`)
      expect(subTask1).to.not.equal(undefined)
      const subTaskId = subTask1!.id

      store.deleteSubTask(testTaskId, subTaskId)

      // Should have 1 more than initial (SubTask 2 remains)
      task = useBoardStore.getState().tasks.find(t => t.id === testTaskId)
      expect(task?.subTasks.length).to.equal(initialCount + 1)
      
      // SubTask 2 should still exist
      expect(task?.subTasks.find(st => st.title === `SubTask 2 ${uniqueId}`)).to.not.equal(undefined)
      // SubTask 1 should be gone
      expect(task?.subTasks.find(st => st.title === `SubTask 1 ${uniqueId}`)).to.equal(undefined)
    })
  })

  describe('Column Actions', () => {
    let testBoardId: string

    beforeEach(() => {
      // Reset store to clean state before each test
      useBoardStore.getState().resetStore()
      
      const store = useBoardStore.getState()
      store.addBoard({
        name: 'Column Test Board ' + Date.now(),
        description: 'For column testing',
        tasksCount: { total: 0, completed: 0, inProgress: 0 }
      })
      const board = useBoardStore.getState().boards.find(b => b.description === 'For column testing')
      testBoardId = board!.id
    })

    it('adds a new column', () => {
      const store = useBoardStore.getState()
      const initialCount = store.columns.length

      store.addColumn({
        title: 'New Column ' + Date.now(),
        status: 'new',
        color: '#FF0000',
        isFixed: false,
        boardId: testBoardId
      })

      const columns = useBoardStore.getState().columns
      expect(columns.length).to.equal(initialCount + 1)
    })

    it('updates a column', () => {
      const store = useBoardStore.getState()

      store.addColumn({
        title: 'Column to Update ' + Date.now(),
        status: 'test',
        color: '#FF0000',
        isFixed: false,
        boardId: testBoardId
      })

      const column = useBoardStore.getState().columns.find(c => c.title.startsWith('Column to Update'))
      expect(column).to.not.equal(undefined)
      const columnId = column!.id

      store.updateColumn(columnId, { title: 'Updated Column', color: '#00FF00' })

      const updatedColumn = useBoardStore.getState().columns.find(c => c.id === columnId)
      expect(updatedColumn?.title).to.equal('Updated Column')
      expect(updatedColumn?.color).to.equal('#00FF00')
    })

    it('deletes a column', () => {
      const store = useBoardStore.getState()

      store.addColumn({
        title: 'Column to Delete ' + Date.now(),
        status: 'delete',
        color: '#FF0000',
        isFixed: false,
        boardId: testBoardId
      })

      const column = useBoardStore.getState().columns.find(c => c.title.startsWith('Column to Delete'))
      expect(column).to.not.equal(undefined)
      const columnId = column!.id
      const initialCount = useBoardStore.getState().columns.length

      store.deleteColumn(columnId)

      expect(useBoardStore.getState().columns.length).to.equal(initialCount - 1)
    })

    it('gets columns by board', () => {
      const store = useBoardStore.getState()

      store.addColumn({
        title: 'Column 1 ' + Date.now(),
        status: 'col1',
        color: '#FF0000',
        isFixed: false,
        boardId: testBoardId
      })

      const columns = store.getColumnsByBoard(testBoardId)
      expect(columns.length).to.be.greaterThan(0)
    })
  })

  describe('Tag Actions', () => {
    beforeEach(() => {
      // Reset store to clean state before each test
      useBoardStore.getState().resetStore()
    })

    it('adds a new tag', () => {
      const store = useBoardStore.getState()
      const initialCount = store.tags.length

      store.addTag({
        name: 'Bug ' + Date.now(),
        color: '#FF0000'
      })

      const tags = useBoardStore.getState().tags
      expect(tags.length).to.equal(initialCount + 1)
      
      const addedTag = tags.find(t => t.name.startsWith('Bug'))
      expect(addedTag).to.not.equal(undefined)
    })

    it('updates a tag', () => {
      const store = useBoardStore.getState()

      store.addTag({
        name: 'Feature ' + Date.now(),
        color: '#00FF00'
      })

      const tag = useBoardStore.getState().tags.find(t => t.name.startsWith('Feature'))
      expect(tag).to.not.equal(undefined)
      const tagId = tag!.id

      store.updateTag(tagId, { name: 'Enhancement', color: '#0000FF' })

      const updatedTag = store.getTagById(tagId)
      expect(updatedTag?.name).to.equal('Enhancement')
      expect(updatedTag?.color).to.equal('#0000FF')
    })

    it('deletes a tag', () => {
      const store = useBoardStore.getState()

      store.addTag({
        name: 'Tag to Delete ' + Date.now(),
        color: '#FF0000'
      })

      const tag = useBoardStore.getState().tags.find(t => t.name.startsWith('Tag to Delete'))
      expect(tag).to.not.equal(undefined)
      const tagId = tag!.id
      const initialCount = useBoardStore.getState().tags.length

      store.deleteTag(tagId)

      expect(useBoardStore.getState().tags.length).to.equal(initialCount - 1)
      expect(store.getTagById(tagId)).to.equal(undefined)
    })

    it('gets tag by ID', () => {
      const store = useBoardStore.getState()

      store.addTag({
        name: 'Findable Tag ' + Date.now(),
        color: '#FF00FF'
      })

      const tag = useBoardStore.getState().tags.find(t => t.name.startsWith('Findable Tag'))
      expect(tag).to.not.equal(undefined)
      const tagId = tag!.id
      const foundTag = store.getTagById(tagId)

      expect(foundTag).to.not.equal(undefined)
      expect(foundTag?.name).to.equal(tag!.name)
    })
  })
})
