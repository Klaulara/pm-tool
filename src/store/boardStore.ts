import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface Column {
    id: string;
    title: string;
    status: string;
    color: string;
    order: number;
    isFixed: boolean;
    boardId: string;
}

export interface SubTask {
    id: string;
    title: string;
    completed: boolean;
    createdAt: string;
}

export interface Tags {
    id: string;
    name: string;
    color: string;
}

export interface Board {
    id: string;
    name: string;
    description: string;
    tasksCount: {
        total: number;
        completed: number;
        inProgress: number;
    };
    lastUpdated: string;
    isStarred?: boolean;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    dueDate?: string;
    tags?: Tags[];
    status: string;
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
    subTasks: SubTask[];
    stimatedTime?: number;
    boardId: string;
}

interface BoardStore {
    boards: Board[];
    tasks: Task[];
    columns: Column[];

    // Board actions
    addBoard: (board: Omit<Board, 'id' | 'lastUpdated'>) => void;
    updateBoard: (id: string, board: Partial<Board>) => void;
    deleteBoard: (id: string) => void;
    toggleStarBoard: (id: string) => void;

    // Task actions
    addTask: (task: Omit<Task, 'id'>) => void;
    updateTask: (id: string, task: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    moveTask: (taskId: string, newStatus: Task['status']) => void;

    // Column actions
    addColumn: (columnData: Omit<Column, 'id' | 'order'>) => void;
    updateColumn: (id: string, columnData: Partial<Column>) => void;
    deleteColumn: (id: string) => void;
    reorderColumns: (boardId: string, columnIds: string[]) => void;

    // SubTask actions
    addSubTask: (taskId: string, title: string) => void;
    toggleSubTask: (taskId: string, subTaskId: string) => void;
    deleteSubTask: (taskId: string, subTaskId: string) => void;

    // Getters
    getBoardById: (id: string) => Board | undefined;
    getTasksByBoard: (boardId: string) => Task[];
    getTasksByStatus: (boardId: string, status: Task['status']) => Task[];
    getColumnsByBoard: (boardId: string) => Column[];
}

// Initial data
const initialBoards: Board[] = [
    {
        id: '1',
        name: 'Desarrollo Task Manager System',
        description: 'Frontend para sistema de gestion de tareas',
        tasksCount: { total: 12, completed: 5, inProgress: 4 },
        lastUpdated: new Date().toISOString(),
        isStarred: true,
    }
];
const initialTasks: Task[] = [
    {
        id: 'task-1',
        title: 'Implementar persistencia de datos',
        description: 'Usar localStorage para guardar el estado de la aplicacion',
        priority: 'high',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subTasks: [],
        boardId: '1',
    },
    {
        id: 'task-2',
        title: 'Diseñar interfaz de usuario',
        description: 'Crear wireframes y mockups para la aplicacion',
        priority: 'medium',
        status: 'in-progress',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subTasks: [],
        boardId: '1',
    },
    {
        id: 'task-3',
        title: 'Configurar entorno de desarrollo',
        description: 'Instalar dependencias y configurar herramientas necesarias',
        priority: 'low',
        status: 'done',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subTasks: [
            {
                id: 'subtask-1',
                title: 'Instalar dependencias',
                completed: true,
                createdAt: new Date().toISOString(),
            },
            {
                id: 'subtask-2',
                title: 'Configurar linter',
                completed: true,
                createdAt: new Date().toISOString(),
            },
            {
                id: 'subtask-3',
                title: 'Configurar zustand',
                completed: false,
                createdAt: new Date().toISOString(),
            }
        ],
        boardId: '1',
    }
];
const initialColumns: Column[] = [
    {
        id: 'col-1',
        title: 'To Do',
        status: 'todo',
        color: '#FF5733',
        order: 1,
        isFixed: true,
        boardId: 'board-1',
    },
    {
        id: 'col-2',
        title: 'In Progress',
        status: 'in-progress',
        color: '#33C3FF',
        order: 2,
        isFixed: false,
        boardId: 'board-1',
    },
    {
        id: 'col-3',
        title: 'Done',
        status: 'done',
        color: '#28A745',
        order: 3,
        isFixed: false,
        boardId: 'board-1',
    }
];

export const useBoardStore = create<BoardStore>()(
  persist(
    (set, get) => ({
      // Initial state
      boards: initialBoards,
      tasks: initialTasks,
      columns: initialColumns,

      // Board actions
      addBoard: (boardData) => {
        const newBoard: Board = {
          ...boardData,
          id: Date.now().toString(),
          lastUpdated: new Date().toISOString().split('T')[0],
          tasksCount: {
            total: 0,
            completed: 0,
            inProgress: 0,
          },
        };
        
        // Crear las 3 columnas fijas por defecto para el nuevo board
        const defaultColumns: Column[] = [
          {
            id: `col-${newBoard.id}-todo`,
            title: 'Por Hacer',
            status: 'todo',
            color: '#3B82F6',
            order: 0,
            isFixed: true,
            boardId: newBoard.id,
          },
          {
            id: `col-${newBoard.id}-inProgress`,
            title: 'En Progreso',
            status: 'inProgress',
            color: '#F59E0B',
            order: 1,
            isFixed: true,
            boardId: newBoard.id,
          },
          {
            id: `col-${newBoard.id}-done`,
            title: 'Completado',
            status: 'done',
            color: '#10B981',
            order: 2,
            isFixed: true,
            boardId: newBoard.id,
          },
        ];
        
        set((state) => ({
          boards: [...state.boards, newBoard],
          columns: [...state.columns, ...defaultColumns],
        }));
      },

      updateBoard: (id, boardData) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === id
              ? {
                  ...board,
                  ...boardData,
                  lastUpdated: new Date().toISOString().split('T')[0],
                }
              : board
          ),
        }));
      },

      deleteBoard: (id) => {
        set((state) => ({
          boards: state.boards.filter((board) => board.id !== id),
          tasks: state.tasks.filter((task) => task.boardId !== id),
        }));
      },

      toggleStarBoard: (id) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === id ? { ...board, isStarred: !board.isStarred } : board
          ),
        }));
      },

      // Task actions
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: Date.now().toString(),
        };
        
        set((state) => {
          const updatedTasks = [...state.tasks, newTask];
          const board = state.boards.find((b) => b.id === taskData.boardId);
          
          if (board) {
            const boardTasks = updatedTasks.filter((t) => t.boardId === taskData.boardId);
            const updatedBoards = state.boards.map((b) =>
              b.id === taskData.boardId
                ? {
                    ...b,
                    tasksCount: {
                      total: boardTasks.length,
                      completed: boardTasks.filter((t) => t.status === 'done').length,
                      inProgress: boardTasks.filter((t) => t.status === 'inProgress').length,
                    },
                    lastUpdated: new Date().toISOString().split('T')[0],
                  }
                : b
            );
            
            return {
              tasks: updatedTasks,
              boards: updatedBoards,
            };
          }
          
          return { tasks: updatedTasks };
        });
      },

      updateTask: (id, taskData) => {
        set((state) => {
          const updatedTasks = state.tasks.map((task) =>
            task.id === id ? { ...task, ...taskData } : task
          );
          
          const task = state.tasks.find((t) => t.id === id);
          if (task) {
            const boardTasks = updatedTasks.filter((t) => t.boardId === task.boardId);
            const updatedBoards = state.boards.map((b) =>
              b.id === task.boardId
                ? {
                    ...b,
                    tasksCount: {
                      total: boardTasks.length,
                      completed: boardTasks.filter((t) => t.status === 'done').length,
                      inProgress: boardTasks.filter((t) => t.status === 'inProgress').length,
                    },
                    lastUpdated: new Date().toISOString().split('T')[0],
                  }
                : b
            );
            
            return {
              tasks: updatedTasks,
              boards: updatedBoards,
            };
          }
          
          return { tasks: updatedTasks };
        });
      },

      deleteTask: (id) => {
        set((state) => {
          const task = state.tasks.find((t) => t.id === id);
          const updatedTasks = state.tasks.filter((t) => t.id !== id);
          
          if (task) {
            const boardTasks = updatedTasks.filter((t) => t.boardId === task.boardId);
            const updatedBoards = state.boards.map((b) =>
              b.id === task.boardId
                ? {
                    ...b,
                    tasksCount: {
                      total: boardTasks.length,
                      completed: boardTasks.filter((t) => t.status === 'done').length,
                      inProgress: boardTasks.filter((t) => t.status === 'inProgress').length,
                    },
                    lastUpdated: new Date().toISOString().split('T')[0],
                  }
                : b
            );
            
            return {
              tasks: updatedTasks,
              boards: updatedBoards,
            };
          }
          
          return { tasks: updatedTasks };
        });
      },

      moveTask: (taskId, newStatus) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
              : task
          ),
        }));
      },

      // Column actions
      addColumn: (columnData) => {
        const boardColumns = get().columns.filter((col) => col.boardId === columnData.boardId);
        const newColumn: Column = {
          ...columnData,
          id: `col-${Date.now()}`,
          order: boardColumns.length, // Agregar al final
        };
        set((state) => ({
          columns: [...state.columns, newColumn],
        }));
      },

      updateColumn: (id, columnData) => {
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === id ? { ...col, ...columnData } : col
          ),
        }));
      },

      deleteColumn: (id) => {
        const column = get().columns.find((col) => col.id === id);
        
        // No permitir eliminar columnas fijas
        if (column?.isFixed) {
          console.warn('No se pueden eliminar columnas fijas');
          return;
        }
        
        set((state) => ({
          columns: state.columns.filter((col) => col.id !== id),
          // Mover tareas de esta columna a 'todo' por defecto
          tasks: state.tasks.map((task) =>
            task.status === column?.status ? { ...task, status: 'todo' } : task
          ),
        }));
      },

      reorderColumns: (boardId, columnIds) => {
        set((state) => ({
          columns: state.columns.map((col) => {
            if (col.boardId !== boardId) return col;
            const newOrder = columnIds.indexOf(col.id);
            return newOrder >= 0 ? { ...col, order: newOrder } : col;
          }),
        }));
      },

      // SubTask actions
      addSubTask: (taskId, title) => {
        const newSubTask: SubTask = {
          id: `sub-${Date.now()}`,
          title,
          completed: false,
          createdAt: new Date().toISOString().split('T')[0],
        };
        
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, subTasks: [...task.subTasks, newSubTask] }
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
                  subTasks: task.subTasks.map((sub) =>
                    sub.id === subTaskId ? { ...sub, completed: !sub.completed } : sub
                  ),
                }
              : task
          ),
        }));
      },

      deleteSubTask: (taskId, subTaskId) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, subTasks: task.subTasks.filter((sub) => sub.id !== subTaskId) }
              : task
          ),
        }));
      },

      // Getters
      getBoardById: (id) => {
        return get().boards.find((board) => board.id === id);
      },

      getTasksByBoard: (boardId) => {
        return get().tasks.filter((task) => task.boardId === boardId);
      },

      getTasksByStatus: (boardId, status) => {
        return get().tasks.filter(
          (task) => task.boardId === boardId && task.status === status
        );
      },

      getColumnsByBoard: (boardId) => {
        return get().columns
          .filter((col) => col.boardId === boardId)
          .sort((a, b) => a.order - b.order);
      },
    }),
    {
      name: 'board-store', // nombre del item en el almacenamiento
    }
  )
);
