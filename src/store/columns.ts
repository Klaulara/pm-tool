import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Column } from '../types/store';

interface ColumnState {
  columns: Column[];
}

interface ColumnActions {
  addColumn: (columnData: Omit<Column, 'id' | 'order'>) => void;
  updateColumn: (id: string, columnData: Partial<Column>) => void;
  deleteColumn: (id: string) => void;
  reorderColumns: (boardId: string, columnIds: string[]) => void;
  getColumnsByBoard: (boardId: string) => Column[];
}

type ColumnStore = ColumnState & ColumnActions;

// Initial data
const initialColumns: Column[] = [
  {
    id: 'col-1',
    title: 'To Do',
    status: 'todo',
    color: '#FF5733',
    order: 1,
    isFixed: true,
    boardId: '1',
  },
  {
    id: 'col-2',
    title: 'In Progress',
    status: 'inProgress',
    color: '#33C3FF',
    order: 2,
    isFixed: true,
    boardId: '1',
  },
  {
    id: 'col-3',
    title: 'Done',
    status: 'done',
    color: '#28A745',
    order: 3,
    isFixed: true,
    boardId: '1',
  },
];

export const useColumnStore = create<ColumnStore>()(
  persist(
    (set, get) => ({
      // State
      columns: initialColumns,

      // Actions
      addColumn: (columnData) => {
        const boardColumns = get().columns.filter(
          (col) => col.boardId === columnData.boardId
        );
        const maxOrder = Math.max(...boardColumns.map((col) => col.order), 0);

        const newColumn: Column = {
          ...columnData,
          id: `col-${Date.now()}`,
          order: maxOrder + 1,
        };

        set((state) => ({
          columns: [...state.columns, newColumn],
        }));
      },

      updateColumn: (id, columnData) => {
        set((state) => ({
          columns: state.columns.map((column) =>
            column.id === id ? { ...column, ...columnData } : column
          ),
        }));
      },

      deleteColumn: (id) => {
        set((state) => ({
          columns: state.columns.filter((column) => column.id !== id),
        }));
      },

      reorderColumns: (boardId, columnIds) => {
        set((state) => ({
          columns: state.columns.map((col) => {
            if (col.boardId !== boardId) return col;
            const newOrder = columnIds.indexOf(col.id);
            return newOrder !== -1 ? { ...col, order: newOrder + 1 } : col;
          }),
        }));
      },

      getColumnsByBoard: (boardId) => {
        return get()
          .columns.filter((column) => column.boardId === boardId)
          .sort((a, b) => a.order - b.order);
      },
    }),
    {
      name: 'column-storage',
    }
  )
);
