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

// Array-specific overload must come before object overload so arrays resolve to Signal<T>
export function createState<T extends readonly any[]>(initial: T): Signal<T>;

export function createState<T extends Record<string, any>>(
  initialState: T
): State<T>;

// Scalar support: allow createState(value) → Signal<value>
export function createState<T>(initialValue: T): Signal<T>;

export function createState<T>(
  configOrInitialState: StateConfig<T & Record<string, any>> | T
):
  | Signal<T>
  | State<T & Record<string, any>>
  | (State<T & Record<string, any>> &
      ExplicitReturnFromConfig<StateConfig<T & Record<string, any>>>) {
  if (isStateConfig<T & Record<string, any>>(configOrInitialState)) {
    return createStateFromConfig(configOrInitialState);
  }
  if (isPlainObject<T & Record<string, any>>(configOrInitialState)) {
    return createStateFromObject(
      configOrInitialState as T & Record<string, any>
    );
  }
  return createSignal(configOrInitialState as T);
}

/*##############################(Type Guards & Helpers)##############################*/
function isPlainObject<T extends Record<string, any>>(val: unknown): val is T {
  return (
    typeof val === "object" &&
    val !== null &&
    (Object.getPrototypeOf(val) === Object.prototype ||
      Object.getPrototypeOf(val) === null)
  );
}

function isStateConfig<T extends Record<string, any>>(
  val: unknown
): val is StateConfig<T> {
  return (
    isPlainObject<{ initialState: T }>(val) &&
    isPlainObject<T>((val as any).initialState)
  );
}

function keysOf<T extends Record<string, any>>(o: T): (keyof T)[] {
  return Object.keys(o) as (keyof T)[];
}

function entriesOf<T extends Record<string, any>>(
  o: T
): [keyof T, T[keyof T]][] {
  return Object.entries(o) as [keyof T, T[keyof T]][];
}

/*##############################(Object Pattern)##############################*/
function createStateFromObject<T extends Record<string, any>>(
  initialState: T
): State<T> {
  const signals = {} as { [K in keyof T]: Signal<T[K]> };
  for (const key of keysOf(initialState)) {
    signals[key] = createSignal(initialState[key]);
  }

  const subscribers = new Set<(snapshot: T) => void>();
  let notificationsPaused = false;

  const notifySubscribers = () => {
    if (!notificationsPaused) {
      const current = snapshot();
      subscribers.forEach((l) => l(current));
    }
  };

  const snapshot = (): T => {
    const result = {} as T;
    for (const [key, sig] of entriesOf(signals)) {
      (result as any)[key] = sig.peek();
    }
    return result;
  };

  // watch all
  let isInitializing = true;
  for (const sig of Object.values(signals)) {
    createSideEffect(() => {
      (sig as Signal<any>).get();
      if (!isInitializing) notifySubscribers();
    });
  }
  isInitializing = false;

  const state: State<T> = {
    ...(signals as { [K in keyof T]: Signal<T[K]> }),

    batch: (updates) => {
      notificationsPaused = true;
      try {
        updates(state as unknown as { [K in keyof T]: Signal<T[K]> });
      } finally {
        notificationsPaused = false;
        notifySubscribers();
      }
    },

    reset: () => {
      untrack(() => {
        for (const [key, value] of entriesOf(initialState)) {
          state[key].set(value);
        }
      });
      tick();
    },

    snapshot,

    subscribe: (listener) => {
      subscribers.add(listener);
      listener(snapshot());
      return () => {
        subscribers.delete(listener);
      };
    },
  } as State<T>;

  return state;
}

/*##############################(Explicit Config Pattern)##############################*/
function createStateFromConfig<
  C extends StateConfig<T>,
  T extends Record<string, any>
>(config: C): State<T> & ExplicitReturnFromConfig<C> {
  const base = createStateFromObject<T>(config.initialState);

  const actionStore: Record<string, (...args: any[]) => void> = {};
  const storageCleanups = new Map<string, () => void>();
  const storageConfigs = new Map<string, StorageProps>();
  let storagesPaused = false;

  const enhanced = Object.assign(base, {
    action: actionStore,
    addAction: (
      name: string,
      def: C["action"] extends TriggerDefsFor<T>
        ? C["action"][keyof C["action"]]
        : UnifiedTriggerDefs[string]
    ) => {
      // Create single-action record with exact name
      const single = { [name]: def } as unknown as TriggerDefsFor<T>;
      const created = createAction(base, single);
      Object.assign(actionStore, created);
    },
    removeAction: (name: string) => {
      if (actionStore[name]) delete actionStore[name];
    },
    addStorage: (storageConfig: StorageProps) => {
      if (storageCleanups.has(storageConfig.key)) {
        base.removeStorage?.(storageConfig.key);
      }
      const cleanup = createStorage(base, storageConfig);
      storageCleanups.set(storageConfig.key, cleanup);
      storageConfigs.set(storageConfig.key, storageConfig);
      return cleanup;
    },
    removeStorage: (key: string) => {
      const cleanup = storageCleanups.get(key);
      if (cleanup) {
        cleanup();
        storageCleanups.delete(key);
        storageConfigs.delete(key);
      }
    },
    getStorageInfo: () => {
      return Array.from(storageConfigs.entries()).map(([key, cfg]) => ({
        key,
        backend: typeof cfg.backend === "string" ? cfg.backend : "custom",
        active: storageCleanups.has(key) && !storagesPaused,
      }));
    },
    pauseStorage: () => {
      storagesPaused = true;
    },
    resumeStorage: () => {
      storagesPaused = false;
    },
  });

  // Auto actions
  if (config.action) {
    const created = createAction(base, config.action as TriggerDefsFor<T>);
    Object.assign(actionStore, created);
  }

  // Auto storage
  if (config.storage) {
    const storages = Array.isArray(config.storage)
      ? config.storage
      : [config.storage];
    for (const s of storages) {
      const cleanup = createStorage(base, s);
      storageCleanups.set(s.key, cleanup);
      storageConfigs.set(s.key, s);
    }
  }

  return enhanced as unknown as State<T> & ExplicitReturnFromConfig<C>;
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
