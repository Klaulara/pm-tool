import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Tag } from '../types/store';
import { useTaskStore } from './tasks';

interface TagState {
  tags: Tag[];
}

interface TagActions {
  addTag: (tag: Omit<Tag, 'id'>) => void;
  updateTag: (id: string, tag: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
  getTagById: (id: string) => Tag | undefined;
}

type TagStore = TagState & TagActions;

export const useTagStore = create<TagStore>()(
  persist(
    (set, get) => ({
      // State
      tags: [],

      // Actions
      addTag: (tagData) => {
        const newTag: Tag = {
          ...tagData,
          id: `tag-${Date.now()}`,
        };
        set((state) => ({
          tags: [...state.tags, newTag],
        }));
      },

      updateTag: (id, tagData) => {
        set((state) => ({
          tags: state.tags.map((tag) => (tag.id === id ? { ...tag, ...tagData } : tag)),
        }));
      },

      deleteTag: (id) => {
        set((state) => ({
          tags: state.tags.filter((tag) => tag.id !== id),
        }));

        // Remove tag from all tasks
        const tasks = useTaskStore.getState().tasks;
        tasks.forEach((task) => {
          if (task.tags?.some((tag) => tag.id === id)) {
            useTaskStore.getState().updateTask(task.id, {
              tags: task.tags.filter((tag) => tag.id !== id),
            });
          }
        });
      },

      getTagById: (id) => {
        return get().tags.find((tag) => tag.id === id);
      },
    }),
    {
      name: 'tag-storage',
    }
  )
);
