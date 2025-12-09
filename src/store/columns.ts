import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Column, Task } from '../types/store';

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

        // Generate ID: col-{status}-{boardId}
        const columnId = `col-${columnData.status}-${columnData.boardId}`;

        const newColumn: Column = {
          ...columnData,
          id: columnId,
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
        const columnToDelete = get().columns.find((col) => col.id === id);
        if (!columnToDelete) return;

        const boardId = columnToDelete.boardId;
        const deletedStatus = columnToDelete.status;

        // Get remaining columns for this board (excluding the one being deleted)
        const remainingColumns = get().columns.filter(
          (col) => col.boardId === boardId && col.id !== id
        );

        // Move tasks from deleted column to another column
        import('./tasks').then(({ useTaskStore }) => {
          const tasksInDeletedColumn = useTaskStore.getState().tasks.filter(
            (task: Task) => task.boardId === boardId && task.status === deletedStatus
          );

          if (tasksInDeletedColumn.length > 0) {
            // First try to find 'todo' column
            let targetColumn = remainingColumns.find((col) => col.status === 'todo');
            
            // If no 'todo' column, use any remaining column
            if (!targetColumn && remainingColumns.length > 0) {
              targetColumn = remainingColumns[0];
            }

            // Move tasks to target column or delete them if no columns remain
            tasksInDeletedColumn.forEach((task: Task) => {
              if (targetColumn) {
                useTaskStore.getState().moveTask(task.id, targetColumn.status);
              } else {
                // No columns left, delete the task
                useTaskStore.getState().deleteTask(task.id);
              }
            });
          }
        });

        // Delete the column
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
