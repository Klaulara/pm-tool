import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Board, Task, Column } from '../types/store';
import { useUIStore } from './ui';
import { initialTasks, calculateTaskCounts } from './tasks';
import { useColumnStore } from './columns';

// Normalized state structure
interface NormalizedBoards {
  byId: Record<string, Board>;
  allIds: string[];
}

interface BoardState {
  boards: NormalizedBoards;
}

interface BoardActions {
  addBoard: (board: Omit<Board, 'id' | 'lastUpdated'>) => void;
  updateBoard: (id: string, board: Partial<Board>) => void;
  deleteBoard: (id: string) => void;
  toggleStarBoard: (id: string) => void;
  getBoardById: (id: string) => Board | undefined;
  getAllBoards: () => Board[];
  updateBoardTaskCount: (
    boardId: string,
    delta: { total?: number; completed?: number; inProgress?: number }
  ) => void;
}

type BoardStore = BoardState & BoardActions;

// Initial data
const initialBoard: Board = {
  id: '1',
  name: 'Task Management System',
  description: 'Frontend project management tool',
  tasksCount: calculateTaskCounts(initialTasks.filter(t => t.boardId === '1')),
  lastUpdated: '2024-12-08T12:00:00Z',
  isStarred: true,
};

// Normalize initial data
const initialBoardsNormalized: NormalizedBoards = {
  byId: { '1': initialBoard },
  allIds: ['1'],
};

export const useBoardStore = create<BoardStore>()(
  persist(
    (set, get) => ({
      // State
      boards: initialBoardsNormalized,

      // Actions
      addBoard: (boardData) => {
        const loadingKey = 'addBoard';
        useUIStore.getState().setLoading(loadingKey, true);
        
        try {
          // Get next board number
          const existingBoardIds = get().boards.allIds;
          const boardNumbers = existingBoardIds
            .map(id => parseInt(id.split('-')[1]))
            .filter(num => !isNaN(num));
          const nextBoardNumber = boardNumbers.length > 0 ? Math.max(...boardNumbers) + 1 : 1;
          const newBoardId = `board-${nextBoardNumber}`;

          const newBoard: Board = {
            ...boardData,
            id: newBoardId,
            lastUpdated: new Date().toISOString(),
            tasksCount: boardData.tasksCount || {
              total: 0,
              completed: 0,
              inProgress: 0,
            },
          };
          
          set((state) => ({
            boards: {
              byId: { ...state.boards.byId, [newBoard.id]: newBoard },
              allIds: [...state.boards.allIds, newBoard.id],
            },
          }));

          // Create default columns for the new board
          const defaultColumns = [
            {
              title: 'To Do',
              status: 'todo',
              color: '#3B82F6',
              isFixed: true,
              boardId: newBoard.id,
            },
            {
              title: 'In Progress',
              status: 'inProgress',
              color: '#F59E0B',
              isFixed: true,
              boardId: newBoard.id,
            },
            {
              title: 'Done',
              status: 'done',
              color: '#10B981',
              isFixed: true,
              boardId: newBoard.id,
            },
          ];

          defaultColumns.forEach((column) => {
            useColumnStore.getState().addColumn(column);
          });

          useUIStore.getState().addToast({
            type: 'success',
            message: `Board "${newBoard.name}" created successfully`,
          });
        } catch {
          useUIStore.getState().setError(loadingKey, 'Failed to create board');
        } finally {
          useUIStore.getState().setLoading(loadingKey, false);
        }
      },

      updateBoard: (id, boardData) => {
        const loadingKey = `updateBoard-${id}`;
        useUIStore.getState().setLoading(loadingKey, true);

        try {
          const board = get().boards.byId[id];
          if (!board) {
            throw new Error('Board not found');
          }

          set((state) => ({
            boards: {
              ...state.boards,
              byId: {
                ...state.boards.byId,
                [id]: {
                  ...board,
                  ...boardData,
                  lastUpdated: new Date().toISOString(),
                },
              },
            },
          }));

          useUIStore.getState().addToast({
            type: 'success',
            message: 'Board updated successfully',
          });
        } catch {
          useUIStore.getState().setError(loadingKey, 'Failed to update board');
        } finally {
          useUIStore.getState().setLoading(loadingKey, false);
        }
      },

      deleteBoard: (id) => {
        const loadingKey = `deleteBoard-${id}`;
        useUIStore.getState().setLoading(loadingKey, true);

        try {
          const board = get().boards.byId[id];
          if (!board) {
            throw new Error('Board not found');
          }

          // Delete all tasks associated with this board
          import('./tasks').then(({ useTaskStore }) => {
            const tasksToDelete = useTaskStore.getState().tasks.filter(
              (task: Task) => task.boardId === id
            );
            tasksToDelete.forEach((task: Task) => {
              useTaskStore.getState().deleteTask(task.id);
            });
          });

          // Delete all columns associated with this board
          const columnsToDelete = useColumnStore.getState().columns.filter(
            (column: Column) => column.boardId === id
          );
          columnsToDelete.forEach((column: Column) => {
            useColumnStore.getState().deleteColumn(column.id);
          });

          set((state) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [id]: _removed, ...remainingBoards } = state.boards.byId;
            return {
              boards: {
                byId: remainingBoards,
                allIds: state.boards.allIds.filter((boardId) => boardId !== id),
              },
            };
          });

          useUIStore.getState().addToast({
            type: 'success',
            message: `Board "${board.name}" deleted`,
          });
        } catch {
          useUIStore.getState().setError(loadingKey, 'Failed to delete board');
        } finally {
          useUIStore.getState().setLoading(loadingKey, false);
        }
      },

      toggleStarBoard: (id) => {
        try {
          const board = get().boards.byId[id];
          if (!board) return;

          set((state) => ({
            boards: {
              ...state.boards,
              byId: {
                ...state.boards.byId,
                [id]: {
                  ...board,
                  isStarred: !board.isStarred,
                },
              },
            },
          }));
        } catch {
          useUIStore.getState().setError('toggleStar', 'Failed to update board');
        }
      },

      getBoardById: (id) => {
        return get().boards.byId[id]; // O(1) lookup!
      },

      // Selector: returns array of all boards
      // Note: This creates a new array reference each time.
      // Components should use this with useMemo or selective subscriptions
      getAllBoards: () => {
        const { byId, allIds } = get().boards;
        return allIds.map((id) => byId[id]);
      },

      updateBoardTaskCount: (boardId, delta) => {
        try {
          const board = get().boards.byId[boardId];
          if (!board) return;

          set((state) => ({
            boards: {
              ...state.boards,
              byId: {
                ...state.boards.byId,
                [boardId]: {
                  ...board,
                  tasksCount: {
                    total: Math.max(0, board.tasksCount.total + (delta.total || 0)),
                    completed: Math.max(0, board.tasksCount.completed + (delta.completed || 0)),
                    inProgress: Math.max(0, board.tasksCount.inProgress + (delta.inProgress || 0)),
                  },
                  lastUpdated: new Date().toISOString(),
                },
              },
            },
          }));
        } catch (error) {
          console.error('Failed to update board task count:', error);
        }
      },
    }),
    {
      name: 'board-storage',
      onRehydrateStorage: () => (state) => {
        // Recalcular contadores cuando se carga el estado desde localStorage
        if (state) {
          // Importar dinámicamente el store de tasks para evitar dependencia circular
          import('./tasks').then(({ useTaskStore, calculateTaskCounts }) => {
            const tasks = useTaskStore.getState().tasks;
            
            const updatedBoards: NormalizedBoards = {
              byId: {},
              allIds: state.boards.allIds
            };
            
            state.boards.allIds.forEach(boardId => {
              const board = state.boards.byId[boardId];
              if (board) {
                const boardTasks = tasks.filter(t => t.boardId === boardId);
                updatedBoards.byId[boardId] = {
                  ...board,
                  tasksCount: calculateTaskCounts(boardTasks)
                };
              }
            });
            
            state.boards = updatedBoards;
          });
        }
      }
    }
  )
);
