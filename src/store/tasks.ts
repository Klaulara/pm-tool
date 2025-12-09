import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, SubTask, TaskFilters } from '../types/store';
import { useBoardStore } from './boards';

interface TaskState {
  tasks: Task[];
}

interface TaskActions {
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: Task['status']) => void;
  reorderTasks: (boardId: string, status: Task['status'], taskIds: string[]) => void;
  addSubTask: (taskId: string, title: string) => void;
  toggleSubTask: (taskId: string, subTaskId: string) => void;
  deleteSubTask: (taskId: string, subTaskId: string) => void;
  getTasksByBoard: (boardId: string) => Task[];
  getTasksByStatus: (boardId: string, status: Task['status']) => Task[];
  getAllTasks: () => Task[];
  searchAndFilterTasks: (filters: TaskFilters) => Task[];
}

type TaskStore = TaskState & TaskActions;

// Helper function to calculate task counts for a board
export const calculateTaskCounts = (boardTasks: Task[]) => {
  const total = boardTasks.filter((t) => t.status !== 'archive').length;
  const completed = boardTasks.filter((t) => t.status === 'done').length;
  const inProgress = boardTasks.filter((t) => 
    t.status !== 'todo' && 
    t.status !== 'done' && 
    t.status !== 'archive'
  ).length;
  
  return { total, completed, inProgress };
};

// Helper function to determine if a status counts as "inProgress"
const isInProgressStatus = (status: Task['status']) => {
  return status !== 'todo' && status !== 'done' && status !== 'archive';
};

// Helper function to calculate delta when status changes
const calculateStatusDelta = (oldStatus: Task['status'], newStatus: Task['status']) => {
  const delta: { total?: number; completed?: number; inProgress?: number } = {};
  
  // Handle archive status changes
  if (oldStatus === 'archive' && newStatus !== 'archive') {
    delta.total = 1;
  } else if (oldStatus !== 'archive' && newStatus === 'archive') {
    delta.total = -1;
  }
  
  // Handle completed status changes
  if (oldStatus === 'done' && newStatus !== 'done') {
    delta.completed = -1;
  } else if (oldStatus !== 'done' && newStatus === 'done') {
    delta.completed = 1;
  }
  
  // Handle inProgress status changes
  const wasInProgress = isInProgressStatus(oldStatus);
  const isNowInProgress = isInProgressStatus(newStatus);
  
  if (wasInProgress && !isNowInProgress) {
    delta.inProgress = -1;
  } else if (!wasInProgress && isNowInProgress) {
    delta.inProgress = 1;
  }
  
  return delta;
};


// Initial data
export const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Implement localStorage persistence',
    description: 'Use localStorage to save the application state',
    priority: 'high',
    dueDate: '2025-12-10T23:59:59.000Z',
    status: 'todo',
    createdAt: '2025-12-01T10:00:00.000Z',
    updatedAt: '2025-12-08T10:00:00.000Z',
    subTasks: [],
    boardId: '1',
  },
  {
    id: 'task-2',
    title: 'Design user interface',
    description: 'Create wireframes and mockups for the application',
    priority: 'medium',
    status: 'inProgress',
    createdAt: '2025-12-01T10:00:00.000Z',
    updatedAt: '2025-12-07T10:00:00.000Z',
    subTasks: [],
    boardId: '1',
  },
  {
    id: 'task-3',
    title: 'Set up development environment',
    description: 'Install dependencies and configure necessary tools',
    priority: 'low',
    status: 'done',
    createdAt: '2025-12-01T10:00:00.000Z',
    updatedAt: '2025-12-07T10:00:00.000Z',
    completedAt: '2025-12-07T10:00:00.000Z',
    subTasks: [
      {
        id: 'subtask-1',
        title: 'Instalar dependencias',
        completed: true,
         createdAt: '2025-12-01T10:00:00.000Z',
      },
      {
        id: 'subtask-2',
        title: 'Configurar linter',
        completed: true,
         createdAt: '2025-12-01T10:00:00.000Z',
      },
      {
        id: 'subtask-3',
        title: 'Configurar zustand',
        completed: true,
        createdAt: '2025-12-01T10:00:00.000Z',
      },
    ],
    boardId: '1',
  },
  {
    id: 'task-4',
    title: 'Write documentation',
    description: 'Create documentation for the use and development of the project',
    priority: 'urgent',
    status: 'todo',
    createdAt: '2025-12-01T10:00:00.000Z',
    updatedAt: '2025-12-08T10:00:00.000Z',
    subTasks: [],
    boardId: '1',
  },
  {
    id: 'task-5',
    title: 'Write unit tests',
    description: 'Write and run unit tests for the main components',
    priority: 'high',
    status: 'done',
    createdAt: '2025-12-01T10:00:00.000Z',
    updatedAt: '2025-12-07T10:00:00.000Z',
    completedAt: '2025-12-07T10:00:00.000Z',
    subTasks: [],
    boardId: '1',
  }
];

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      // State
      tasks: initialTasks,

      // Actions
      addTask: (taskData) => {
        // Get next task number
        const existingTasks = get().tasks;
        const taskNumbers = existingTasks
          .map(t => parseInt(t.id.split('-')[1]))
          .filter(num => !isNaN(num));
        const nextTaskNumber = taskNumbers.length > 0 ? Math.max(...taskNumbers) + 1 : 1;

        const newTask: Task = {
          ...taskData,
          id: `task-${nextTaskNumber}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          subTasks: taskData.subTasks || [],
        };

        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));

        // Update board task count
        const updateBoardTaskCount = useBoardStore.getState().updateBoardTaskCount;
        updateBoardTaskCount(newTask.boardId, { total: 1 });
      },

      updateTask: (id, taskData) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task) return;

        const oldStatus = task.status;
        const newStatus = taskData.status;
        const now = new Date().toISOString();

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  ...taskData,
                  updatedAt: now,
                  completedAt: newStatus === 'done' ? now : t.completedAt,
                  statusHistory:
                    newStatus && newStatus !== oldStatus
                      ? [
                          ...(t.statusHistory || []),
                          { status: newStatus, timestamp: now },
                        ]
                      : t.statusHistory || [],
                }
              : t
          ),
        }));

        // Update board counts if status changed
        if (newStatus && newStatus !== oldStatus) {
          const delta = calculateStatusDelta(oldStatus, newStatus);
          const updateBoardTaskCount = useBoardStore.getState().updateBoardTaskCount;
          updateBoardTaskCount(task.boardId, delta);
        }
      },

      deleteTask: (id) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task) return;

        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));

        // Update board task count
        const updateBoardTaskCount = useBoardStore.getState().updateBoardTaskCount;
        updateBoardTaskCount(task.boardId, { total: -1 });
      },

      moveTask: (taskId, newStatus) => {
        const task = get().tasks.find((t) => t.id === taskId);
        if (!task) return;

        const oldStatus = task.status;
        const now = new Date().toISOString();

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status: newStatus,
                  updatedAt: now,
                  completedAt: newStatus === 'done' ? now : t.completedAt,
                  statusHistory: [
                    ...(t.statusHistory || []),
                    { status: newStatus, timestamp: now },
                  ],
                }
              : t
          ),
        }));

        // Update board counts
        const delta = calculateStatusDelta(oldStatus, newStatus);
        const updateBoardTaskCount = useBoardStore.getState().updateBoardTaskCount;
        updateBoardTaskCount(task.boardId, delta);
      },

      reorderTasks: (boardId, status, taskIds) => {
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.boardId !== boardId || task.status !== status) return task;
            const newOrder = taskIds.indexOf(task.id);
            return newOrder !== -1 ? { ...task, order: newOrder } : task;
          }),
        }));
      },

      addSubTask: (taskId, title) => {
        const newSubTask: SubTask = {
          id: `subtask-${Date.now()}`,
          title,
          completed: false,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subTasks: [...task.subTasks, newSubTask],
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        }));
      },

      toggleSubTask: (taskId, subTaskId) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subTasks: task.subTasks.map((st) =>
                    st.id === subTaskId ? { ...st, completed: !st.completed } : st
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        }));
      },

      deleteSubTask: (taskId, subTaskId) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subTasks: task.subTasks.filter((st) => st.id !== subTaskId),
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        }));
      },

      getTasksByBoard: (boardId) => {
        return get().tasks.filter((task) => task.boardId === boardId);
      },

      getTasksByStatus: (boardId, status) => {
        return get().tasks.filter(
          (task) => task.boardId === boardId && task.status === status
        );
      },

      getAllTasks: () => {
        return get().tasks;
      },

      searchAndFilterTasks: (filters) => {
        let filteredTasks = get().tasks;

        // Search by query (title and description)
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          filteredTasks = filteredTasks.filter(
            (task) =>
              task.title.toLowerCase().includes(query) ||
              task.description?.toLowerCase().includes(query)
          );
        }

        // Filter by board
        if (filters.boardId) {
          filteredTasks = filteredTasks.filter(
            (task) => task.boardId === filters.boardId
          );
        }

        // Filter by priority
        if (filters.priority) {
          filteredTasks = filteredTasks.filter(
            (task) => task.priority === filters.priority
          );
        }

        // Filter by tags
        if (filters.tagIds && filters.tagIds.length > 0) {
          filteredTasks = filteredTasks.filter((task) =>
            task.tags?.some((tag) => filters.tagIds?.includes(tag.id))
          );
        }

        // Filter by due date range
        if (filters.dueDateRange) {
          const { start, end } = filters.dueDateRange;
          filteredTasks = filteredTasks.filter((task) => {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate);
            if (start && new Date(start) > taskDate) return false;
            if (end && new Date(end) < taskDate) return false;
            return true;
          });
        }

        // Filter by assignee
        if (filters.assigneeId) {
          filteredTasks = filteredTasks.filter(
            (task) => task.assignee?.id === filters.assigneeId
          );
        }

        // Sort tasks
        const sortBy = filters.sortBy || 'createdAt';
        const sortDirection = filters.sortDirection || 'desc';

        filteredTasks.sort((a, b) => {
          let comparison = 0;

          switch (sortBy) {
            case 'title':
              comparison = a.title.localeCompare(b.title);
              break;
            case 'priority': {
              const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
              comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
              break;
            }
            case 'dueDate':
              if (!a.dueDate && !b.dueDate) comparison = 0;
              else if (!a.dueDate) comparison = 1;
              else if (!b.dueDate) comparison = -1;
              else
                comparison =
                  new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
              break;
            case 'createdAt':
            default:
              comparison =
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
              break;
          }

          return sortDirection === 'asc' ? comparison : -comparison;
        });

        return filteredTasks;
      },
    }),
    {
      name: 'task-storage',
    }
  )
);
