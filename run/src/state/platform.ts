/**
 * # Platform Integration
 * @summary #### Connect platform triggers to signals
 */


import type { Signal } from "../signal/index.ts";
import type { State } from "./state.ts";
import { createTrigger } from "./trigger.ts";

// Import types from existing trigger system
import type { 
  PlatformType,
  HierarchicalPlatformType,
  TriggerEventDataType,
  TriggerBridgeType
} from "./trigger-types.ts";


export interface PlatformTriggerOptions {
  /**
   * Platform type (dom, native, inreal)
   */
  platform?: PlatformType | HierarchicalPlatformType;
  
  /**
   * Node ID for the trigger
   */
  nodeId?: string;
  
  /**
   * Transform event data to signal value
   */
  transform?: (eventData: TriggerEventDataType) => any;
  
  /**
   * Filter events based on condition
   */
  filter?: (eventData: TriggerEventDataType) => boolean;
}

// Global bridge instance (will be set by initialization)
let globalBridge: TriggerBridgeType | null = null;

/**
 * Set the global trigger bridge instance
 */
export function setTriggerBridge(bridge: TriggerBridgeType): void {
  globalBridge = bridge;
}

/**
 * Get the current trigger bridge
 */
export function getTriggerBridge(): TriggerBridgeType {
  if (!globalBridge) {
    throw new Error('Trigger bridge not initialized. Call setTriggerBridge() first.');
  }
  return globalBridge;
}

/**
 * Connect a platform trigger to a signal
 * 
 * @example
 * ```typescript
 * const count = createSignal(0);
 * 
 * // Connect DOM click events
 * const cleanup = connectPlatformTrigger(count, 'click', {
 *   platform: 'dom',
 *   nodeId: 'my-button',
 *   transform: (event) => count.peek() + 1
 * });
 * 
 * // Connect native touch events
 * connectPlatformTrigger(position, 'touch', {
 *   platform: 'native:ios',
 *   transform: (event) => ({ x: event.clientX, y: event.clientY })
 * });
 * ```
 */
export function connectPlatformTrigger<T>(
  signal: Signal<T>,
  eventName: string,
  options: PlatformTriggerOptions = {}
): () => void {
  const bridge = getTriggerBridge();
  const platform = options.platform || detectPlatform();
  const nodeId = options.nodeId || generateNodeId();
  
  // Create handler function
  const handler = (eventData: TriggerEventDataType) => {
    // Apply filter if provided
    if (options.filter && !options.filter(eventData)) {
      return;
    }
    
    // Transform data if provided, otherwise use event data directly
    const value = options.transform 
      ? options.transform(eventData)
      : eventData as unknown as T;
    
    // Update signal
    signal.set(value);
  };
  
  // Register with bridge
  bridge.registerEventHandler(platform, nodeId, eventName, handler);
  
  // Return cleanup function
  return () => {
    bridge.unregisterEventHandler(platform, nodeId, eventName);
  };
}

/**
 * Connect multiple platform triggers to state properties
 * 
 * @example
 * ```typescript
 * const state = createState({
 *   mouseX: 0,
 *   mouseY: 0,
 *   clicked: false
 * });
 * 
 * const cleanup = connectPlatformState(state, {
 *   mouseX: {
 *     event: 'mousemove',
 *     transform: (e) => e.clientX
 *   },
 *   mouseY: {
 *     event: 'mousemove',
 *     transform: (e) => e.clientY
 *   },
 *   clicked: {
 *     event: 'click',
 *     transform: () => true
 *   }
 * });
 * ```
 */
export function connectPlatformState<T extends Record<string, any>>(
  state: State<T>,
  mappings: {
    [K in keyof T]?: {
      event: string;
      platform?: PlatformType | HierarchicalPlatformType;
      nodeId?: string;
      transform?: (eventData: TriggerEventDataType) => T[K];
      filter?: (eventData: TriggerEventDataType) => boolean;
    }
  }
): () => void {
  const cleanups: Array<() => void> = [];
  
  for (const [key, mapping] of Object.entries(mappings)) {
    if (mapping && key in state) {
      const cleanup = connectPlatformTrigger(
        state[key as keyof T],
        mapping.event,
        {
          platform: mapping.platform,
          nodeId: mapping.nodeId,
          transform: mapping.transform,
          filter: mapping.filter
        }
      );
      cleanups.push(cleanup);
    }
  }
  
  // Return combined cleanup
  return () => {
    cleanups.forEach(cleanup => cleanup());
  };
}

/**
 * Create a trigger from a platform event
 * 
 * @example
 * ```typescript
 * const state = createState({ count: 0 });
 * 
 * const increment = createPlatformTrigger(
 *   state.count,
 *   'click',
 *   (current) => current + 1,
 *   { nodeId: 'increment-button' }
 * );
 * ```
 */
export function createPlatformTrigger<T, P extends any[]>(
  signal: Signal<T>,
  eventName: string,
  action: (current: T, eventData: TriggerEventDataType, ...payload: P) => T,
  options: PlatformTriggerOptions = {}
): (...payload: P) => void {
  // Connect platform event to signal
  connectPlatformTrigger(signal, eventName, {
    ...options,
    transform: (eventData) => {
      const current = signal.peek();
      return action(current, eventData);
    }
  });
  
  // Also return a manual trigger function
  return createTrigger(signal, (current, ...payload) => 
    action(current, {} as TriggerEventDataType, ...payload)
  );
}

/**
 * Detect current platform
 */
function detectPlatform(): PlatformType {
  // Simple detection logic - can be enhanced
  if (typeof globalThis !== 'undefined' && globalThis.document) {
    return 'dom';
  }
  if (typeof globalThis !== 'undefined' && (globalThis as any).process) {
    return 'native';
  }
  return 'dom'; // Default
}

/**
 * Generate unique node ID
 */
let nodeIdCounter = 0;
function generateNodeId(): string {
  return `node-${Date.now()}-${nodeIdCounter++}`;
}

/**
 * Batch register multiple platform event handlers
 */
export function batchConnectPlatform(
  connections: Array<{
    signal: Signal<any>;
    event: string;
    options?: PlatformTriggerOptions;
  }>
): () => void {
  const cleanups = connections.map(({ signal, event, options }) =>
    connectPlatformTrigger(signal, event, options)
  );
  
  return () => {
    cleanups.forEach(cleanup => cleanup());
  };
}
