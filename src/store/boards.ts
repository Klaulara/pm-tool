import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Board } from '../types/store';
import { useUIStore } from './ui';

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
  name: 'Desarrollo Task Manager System',
  description: 'Frontend para sistema de gestion de tareas',
  tasksCount: { total: 4, completed: 1, inProgress: 1 },
  lastUpdated: new Date().toISOString(),
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
          const newBoard: Board = {
            ...boardData,
            id: `board-${Date.now()}`,
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
                    total: board.tasksCount.total + (delta.total || 0),
                    completed: board.tasksCount.completed + (delta.completed || 0),
                    inProgress: board.tasksCount.inProgress + (delta.inProgress || 0),
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
    }
  )
);
