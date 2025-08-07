/**
 * # State Persistence
 * @summary #### Automatic state persistence with multiple storage backends
 */

import { createEffect, isSignal } from "../signal/index.ts";
import type { State } from "./state.ts";

export interface PersistOptions {
  /**
   * Storage key
   */
  key: string;
  
  /**
   * Storage backend
   */
  storage?: 'localStorage' | 'sessionStorage' | StorageAdapter;
  
  /**
   * Debounce save operations (milliseconds)
   */
  debounce?: number;
  
  /**
   * Fields to include (if not specified, all fields are included)
   */
  include?: string[];
  
  /**
   * Fields to exclude from persistence
   */
  exclude?: string[];
  
  /**
   * Transform state before saving
   */
  serialize?: (state: any) => string;
  
  /**
   * Transform state after loading
   */
  deserialize?: (data: string) => any;
}

export interface StorageAdapter {
  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): void | Promise<void>;
  removeItem(key: string): void | Promise<void>;
}

/**
 * Setup persistence for a state object
 * 
 * @example
 * ```typescript
 * const state = createState({ count: 0, name: "John" });
 * 
 * // Basic persistence
 * const cleanup = persistState(state, {
 *   key: 'my-app-state'
 * });
 * 
 * // With options
 * persistState(state, {
 *   key: 'my-app-state',
 *   storage: 'sessionStorage',
 *   exclude: ['tempData'],
 *   debounce: 1000
 * });
 * ```
 */
export function persistState<T extends Record<string, any>>(
  state: State<T>,
  options: PersistOptions
): () => void {
  const storage = getStorage(options.storage);
  const serialize = options.serialize || JSON.stringify;
  const deserialize = options.deserialize || JSON.parse;
  
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let isLoading = false;
  
  // Filter function for included/excluded fields
  const shouldPersist = (key: string): boolean => {
    if (options.include && !options.include.includes(key)) {
      return false;
    }
    if (options.exclude && options.exclude.includes(key)) {
      return false;
    }
    return true;
  };
  
  // Save state to storage
  const saveState = async () => {
    const snapshot = state.snapshot();
    const filtered: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(snapshot)) {
      if (shouldPersist(key)) {
        filtered[key] = value;
      }
    }
    
    try {
      const data = serialize(filtered);
      await storage.setItem(options.key, data);
    } catch (error) {
      console.error('Failed to persist state:', error);
    }
  };
  
  // Debounced save
  const debouncedSave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    if (options.debounce) {
      timeoutId = setTimeout(saveState, options.debounce);
    } else {
      saveState();
    }
  };
  
  // Load state from storage
  const loadState = async () => {
    isLoading = true;
    
    try {
      const data = await storage.getItem(options.key);
      if (data) {
        const parsed = deserialize(data);
        
        // Update state with loaded values
        state.batch(s => {
          for (const [key, value] of Object.entries(parsed)) {
            if (key in s && shouldPersist(key)) {
              (s as any)[key].set(value);
            }
          }
        });
      }
    } catch (error) {
      console.error('Failed to load persisted state:', error);
    } finally {
      isLoading = false;
    }
  };
  
  // Load initial state
  loadState();
  
  // Watch for changes
  const unsubscribe = state.subscribe(() => {
    if (!isLoading) {
      debouncedSave();
    }
  });
  
  // Cleanup function
  return () => {
    unsubscribe();
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
}

/**
 * Get storage adapter
 */
function getStorage(storage?: 'localStorage' | 'sessionStorage' | StorageAdapter): StorageAdapter {
  if (!storage || storage === 'localStorage') {
    return window.localStorage;
  }
  if (storage === 'sessionStorage') {
    return window.sessionStorage;
  }
  return storage;
}

/**
 * Create a custom storage adapter
 * 
 * @example
 * ```typescript
 * const memoryStorage = createMemoryStorage();
 * persistState(state, {
 *   key: 'test',
 *   storage: memoryStorage
 * });
 * ```
 */
export function createMemoryStorage(): StorageAdapter {
  const store = new Map<string, string>();
  
  return {
    getItem: (key) => store.get(key) || null,
    setItem: (key, value) => { store.set(key, value); },
    removeItem: (key) => { store.delete(key); }
  };
}

/**
 * Create an async storage adapter wrapper
 */
export function createAsyncStorage(
  getItem: (key: string) => Promise<string | null>,
  setItem: (key: string, value: string) => Promise<void>,
  removeItem: (key: string) => Promise<void>
): StorageAdapter {
  return { getItem, setItem, removeItem };
}
