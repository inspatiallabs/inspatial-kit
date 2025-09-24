/**
 * # createState
 * @summary #### InSpatial State
 *
 * Creates a state object where each property is a signal, providing
 * reactive state management with minimal overhead.
 */

import {
  createSignal,
  untrack,
  tick,
  createSideEffect,
  type Signal,
} from "../signal/index.ts";
import { createStorage, type StorageProps } from "./storage.ts";
import {
  createAction,
  type UnifiedTriggerDefs,
  type TriggerDefsFor,
} from "./action.ts";

export type State<T extends Record<string, any>> = {
  [K in keyof T]: Signal<T[K]>;
} & {
  /**
   * Batch multiple state updates into a single update cycle
   */
  batch: (updates: (state: { [K in keyof T]: Signal<T[K]> }) => void) => void;

  /**
   * Reset all state values to their initial values
   */
  reset: () => void;

  /**
   * Get a snapshot of current state values
   */
  snapshot: () => T;

  /**
   * Subscribe to all state changes
   */
  subscribe: (listener: (snapshot: T) => void) => () => void;

  /**
   * Add an action at runtime (enhanced explicit pattern)
   */
  addAction?: (name: string, actionDef: UnifiedTriggerDefs[string]) => void;

  /**
   * Remove an action at runtime (enhanced explicit pattern)
   */
  removeAction?: (name: string) => void;

  /**
   * Add storage configuration at runtime (enhanced explicit pattern)
   */
  addStorage?: (storageConfig: StorageProps) => () => void;

  /**
   * Remove storage by key (enhanced explicit pattern)
   */
  removeStorage?: (key: string) => void;

  /**
   * Get storage status and management info (enhanced explicit pattern)
   */
  getStorageInfo?: () => Array<{
    key: string;
    backend: string;
    active: boolean;
  }>;

  /**
   * Pause all storage operations (enhanced explicit pattern)
   */
  pauseStorage?: () => void;

  /**
   * Resume all storage operations (enhanced explicit pattern)
   */
  resumeStorage?: () => void;
};

/**
 * Helper types to provide better type inference for the explicit pattern
 */
type TriggerFunctionsFromDefs<D extends UnifiedTriggerDefs> = {
  [K in keyof D]: D[K] extends {
    fn: (current: any, ...args: infer P) => any;
  }
    ? (...args: P) => void
    : (...args: any[]) => void;
};

type ExplicitEnhancements = {
  addAction: (name: string, actionDef: UnifiedTriggerDefs[string]) => void;
  removeAction: (name: string) => void;
  addStorage: (storageConfig: StorageProps) => () => void;
  removeStorage: (key: string) => void;
  getStorageInfo: () => Array<{
    key: string;
    backend: string;
    active: boolean;
  }>;
  pauseStorage: () => void;
  resumeStorage: () => void;
};

type ExplicitReturnFromConfig<C> = C extends { action: infer TR }
  ? TR extends UnifiedTriggerDefs
    ? { action: TriggerFunctionsFromDefs<TR> } & ExplicitEnhancements
    : TR extends { factory: (...args: any[]) => infer R }
    ? { action: R } & ExplicitEnhancements
    : {
        action: Record<string, (...args: any[]) => void>;
      } & ExplicitEnhancements
  : {
      action: Record<string, (...args: any[]) => void>;
    } & ExplicitEnhancements;

export interface StateConfig<T extends Record<string, any>> {
  /**
   * Optional unique identifier for the state
   */
  id?: string;

  /**
   * Initial state values
   */
  initialState: T;

  /**
   * State mutation actions - full createAction integration
   * One function, multiple patterns.
   */
  action?: TriggerDefsFor<T>;

  /**
   * Automatic persistence configuration
   * Supports single storage or multiple storage backends
   */
  storage?: StorageProps | StorageProps[];
}

// Explicit config alias that’s discoverable via createState.in
export interface ExplicitStateConfig<T extends Record<string, any>>
  extends StateConfig<T> {}

/**
 * Create a reactive state object
 *
 * @example
 * ```typescript

 *
 * #########################################################
 * // Explicit Pattern
 * #########################################################
 * const state = createState({
 *   id: "counter-state",
 *   initialState: { count: 0, name: "Ben" },
 *   action: {
 *     // Key-based 
 *     increment: { key: 'count', fn: (c, n = 1) => c + n },
 *     
 *     // Direct signal targeting 
 *     directIncrement: { target: () => state.count, fn: (c) => c + 1 },
 *     
 *     // Cross-state operations
 *     syncWithOther: { 
 *       key: 'count', 
 *       fn: (c) => {
 *         otherState.value.set(c); // Access external state!
 *         return c + 1;
 *       }
 *     },
 *     
 *     // State tuple targeting
 *     externalAction: { 
 *       target: [externalState, 'property'], 
 *       fn: (val) => val * 2 
 *     }
 *   },
 *   storage: { key: 'counter-state', backend: 'local' }
 * });
 * 
 * // Dynamic management - same power as separation!
 * state.addAction('runtime', { key: 'count', fn: (c) => c + 10 });
 * state.addStorage({ key: 'runtime', backend: 'session' });
 * 
 * 
 * #########################################################
 * // Separation Pattern
 * #########################################################
 * // 1. Create State
 * const state = createState({ count: 0, name: "Ben" });
 *
 * //2. Create State Triggers (optional)
 * const trigger = createAction(...)
 * 
 * // 3. Create State Storage (optional)
 * const storage = createStorage(...);
 * 
 * ```
 */
export function createState<C extends StateConfig<any>>(
  config: C
): State<C["initialState"]> & ExplicitReturnFromConfig<C>;

export function createState<T extends Record<string, any>>(
  initialState: T
): State<T>;

export function createState<T extends Record<string, any>>(
  configOrInitialState: StateConfig<T> | T
): any {
  // Determine if we're using the separation pattern or explicit pattern
  const isExplicitPattern =
    configOrInitialState &&
    typeof configOrInitialState === "object" &&
    "initialState" in configOrInitialState;

  let initialState: T;
  let actionConfig: StateConfig<T>["action"];
  let persistOptions: StorageProps | StorageProps[] | undefined;

  if (isExplicitPattern) {
    // Explicit pattern
    const config = configOrInitialState as StateConfig<T>;
    initialState = config.initialState;
    actionConfig = config.action;
    persistOptions = config.storage;
  } else {
    // Separation pattern
    initialState = configOrInitialState as T;
    actionConfig = undefined;
    persistOptions = undefined;
  }

  // Store initial values for reset
  const initialValues = { ...initialState };

  // Create signals for each property
  const signals = {} as { [K in keyof T]: Signal<T[K]> };

  for (const [key, value] of Object.entries(initialState)) {
    signals[key as keyof T] = createSignal(value);
  }

  // List of subscriptions
  const subscribers = new Set<(snapshot: T) => void>();
  let notificationsPaused = false;

  // Notify all subscribers
  const notifySubscribers = () => {
    if (!notificationsPaused) {
      const currentSnapshot = snapshot();
      subscribers.forEach((listener) => listener(currentSnapshot));
    }
  };

  // Create snapshot function
  const snapshot = (): T => {
    const result = {} as T;
    for (const [key, signal] of Object.entries(signals)) {
      result[key as keyof T] = signal.peek();
    }
    return result;
  };

  // Watch all signals for changes
  let isInitializing = true;
  Object.values(signals).forEach((signal) => {
    createSideEffect(() => {
      signal.get(); // Track this signal
      if (!isInitializing) {
        notifySubscribers();
      }
    });
  });
  isInitializing = false;

  // Prepare action creation (will be created after state is constructed)
  const action: Record<string, (...args: any[]) => void> = {};

  // Storage management for enhanced explicit pattern
  const storageCleanups = new Map<string, () => void>();
  const storageConfigs = new Map<string, StorageProps>();
  let storagesPaused = false;

  // Create the state interface
  const state: State<T> & {
    action: Record<string, (...args: any[]) => void>;
  } = {
    ...signals,

    batch: (updates) => {
      notificationsPaused = true;
      try {
        updates(signals);
      } finally {
        notificationsPaused = false;
        notifySubscribers();
      }
    },

    reset: () => {
      untrack(() => {
        for (const [key, value] of Object.entries(initialValues)) {
          signals[key as keyof T].set(value);
        }
      });
      tick();
    },

    snapshot,

    subscribe: (listener) => {
      subscribers.add(listener);
      // Call listener immediately with current state
      listener(snapshot());

      // Return unsubscribe function
      return () => {
        subscribers.delete(listener);
      };
    },

    action,

    // Dynamic action management (only for explicit pattern)
    addAction: isExplicitPattern
      ? (name: string, actionDef: UnifiedTriggerDefs[string]) => {
          if (action[name]) {
            console.warn(`Action "${name}" already exists. Overwriting.`);
          }

          // Create single action using enhanced logic
          const singleActionDef = { [name]: actionDef };
          const newActions = createAction(state, singleActionDef);
          Object.assign(action, newActions);

          console.log(`✨ Dynamic action "${name}" added to state`);
        }
      : undefined,

    removeAction: isExplicitPattern
      ? (name: string) => {
          if (action[name]) {
            delete action[name];
            console.log(`🗑️ Action "${name}" removed from state`);
          } else {
            console.warn(`Action "${name}" not found`);
          }
        }
      : undefined,

    // Enhanced storage management (only for explicit pattern)
    addStorage: isExplicitPattern
      ? (storageConfig: StorageProps) => {
          if (storageCleanups.has(storageConfig.key)) {
            console.warn(
              `Storage with key "${storageConfig.key}" already exists. Removing old one.`
            );
            state.removeStorage?.(storageConfig.key);
          }

          const cleanup = createStorage(state, storageConfig);
          storageCleanups.set(storageConfig.key, cleanup);
          storageConfigs.set(storageConfig.key, storageConfig);

          console.log(
            `💾 Dynamic storage "${storageConfig.key}" added to state`
          );
          return cleanup;
        }
      : undefined,

    removeStorage: isExplicitPattern
      ? (key: string) => {
          const cleanup = storageCleanups.get(key);
          if (cleanup) {
            cleanup();
            storageCleanups.delete(key);
            storageConfigs.delete(key);
            console.log(`🗑️ Storage "${key}" removed from state`);
          } else {
            console.warn(`Storage "${key}" not found`);
          }
        }
      : undefined,

    getStorageInfo: isExplicitPattern
      ? () => {
          return Array.from(storageConfigs.entries()).map(([key, config]) => ({
            key,
            backend:
              typeof config.backend === "string" ? config.backend : "custom",
            active: storageCleanups.has(key) && !storagesPaused,
          }));
        }
      : undefined,

    pauseStorage: isExplicitPattern
      ? () => {
          storagesPaused = true;
          console.log(`⏸️ Storage operations paused`);
        }
      : undefined,

    resumeStorage: isExplicitPattern
      ? () => {
          storagesPaused = false;
          console.log(`▶️ Storage operations resumed`);
        }
      : undefined,
  };

  // Setup automatic actions if configured
  if (actionConfig) {
    const createdActions = createAction(
      state,
      actionConfig as UnifiedTriggerDefs
    );
    Object.assign(action, createdActions);
    console.log(
      `🚀 Actions enabled for state: ${Object.keys(createdActions).join(", ")}`
    );
  }

  // Setup automatic persistence if configured (supports multiple storages)
  if (persistOptions) {
    if (Array.isArray(persistOptions)) {
      // Multiple storage configurations
      persistOptions.forEach((storageConfig) => {
        const cleanup = createStorage(state, storageConfig);
        if (isExplicitPattern) {
          storageCleanups.set(storageConfig.key, cleanup);
          storageConfigs.set(storageConfig.key, storageConfig);
        }
      });
      console.log(
        `🔄 Multi-storage enabled for state with keys: ${persistOptions
          .map((s) => s.key)
          .join(", ")}`
      );
    } else {
      // Single storage configuration
      const cleanup = createStorage(state, persistOptions);
      if (isExplicitPattern) {
        storageCleanups.set(persistOptions.key, cleanup);
        storageConfigs.set(persistOptions.key, persistOptions);
      }
      console.log(
        `🔄 Auto-persistence enabled for state with key: ${persistOptions.key}`
      );
    }
  }

  // Return state (TypeScript will handle the overloading)
  return state as any;
}

// Attach discoverable explicit alias: createState.in
export const createStateIn = <C extends ExplicitStateConfig<any>>(config: C) =>
  createState(config as any) as State<C["initialState"]> &
    ExplicitReturnFromConfig<C>;

// Use bracket syntax to avoid reserved identifier issues
// Consumers can call createState["in"](...) or createState.in(...)
(createState as any)["in"] = createStateIn;

// Provide a typed interface for `createState["in"]` using declaration merging via interface
// Augment the exported function type so TS sees the `in` property
type CreateStateType = typeof createState & {
  in: <C extends ExplicitStateConfig<any>>(
    config: C
  ) => State<C["initialState"]> & ExplicitReturnFromConfig<C>;
};

// Assign the runtime property
(createState as unknown as { [key: string]: any }).in = createStateIn;

// Re-export a widened typing so importers see `.in`
export const createStateWithIn = createState as CreateStateType;
