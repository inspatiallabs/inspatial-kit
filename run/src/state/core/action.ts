/**
 * Trigger Action System
 */

import { type Signal, untrack, tick, isSignal } from "../../signal/index.ts";
import type { State } from "./state.ts";

export interface ActionTriggerProps {
  /**
   * Optional name for the trigger
   */
  name?: string;

  /**
   * Throttle trigger execution (milliseconds)
   */
  throttle?: number;

  /**
   * Debounce trigger execution (milliseconds)
   */
  debounce?: number;

  /**
   * Execute trigger only once
   */
  once?: boolean;
}

export interface BatchActionTriggerDef {
  key: string;
  fn: (current: any, ...args: any[]) => any;
  options?: ActionTriggerProps;
}

export interface EnhancedActionTriggerDef {
  /**
   * Target for the trigger - supports all createAction patterns
   */
  target:
    | string // Key-based (existing BatchActionTriggerDef compatibility)
    | Signal<any> // Direct signal
    | [any, string] // State tuple [state, key]
    | (() => Signal<any>); // Signal factory for dynamic/computed signals

  /**
   * Action function
   */
  fn: (current: any, ...args: any[]) => any;

  /**
   * Trigger options
   */
  options?: ActionTriggerProps;
}

// Union type for backward compatibility and new features
export type UnifiedTriggerDef = BatchActionTriggerDef | EnhancedActionTriggerDef;
export type UnifiedTriggerDefs = Record<string, UnifiedTriggerDef>;

export type BatchActionTriggerDefs = Record<string, BatchActionTriggerDef>;

// Typed trigger defs bound to a specific state shape
export type KeyedTriggerDefFor<
  T extends Record<string, any>,
  K extends keyof T
> = {
  key: Extract<K, string>;
  fn: (current: T[K], ...args: any[]) => T[K];
  options?: ActionTriggerProps;
};

export type EnhancedActionTriggerDefFor<T extends Record<string, any>> =
  | {
      target: () => Signal<any>;
      fn: (current: any, ...args: any[]) => any;
      options?: ActionTriggerProps;
    }
  | {
      target: [any, string];
      fn: (current: any, ...args: any[]) => any;
      options?: ActionTriggerProps;
    };

export type TriggerDefsFor<T extends Record<string, any>> = Record<
  string,
  KeyedTriggerDefFor<T, keyof T> | EnhancedActionTriggerDefFor<T>
>;

/**
 * Map trigger definitions to callable trigger function signatures
 */
export type TriggerFunctionsFromDefs<
  D extends Record<string, { fn: (current: any, ...args: any[]) => any }>
> = {
  [K in keyof D]: D[K] extends {
    fn: (current: any, ...args: infer P) => any;
  }
    ? (...args: P) => void
    : (...args: any[]) => void;
};

/**
 * Create a trigger with unified API supporting multiple patterns
 *
 * @example
 * ```typescript
 * // Case 1: Direct signal
 * const count = createSignal(0);
 * const increment = createAction(count, (current, amount = 1) => current + amount);
 *
 * // Case 2: State property tuple
 * const state = createState({ count: 0 });
 * const increment = createAction([state, 'count'], (current, amount = 1) => current + amount);
 *
 * // Case 3: Batch triggers
 * const triggers = createAction(state, {
 *   increment: { key: 'count', fn: (c, n = 1) => c + n },
 *   decrement: { key: 'count', fn: (c, n = 1) => c - n }
 * });
 * ```
 */
export function createAction<T, P extends any[]>(
  target: Signal<T>,
  fn: (current: T, ...payload: P) => T,
  options?: ActionTriggerProps
): (...payload: P) => void;

export function createAction<
  T extends Record<string, any>,
  K extends keyof T,
  P extends any[]
>(
  target: [State<T>, K],
  fn: (current: T[K], ...payload: P) => T[K],
  options?: ActionTriggerProps
): (...payload: P) => void;

export function createAction<T extends Record<string, any>>(
  target: State<T>,
  batchDefs: UnifiedTriggerDefs,
  options?: never
): Record<string, (...args: any[]) => void>;

export function createAction<
  T extends Record<string, any>,
  D extends TriggerDefsFor<T>
>(target: State<T>, batchDefs: D, options?: never): TriggerFunctionsFromDefs<D>;

export function createAction(
  target: any,
  fn: any,
  options?: ActionTriggerProps
): any {
  // Case 1: Direct signal
  if (isSignal(target)) {
    return createSignalActionTrigger(target, fn, options);
  }

  // Case 2: State property tuple [state, key]
  if (Array.isArray(target) && target.length === 2) {
    const [state, key] = target;
    if (state && typeof key === "string" && key in state) {
      return createSignalActionTrigger(state[key], fn, options);
    }
    throw new Error(`Invalid state property: ${key} not found in state`);
  }

  // Case 3: Batch triggers (supports both BatchActionTriggerDefs and UnifiedTriggerDefs)
  if (target && typeof target === "object" && typeof fn === "object") {
    return createBatchActionTriggers(target, fn);
  }

  throw new Error(
    "Invalid createAction arguments. Expected: Signal, [State, key], or State with batch definitions"
  );
}

/**
 * Internal function to create a trigger for a single signal
 */
function createSignalActionTrigger<T, P extends any[]>(
  signal: Signal<T>,
  fn: (current: T, ...payload: P) => T,
  options?: ActionTriggerProps
): (...payload: P) => void {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let executed = false;

  const trigger = (...payload: P) => {
    // Handle once option
    if (options?.once && executed) {
      return;
    }

    // Handle throttle
    if (options?.throttle) {
      const now = Date.now();
      if (now - lastCall < options.throttle) {
        return;
      }
      lastCall = now;
    }

    // Handle debounce
    if (options?.debounce) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        executeAction(payload);
        timeoutId = null;
      }, options.debounce);
      return;
    }

    executeAction(payload);
  };

  const executeAction = (payload: P) => {
    untrack(() => {
      const current = signal.peek();
      const next = fn(current, ...payload);
      const triggerName = (trigger as any).__triggerName || "trigger";
      signal.set(next, triggerName);
    });
    tick();
    executed = true;
  };

  // Add metadata
  (trigger as any).__triggerName = options?.name || fn.name || "anonymous";
  (trigger as any).__isStateTrigger = true;

  return trigger;
}

/**
 * Internal function to create batch triggers with enhanced capabilities
 */
function createBatchActionTriggers<T extends Record<string, any>>(
  state: State<T>,
  triggerDefs: UnifiedTriggerDefs
): Record<string, (...args: any[]) => void> {
  const triggers: Record<string, (...args: any[]) => void> = {};

  for (const [name, def] of Object.entries(triggerDefs)) {
    let targetSignal: Signal<any>;

    // Check if it's an enhanced trigger def
    if ("target" in def) {
      const enhancedDef = def as EnhancedActionTriggerDef;

      if (typeof enhancedDef.target === "string") {
        // String key - same as BatchActionTriggerDef
        if (!(enhancedDef.target in state)) {
          throw new Error(
            `Invalid trigger definition: key '${enhancedDef.target}' not found in state`
          );
        }
        targetSignal = state[enhancedDef.target];
      } else if (isSignal(enhancedDef.target)) {
        // Direct signal
        targetSignal = enhancedDef.target;
      } else if (Array.isArray(enhancedDef.target)) {
        // State tuple [state, key]
        const [targetState, key] = enhancedDef.target;
        if (!targetState || !(key in targetState)) {
          throw new Error(
            `Invalid trigger definition: key '${key}' not found in target state`
          );
        }
        targetSignal = targetState[key];
      } else if (typeof enhancedDef.target === "function") {
        // Signal factory
        targetSignal = enhancedDef.target();
      } else {
        throw new Error(`Invalid trigger target type for '${name}'`);
      }
    } else {
      // Legacy BatchActionTriggerDef
      const batchDef = def as BatchActionTriggerDef;
      if (!batchDef.key || !(batchDef.key in state)) {
        throw new Error(
          `Invalid trigger definition: key '${batchDef.key}' not found in state`
        );
      }
      targetSignal = state[batchDef.key];
    }

    triggers[name] = createSignalActionTrigger(targetSignal, def.fn, {
      ...def.options,
      name,
    });
  }

  return triggers;
}

/**
 * Registry for named triggers
 */
const actionTriggerRegistry = new Map<string, (...args: any[]) => void>();

/**
 * Register a trigger globally by name
 */
export function registerActionTrigger(
  name: string,
  fn: (...args: any[]) => void
): void {
  if (actionTriggerRegistry.has(name)) {
    console.warn(`Trigger "${name}" already registered. Overwriting.`);
  }
  actionTriggerRegistry.set(name, fn);
}

/**
 * Get a registered trigger by name
 */
export function getActionTrigger(
  name: string
): ((...args: any[]) => void) | undefined {
  return actionTriggerRegistry.get(name);
}

/**
 * Execute a registered trigger by name
 */
export function executeActionTrigger(name: string, ...args: any[]): void {
  const trigger = getActionTrigger(name);
  if (!trigger) {
    throw new Error(`Trigger "${name}" not found in registry`);
  }
  trigger(...args);
}

/**
 * Clear all registered triggers
 */
export function clearactionTriggerRegistry(): void {
  actionTriggerRegistry.clear();
}
