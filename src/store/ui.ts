/**
 * Global UI State Store
 * Handles loading states, errors, and global UI state
 */

import { create } from 'zustand';

export interface LoadingState {
  [key: string]: boolean;
}

export interface ErrorState {
  [key: string]: string | null;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface UIState {
  loading: LoadingState;
  errors: ErrorState;
  toasts: ToastMessage[];
}

interface UIActions {
  setLoading: (key: string, isLoading: boolean) => void;
  setError: (key: string, error: string | null) => void;
  clearError: (key: string) => void;
  clearAllErrors: () => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  isLoading: (key: string) => boolean;
  getError: (key: string) => string | null;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()((set, get) => ({
  // State
  loading: {},
  errors: {},
  toasts: [],

  // Actions
  setLoading: (key, isLoading) => {
    set((state) => ({
      loading: {
        ...state.loading,
        [key]: isLoading,
      },
    }));
  },

  setError: (key, error) => {
    set((state) => ({
      errors: {
        ...state.errors,
        [key]: error,
      },
    }));

    // Auto-add error toast (delayed to avoid infinite loops)
    if (error) {
      setTimeout(() => {
        get().addToast({
          type: 'error',
          message: error,
          duration: 5000,
        });
      }, 0);
    }
  },

  clearError: (key) => {
    set((state) => {
      const newErrors = { ...state.errors };
      delete newErrors[key];
      return { errors: newErrors };
    });
  },

  clearAllErrors: () => {
    set({ errors: {} });
  },

  addToast: (toast) => {
    const id = `toast-${Date.now()}`;
    const newToast: ToastMessage = {
      ...toast,
      id,
      duration: toast.duration || 3000,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto-remove toast after duration
    setTimeout(() => {
      get().removeToast(id);
    }, newToast.duration);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  isLoading: (key) => {
    return get().loading[key] || false;
  },

  getError: (key) => {
    return get().errors[key] || null;
  },
}));
