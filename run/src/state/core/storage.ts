/**
 * # State Storage
 * @summary #### Automatic state persistence with multiple storage backends
 */
import type { State } from "./state.ts";

export interface StorageProps {
  /**
   * Storage key
   */
  key: string;

  /**
   * Storage backend
   */
  backend?: "local" | "session" | "memory" | StorageExtensionProp;

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

// Typed storage props bound to a state shape
export type StoragePropsFor<T extends Record<string, any>> = Omit<
  StorageProps,
  "include" | "exclude"
> & {
  include?: (keyof T)[];
  exclude?: (keyof T)[];
};

export interface StorageExtensionProp {
  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): void | Promise<void>;
  removeItem(key: string): void | Promise<void>;
}

/**
 * Setup storage backend for a state object
 *
 * @example
 * ```typescript
 * const state = createState({ count: 0, name: "Ben" });
 *
 * // Basic storage
 * const cleanup = createStorage(state, {
 *   key: 'my-app-state'
 * });
 *
 * // With options
 * createStorage(state, {
 *   key: 'my-app-state',
 *   backend: 'session',  // 'local' | 'session' | 'memory'
 *   exclude: ['tempData'],
 *   debounce: 1000
 * });
 * ```
 */
export function createStorage<T extends Record<string, any>>(
  state: State<T>,
  options: StorageProps
): () => void;

export function createStorage<T extends Record<string, any>>(
  state: State<T>,
  options: StoragePropsFor<T>
): () => void;

export function createStorage<T extends Record<string, any>>(
  state: State<T>,
  options: StorageProps | StoragePropsFor<T>
): () => void {
  const storage = getStorage(options.backend);
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
      console.error("Failed to persist state:", error);
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
        state.batch((s) => {
          for (const [key, value] of Object.entries(parsed)) {
            if (key in s && shouldPersist(key)) {
              (s as any)[key].set(value);
            }
          }
        });
      }
    } catch (error) {
      console.error("Failed to load persisted state:", error);
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
 * Get storage extension
 */
function getStorage(
  backend?: "local" | "session" | "memory" | StorageExtensionProp
): StorageExtensionProp {
  if (!backend || backend === "local") {
    return globalThis.localStorage;
  }
  if (backend === "session") {
    return globalThis.sessionStorage;
  }
  if (backend === "memory") {
    return createMemoryStorage();
  }
  return backend;
}

/**
 * Create a custom storage extension
 *
 * @example
 * ```typescript
 * // Preferred: Use built-in memory backend
 * createStorage(state, {
 *   key: 'test',
 *   backend: 'memory'  // ✨ Built-in option
 * });
 *
 * // Alternative: Custom memory storage instance
 * const memoryStorage = createMemoryStorage();
 * createStorage(state, {
 *   key: 'test',
 *   backend: memoryStorage
 * });
 * ```
 */
export function createMemoryStorage(): StorageExtensionProp {
  const store = new Map<string, string>();

  return {
    getItem: (key) => store.get(key) || null,
    setItem: (key, value) => {
      store.set(key, value);
    },
    removeItem: (key) => {
      store.delete(key);
    },
  };
}

/**
 * Create an async storage extension wrapper
 */
export function createAsyncStorage(
  getItem: (key: string) => Promise<string | null>,
  setItem: (key: string, value: string) => Promise<void>,
  removeItem: (key: string) => Promise<void>
): StorageExtensionProp {
  return { getItem, setItem, removeItem };
}
