/**
 * Storage utility with localStorage/IndexedDB support
 * Handles quota errors, auto-save, and import/export
 */

import { StateStorage } from 'zustand/middleware';

const STORAGE_QUOTA_EXCEEDED_ERRORS = [
  'QuotaExceededError',
  'NS_ERROR_DOM_QUOTA_REACHED',
  'QUOTA_EXCEEDED_ERR',
];

interface StorageConfig {
  name: string;
  debounceMs?: number;
}

class StorageManager {
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Check if storage quota has been exceeded
   */
  private isQuotaExceededError(error: unknown): boolean {
    return (
      error instanceof DOMException &&
      STORAGE_QUOTA_EXCEEDED_ERRORS.some(
        (name) => error.name === name || error.code === 22
      )
    );
  }

  /**
   * Get available storage quota information for localStorage
   */
  async getStorageInfo(): Promise<{
    quota: number;
    usage: number;
    available: number;
    percentUsed: number;
  } | null> {
    try {
      // Calculate actual localStorage usage
      let usage = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key) || '';
          // Each character is ~2 bytes in UTF-16
          usage += (key.length + value.length) * 2;
        }
      }

      // localStorage typical limit is 5-10 MB
      // Use a conservative 5 MB (5 * 1024 * 1024 bytes)
      const quota = 5 * 1024 * 1024;
      const available = quota - usage;
      const percentUsed = quota > 0 ? (usage / quota) * 100 : 0;

      return { quota, usage, available, percentUsed };
    } catch (error) {
      console.error('Failed to estimate storage:', error);
      return null;
    }
  }

  /**
   * Set item in localStorage with quota error handling
   */
  setItem(key: string, value: string): boolean {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      if (this.isQuotaExceededError(error)) {
        console.error('Storage quota exceeded. Attempting cleanup...');
        this.handleQuotaExceeded(key, value);
        return false;
      }
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  }

  /**
   * Get item from localStorage
   */
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return null;
    }
  }

  /**
   * Remove item from localStorage
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }

  /**
   * Handle quota exceeded errors by cleaning up old data
   */
  private handleQuotaExceeded(key: string, value: string): void {
    try {
      // Get all keys and their sizes
      const keys = Object.keys(localStorage);
      const sizes: Array<{ key: string; size: number }> = [];

      keys.forEach((k) => {
        if (k !== key) {
          const item = localStorage.getItem(k);
          if (item) {
            sizes.push({ key: k, size: item.length });
          }
        }
      });

      // Sort by size (largest first)
      sizes.sort((a, b) => b.size - a.size);

      // Remove largest items until we can save
      for (const item of sizes) {
        if (item.key.includes('cache') || item.key.includes('temp')) {
          localStorage.removeItem(item.key);
          
          // Try to save again
          try {
            localStorage.setItem(key, value);
            console.log('Successfully saved after cleanup');
            return;
          } catch {
            // Continue removing items
          }
        }
      }

      // If still can't save, notify user
      this.notifyQuotaExceeded();
    } catch (error) {
      console.error('Failed to handle quota exceeded:', error);
      this.notifyQuotaExceeded();
    }
  }

  /**
   * Notify user about storage quota issues
   */
  private notifyQuotaExceeded(): void {
    const event = new CustomEvent('storage-quota-exceeded', {
      detail: {
        message: 'Storage quota exceeded. Some data may not be saved.',
      },
    });
    window.dispatchEvent(event);
  }

  /**
   * Debounced set item
   */
  setItemDebounced(key: string, value: string, debounceMs: number = 1000): void {
    // Clear existing timer
    const existingTimer = this.debounceTimers.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new timer
    const timer = setTimeout(() => {
      this.setItem(key, value);
      this.debounceTimers.delete(key);
    }, debounceMs);

    this.debounceTimers.set(key, timer);
  }

  /**
   * Export data as JSON
   */
  exportData(key: string): string | null {
    const data = this.getItem(key);
    if (!data) return null;

    try {
      // Validate JSON
      JSON.parse(data);
      return data;
    } catch (error) {
      console.error('Failed to export data:', error);
      return null;
    }
  }

  /**
   * Import data from JSON
   */
  importData(key: string, jsonData: string): boolean {
    try {
      // Validate JSON
      JSON.parse(jsonData);
      return this.setItem(key, jsonData);
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  /**
   * Download data as JSON file
   */
  downloadAsJSON(key: string, filename: string): void {
    const data = this.exportData(key);
    if (!data) {
      console.error('No data to export');
      return;
    }

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Clear all storage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
}

// Singleton instance
export const storageManager = new StorageManager();

/**
 * Custom storage for Zustand persist middleware
 * Includes debouncing and error handling
 */
export const createDebouncedStorage = (
  config: StorageConfig = { name: 'app-storage', debounceMs: 1000 }
): StateStorage => {
  return {
    getItem: (name: string): string | null => {
      return storageManager.getItem(name);
    },
    setItem: (name: string, value: string): void => {
      if (config.debounceMs && config.debounceMs > 0) {
        storageManager.setItemDebounced(name, value, config.debounceMs);
      } else {
        storageManager.setItem(name, value);
      }
    },
    removeItem: (name: string): void => {
      storageManager.removeItem(name);
    },
  };
};

/**
 * Export all board data
 */
export const exportAllData = (): void => {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `task-manager-backup-${timestamp}.json`;

  // Collect all store data
  const allData: Record<string, unknown> = {};
  
  const keys = ['board-storage', 'task-storage', 'column-storage', 'tag-storage'];
  keys.forEach((key) => {
    const data = storageManager.getItem(key);
    if (data) {
      try {
        allData[key] = JSON.parse(data);
      } catch (error) {
        console.error(`Failed to parse ${key}:`, error);
      }
    }
  });

  const jsonString = JSON.stringify(allData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Import all board data
 */
export const importAllData = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        // Import each store's data
        let successCount = 0;
        const keys = ['board-storage', 'task-storage', 'column-storage', 'tag-storage'];
        
        keys.forEach((key) => {
          if (data[key]) {
            const jsonString = JSON.stringify(data[key]);
            if (storageManager.importData(key, jsonString)) {
              successCount++;
            }
          }
        });

        // Reload page to apply changes
        if (successCount > 0) {
          window.location.reload();
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (error) {
        console.error('Failed to import data:', error);
        resolve(false);
      }
    };

    reader.onerror = () => {
      console.error('Failed to read file');
      resolve(false);
    };

    reader.readAsText(file);
  });
};
