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

    // Board actions
    addBoard: (board: Omit<Board, 'id' | 'lastUpdated' | 'tasksCount'>) => void;
    updateBoard: (id: string, board: Partial<Board>) => void;
    deleteBoard: (id: string) => void;
    toggleStarBoard: (id: string) => void;

    // Task actions
    addTask: (task: Omit<Task, 'id'>) => void;
    updateTask: (id: string, task: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    moveTask: (taskId: string, newStatus: Task['status']) => void;

    // Getters
    getBoardById: (id: string) => Board | undefined;
    getTasksByBoard: (boardId: string) => Task[];
    getTasksByStatus: (boardId: string, status: Task['status']) => Task[];
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
            boards: initialBoards,
            tasks: initialTasks,
            columns: initialColumns,

            // Board actions
            addBoard: (board) => {
                const newBoard: Board = {
                    id: (Math.random() * 100000).toFixed(0),
                    lastUpdated: new Date().toISOString(),
                    tasksCount: { total: 0, completed: 0, inProgress: 0 },
                    ...board,
                };
                set((state) => ({ boards: [...state.boards, newBoard] }));
            },
            updateBoard: (id, board) => {
                set((state) => ({
                    boards: state.boards.map((b) => (b.id === id ? { ...b, ...board, lastUpdated: new Date().toISOString() } : b)),
                }));
            },
            deleteBoard: (id) => {
                set((state) => ({ boards: state.boards.filter((b) => b.id !== id) }));
            },
            toggleStarBoard: (id) => {
                set((state) => ({
                    boards: state.boards.map((b) => (b.id === id ? { ...b, isStarred: !b.isStarred } : b)),
                }));
            },  
            // Task actions
            addTask: (task) => {
                const newTask: Task = { 
                    id: (Math.random() * 100000).toFixed(0),
                    ...task 
                };
                set((state) => ({ tasks: [...state.tasks, newTask] }));
            },
            updateTask: (id, task) => {
                set((state) => ({
                    tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...task, updatedAt: new Date().toISOString() } : t)),
                }));
            },
            deleteTask: (id) => {
                set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
            },
            moveTask: (taskId, newStatus) => {
                set((state) => ({
                    tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t)),
                }));
            },
            // Getters
            getBoardById: (id) => {
                return get().boards.find((b) => b.id === id);
            },
            getTasksByBoard: (boardId) => {
                return get().tasks.filter((t) => t.boardId === boardId);
            },
            getTasksByStatus: (boardId, status) => {
                return get().tasks.filter((t) => t.boardId === boardId && t.status === status);
            }
        }),
        {
            name: 'board-store', // name of the item in the storage
        }
    )
);