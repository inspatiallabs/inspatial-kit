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
  createEffect,
  type Signal,
} from "../signal/index.ts";

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
};

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
   * State mutation trigger - encapsulated version of createTrigger
   * These are convenience trigger built into your state for common mutations
   */
  trigger?: (signals: { [K in keyof T]: Signal<T[K]> }) => Record<
    string,
    (...args: any[]) => void
  >;
}



/**
 * Create a reactive state object
 *
 * @example
 * ```typescript
 * #########################################################
 * // Separation Pattern
 * #########################################################
 * // 1. Create State
 * const state = createState({ count: 0, name: "Ben" });
 * 
 * //2. Create State Triggers (optional)
 * const trigger = createTrigger(...)
 * 
 * #########################################################
 * // Explicit Pattern
 * #########################################################
 * const state = createState({
 *   id: "counter-state",
 *   initialState: { count: 0, name: "Ben" },
 *   trigger: (signals) => ({ ... })
 * });
 * ```
 */
export function createState<T extends Record<string, any>>(
  initialState: T
): State<T>;

export function createState<T extends Record<string, any>>(
  config: StateConfig<T>
): State<T> & { trigger: Record<string, (...args: any[]) => void> };

export function createState<T extends Record<string, any>>(
  configOrInitialState: StateConfig<T> | T
): State<T> | (State<T> & { trigger: Record<string, (...args: any[]) => void> }) {
  // Determine if we're using the separation pattern or explicit pattern
  const isExplicitPattern = configOrInitialState && 
    typeof configOrInitialState === 'object' && 
    'initialState' in configOrInitialState;

  let initialState: T;
  let triggerFactory: ((signals: { [K in keyof T]: Signal<T[K]> }) => Record<string, (...args: any[]) => void>) | undefined;

  if (isExplicitPattern) {
    // Explicit pattern
    const config = configOrInitialState as StateConfig<T>;
    initialState = config.initialState;
    triggerFactory = config.trigger;
  } else {
    // Separation pattern
    initialState = configOrInitialState as T;
    triggerFactory = undefined;
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
    createEffect(() => {
      signal.get(); // Track this signal
      if (!isInitializing) {
        notifySubscribers();
      }
    });
  });
  isInitializing = false;

  // Create trigger using the signals (fixes circular reference)
  const trigger = triggerFactory ? triggerFactory(signals) : {};

  // Create the state interface
  const state: State<T> & {
    trigger: Record<string, (...args: any[]) => void>;
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

    trigger,
  };

  // Return state (TypeScript will handle the overloading)
  return state as any;
}


