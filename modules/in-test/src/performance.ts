/**
 * Universal Performance API for InSpatial Test
 *
 * Provides a consistent performance measurement interface across all JavaScript runtimes
 * (Deno, Node.js, Bun, and browsers). This module re-exports the performance API
 * and ensures it's available for performance testing scenarios.
 */

// Type definitions for performance API
export interface PerformanceMemory {
  readonly usedJSHeapSize: number;
  readonly totalJSHeapSize: number;
  readonly jsHeapSizeLimit: number;
}

export interface PerformanceEntry {
  readonly name: string;
  readonly entryType: string;
  readonly startTime: number;
  readonly duration: number;
}

export interface PerformanceMark extends PerformanceEntry {
  readonly entryType: "mark";
}

export interface PerformanceMeasure extends PerformanceEntry {
  readonly entryType: "measure";
}

export interface Performance {
  /**
   * Returns a high-resolution timestamp in milliseconds
   */
  now(): number;

  /**
   * Memory usage information (available in some environments)
   */
  readonly memory?: PerformanceMemory;

  /**
   * Creates a performance mark with the given name
   */
  mark?(name: string): void;

  /**
   * Creates a performance measure between two marks or timestamps
   */
  measure?(name: string, startMark?: string, endMark?: string): void;

  /**
   * Gets performance entries by name and type
   */
  getEntriesByName?(name: string, type?: string): PerformanceEntry[];

  /**
   * Gets performance entries by type
   */
  getEntriesByType?(type: string): PerformanceEntry[];

  /**
   * Clears performance marks
   */
  clearMarks?(name?: string): void;

  /**
   * Clears performance measures
   */
  clearMeasures?(name?: string): void;
}

// Runtime detection and performance API access
function getPerformanceAPI(): Performance {
  // Universal performance API access
  if (typeof globalThis !== "undefined" && globalThis.performance) {
    return globalThis.performance;
  }

  // Fallback implementation using Date.now() for basic timing
  const fallbackPerformance: Performance = {
    now(): number {
      return Date.now();
    },
  };

  return fallbackPerformance;
}

/**
 * Universal performance API that works across all JavaScript runtimes
 *
 * @example
 * ```typescript
 * import { performance } from "@inspatial/kit/test";
 *
 * const start = performance.now();
 * // ... some operation
 * const end = performance.now();
 * const duration = end - start;
 * ```
 */
export const performance = getPerformanceAPI();

/**
 * Utility function to measure the execution time of a function
 *
 * @param fn - The function to measure
 * @returns Object containing the result and execution time
 *
 * @example
 * ```typescript
 * import { measurePerformance } from "@inspatial/kit/test";
 *
 * const { result, duration } = await measurePerformance(async () => {
 *   return await someAsyncOperation();
 * });
 * ```
 */
export async function measurePerformance<T>(
  fn: () => T | Promise<T>
): Promise<{ result: T; duration: number }> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  const duration = end - start;

  return { result, duration };
}

/**
 * Utility function to measure memory usage of a function (when available)
 *
 * @param fn - The function to measure
 * @returns Object containing the result, execution time, and memory usage
 *
 * @example
 * ```typescript
 * import { measureMemoryUsage } from "@inspatial/kit/test";
 *
 * const { result, duration, memoryUsed } = await measureMemoryUsage(() => {
 *   return processLargeDataset();
 * });
 * ```
 */
export async function measureMemoryUsage<T>(
  fn: () => T | Promise<T>
): Promise<{ result: T; duration: number; memoryUsed?: number }> {
  const startMemory = performance.memory?.usedJSHeapSize;
  const start = performance.now();

  const result = await fn();

  const end = performance.now();
  const endMemory = performance.memory?.usedJSHeapSize;
  const duration = end - start;

  const memoryUsed =
    startMemory && endMemory ? endMemory - startMemory : undefined;

  return { result, duration, memoryUsed };
}

/**
 * Performance mark utility for creating named performance markers
 *
 * @example
 * ```typescript
 * import { mark, measure } from "@inspatial/kit/test";
 *
 * mark("operation-start");
 * // ... some operation
 * mark("operation-end");
 *
 * const duration = measure("operation", "operation-start", "operation-end");
 * ```
 */
export function mark(name: string): void {
  if (performance.mark) {
    performance.mark(name);
  }
}

/**
 * Performance measure utility for measuring time between marks
 *
 * @param name - Name of the measure
 * @param startMark - Name of the start mark (optional)
 * @param endMark - Name of the end mark (optional)
 * @returns Duration in milliseconds if measurement is available
 */
export function measure(
  name: string,
  startMark?: string,
  endMark?: string
): number | undefined {
  if (performance.measure && performance.getEntriesByName) {
    performance.measure(name, startMark, endMark);
    const entries = performance.getEntriesByName(name, "measure");
    return entries.length > 0
      ? entries[entries.length - 1].duration
      : undefined;
  }
  return undefined;
}

/**
 * Clears performance marks and measures
 *
 * @param name - Optional name to clear specific marks/measures
 */
export function clearPerformanceData(name?: string): void {
  if (performance.clearMarks) {
    performance.clearMarks(name);
  }
  if (performance.clearMeasures) {
    performance.clearMeasures(name);
  }
}
