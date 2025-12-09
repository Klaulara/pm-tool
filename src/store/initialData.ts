import type { Board, Task, Column, Tag } from '../types/store';

/**
 * Initial tasks for the default board
 */
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

/**
 * Initial columns for the default board
 */
export const initialColumns: Column[] = [
  {
    id: 'col-todo-1-board-1',
    title: 'To Do',
    status: 'todo',
    color: '#FF5733',
    order: 1,
    isFixed: true,
    boardId: '1',
  },
  {
    id: 'col-inProgress-2-board-1',
    title: 'In Progress',
    status: 'inProgress',
    color: '#33C3FF',
    order: 2,
    isFixed: true,
    boardId: '1',
  },
  {
    id: 'col-done-3-board-1',
    title: 'Done',
    status: 'done',
    color: '#28A745',
    order: 3,
    isFixed: true,
    boardId: '1',
  },
];

/**
 * Initial tags for task categorization
 */
export const initialTags: Tag[] = [
  { id: 'tag-1', name: 'Frontend', color: '#a74949' },
  { id: 'tag-2', name: 'Backend', color: '#5656c2' },
  { id: 'tag-3', name: 'Devops', color: '#5db65d' },
];

/**
 * Initial board data
 * Note: Task counts are calculated dynamically based on initialTasks
 */
export const initialBoards: Board[] = [
  {
    id: '1',
    name: 'Task Management System',
    description: 'Frontend project management tool',
    tasksCount: {
      total: 5,
      completed: 2,
      inProgress: 1,
    },
    lastUpdated: '2024-12-08T12:00:00Z',
    isStarred: true,
  },
];
