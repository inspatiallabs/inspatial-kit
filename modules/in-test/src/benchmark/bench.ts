/*#############################################(DOCUMENTATION)#############################################*/
/**
 * # Benchmarking
 *
 * Universal benchmarking module that provides Deno.bench compatible API across all JavaScript runtimes.
 * Write benchmarks once, run them anywhere - from mobile to desktop, and 3D/spatial environments!
 *
 * ## Getting Started
 *
 * First, import what you need:
 * ```ts
 * import { bench } from "@in/test";
 * ```
 *
 * ## Basic Benchmarking
 *
 * ### Simple Benchmark
 * ```ts
 * bench("Array.push vs Array.concat", () => {
 *   const arr = [];
 *   for (let i = 0; i < 1000; i++) {
 *     arr.push(i);
 *   }
 * });
 * ```
 *
 * ### Baseline Comparisons
 * ```ts
 * bench("String concatenation", { baseline: true }, () => {
 *   let result = "";
 *   for (let i = 0; i < 100; i++) {
 *     result += `item-${i}`;
 *   }
 * });
 *
 * bench("Array join", () => {
 *   const parts = [];
 *   for (let i = 0; i < 100; i++) {
 *     parts.push(`item-${i}`);
 *   }
 *   return parts.join("");
 * });
 * ```
 *
 * ### Grouping Benchmarks
 * ```ts
 * bench("Array push", { group: "arrays", baseline: true }, () => {
 *   const arr = [];
 *   for (let i = 0; i < 1000; i++) {
 *     arr.push(i);
 *   }
 * });
 *
 * bench("Array unshift", { group: "arrays" }, () => {
 *   const arr = [];
 *   for (let i = 0; i < 1000; i++) {
 *     arr.unshift(i);
 *   }
 * });
 * ```
 *
 * ### Precise Timing Control
 * ```ts
 * bench("File processing", (b) => {
 *   // Setup (not measured)
 *   const data = generateTestData();
 *
 *   // Start measuring here
 *   b.start();
 *   const processed = processData(data);
 *   b.end();
 *   // Stop measuring here
 *
 *   // Cleanup (not measured)
 *   cleanup(processed);
 * });
 * ```
 *
 * @module
 */

/*#############################################(IMPORTS)#############################################*/

import { performance } from "../performance.ts";

/*#############################################(TYPES)#############################################*/

/**
 * Benchmark context providing timing control
 */
export interface BenchContext {
  /**
   * Start timing measurement
   */
  start(): void;

  /**
   * End timing measurement
   */
  end(): void;

  /**
   * The name of the benchmark
   */
  name: string;
}

/**
 * Benchmark function signature
 */
export type BenchFunction = (b: BenchContext) => unknown;

/**
 * Benchmark options
 */
export interface BenchOptions {
  /**
   * Set this benchmark as baseline for comparison
   * @default false
   */
  baseline?: boolean;

  /**
   * Group name for organizing related benchmarks
   */
  group?: string;

  /**
   * Only run this benchmark (and others marked with only)
   * @default false
   */
  only?: boolean;

  /**
   * Ignore/skip this benchmark
   * @default false
   */
  ignore?: boolean;

  /**
   * Number of iterations to run (if supported by runtime)
   */
  iterations?: number;

  /**
   * Warm-up iterations before measuring
   */
  warmup?: number;
}

/**
 * Benchmark definition
 */
export interface BenchDefinition {
  name: string;
  fn: BenchFunction;
  options: BenchOptions;
}

/**
 * Benchmark result
 */
export interface BenchResult {
  name: string;
  group?: string;
  baseline: boolean;
  duration: number;
  iterations: number;
  iterationsPerSecond: number;
  memoryUsed?: number;
}

/*#############################################(GLOBALS)#############################################*/

/** Global benchmark registry */
const benchmarks = new Map<string, BenchDefinition>();
const benchmarkGroups = new Map<string, BenchDefinition[]>();
const benchmarkResults = new Map<string, BenchResult>();
let hasOnlyBenchmarks = false;

/*#############################################(BENCH CONTEXT)#############################################*/

class BenchContextImpl implements BenchContext {
  private startTime = 0;
  private endTime = 0;
  private isRunning = false;

  constructor(public name: string) {}

  start(): void {
    if (this.isRunning) {
      throw new Error("Benchmark timing already started");
    }
    this.startTime = performance.now();
    this.isRunning = true;
  }

  end(): void {
    if (!this.isRunning) {
      throw new Error("Benchmark timing not started");
    }
    this.endTime = performance.now();
    this.isRunning = false;
  }

  getDuration(): number {
    if (this.isRunning) {
      return performance.now() - this.startTime;
    }
    return this.endTime - this.startTime;
  }
}

/*#############################################(BENCH FUNCTION)#############################################*/

/**
 * Register a benchmark
 *
 * @param name - Name of the benchmark
 * @param fn - Benchmark function to execute
 */
export function bench(name: string, fn: BenchFunction): void;

/**
 * Register a benchmark with options
 *
 * @param name - Name of the benchmark
 * @param options - Benchmark options
 * @param fn - Benchmark function to execute
 */
export function bench(
  name: string,
  options: BenchOptions,
  fn: BenchFunction
): void;

/**
 * Register a benchmark with options as first parameter
 *
 * @param options - Benchmark options including name
 * @param fn - Benchmark function to execute
 */
export function bench(
  options: BenchOptions & { name: string },
  fn: BenchFunction
): void;

export function bench(
  nameOrOptions: string | (BenchOptions & { name: string }),
  fnOrOptions?: BenchFunction | BenchOptions,
  maybeFn?: BenchFunction
): void {
  let name: string;
  let options: BenchOptions = {};
  let fn: BenchFunction;

  // Parse arguments
  if (typeof nameOrOptions === "string") {
    name = nameOrOptions;
    if (typeof fnOrOptions === "function") {
      fn = fnOrOptions;
    } else if (typeof fnOrOptions === "object" && maybeFn) {
      options = fnOrOptions;
      fn = maybeFn;
    } else {
      throw new Error("Invalid bench arguments");
    }
  } else {
    name = nameOrOptions.name;
    options = nameOrOptions;
    if (typeof fnOrOptions === "function") {
      fn = fnOrOptions;
    } else {
      throw new Error("Invalid bench arguments");
    }
  }

  // Track if we have only benchmarks
  if (options.only) {
    hasOnlyBenchmarks = true;
  }

  // Create benchmark definition
  const benchDef: BenchDefinition = {
    name,
    fn,
    options: { ...options },
  };

  // Register benchmark
  benchmarks.set(name, benchDef);

  // Group benchmarks
  if (options.group) {
    if (!benchmarkGroups.has(options.group)) {
      benchmarkGroups.set(options.group, []);
    }
    benchmarkGroups.get(options.group)!.push(benchDef);
  }

  // If running in Deno and Deno.bench is available, delegate to it
  if (
    typeof globalThis !== "undefined" &&
    (globalThis as any).Deno &&
    typeof (globalThis as any).Deno.bench === "function"
  ) {
    const denoBench = (globalThis as any).Deno.bench;

    // Convert our function to Deno's expected format
    const denoFn = (b: any) => {
      const context = new BenchContextImpl(name);
      let hasCustomTiming = false;

      // Override start/end to track custom timing
      const originalStart = context.start.bind(context);
      const originalEnd = context.end.bind(context);

      context.start = () => {
        hasCustomTiming = true;
        b.start();
        originalStart();
      };

      context.end = () => {
        originalEnd();
        b.end();
      };

      const result = fn(context);

      // If no custom timing was used, measure the entire function
      if (
        !hasCustomTiming &&
        typeof result === "object" &&
        result &&
        "then" in result
      ) {
        // Async function without custom timing
        return result;
      }

      return result;
    };

    // Call Deno.bench with appropriate options
    const denoOptions: any = {};
    if (options.baseline) denoOptions.baseline = true;
    if (options.group) denoOptions.group = options.group;
    if (options.only) denoOptions.only = true;
    if (options.ignore) denoOptions.ignore = true;

    denoBench(name, denoOptions, denoFn);
  }
}

/*#############################################(BENCH MODIFIERS)#############################################*/

/**
 * Register a benchmark that will be the only one executed
 */
bench.only = function benchOnly(
  nameOrOptions: string | (BenchOptions & { name: string }),
  fnOrOptions?: BenchFunction | BenchOptions,
  maybeFn?: BenchFunction
): void {
  if (typeof nameOrOptions === "string") {
    if (typeof fnOrOptions === "function") {
      bench(nameOrOptions, { only: true }, fnOrOptions);
    } else if (typeof fnOrOptions === "object" && maybeFn) {
      bench(nameOrOptions, { ...fnOrOptions, only: true }, maybeFn);
    }
  } else {
    bench({ ...nameOrOptions, only: true }, fnOrOptions as BenchFunction);
  }
};

/**
 * Register a benchmark that will be skipped
 */
bench.ignore = function benchIgnore(
  nameOrOptions: string | (BenchOptions & { name: string }),
  fnOrOptions?: BenchFunction | BenchOptions,
  maybeFn?: BenchFunction
): void {
  if (typeof nameOrOptions === "string") {
    if (typeof fnOrOptions === "function") {
      bench(nameOrOptions, { ignore: true }, fnOrOptions);
    } else if (typeof fnOrOptions === "object" && maybeFn) {
      bench(nameOrOptions, { ...fnOrOptions, ignore: true }, maybeFn);
    }
  } else {
    bench({ ...nameOrOptions, ignore: true }, fnOrOptions as BenchFunction);
  }
};

/**
 * Alias for bench.ignore
 */
bench.skip = bench.ignore;

/*#############################################(BENCHMARK EXECUTION)#############################################*/

/**
 * Run a single benchmark and return results
 */
async function runBenchmark(benchDef: BenchDefinition): Promise<BenchResult> {
  const { name, fn, options } = benchDef;
  const context = new BenchContextImpl(name);

  // Warm-up iterations
  const warmupIterations = options.warmup || 10;
  for (let i = 0; i < warmupIterations; i++) {
    try {
      const result = fn(context);
      if (result && typeof result === "object" && "then" in result) {
        await result;
      }
    } catch {
      // Ignore warm-up errors
    }
  }

  // Measure performance
  const iterations = options.iterations || 100;
  const durations: number[] = [];
  let totalMemoryUsed = 0;
  let memoryMeasurements = 0;

  for (let i = 0; i < iterations; i++) {
    const startMemory = performance.memory?.usedJSHeapSize;
    const startTime = performance.now();

    let hasCustomTiming = false;
    const originalStart = context.start.bind(context);
    const originalEnd = context.end.bind(context);

    context.start = () => {
      hasCustomTiming = true;
      originalStart();
    };

    context.end = () => {
      originalEnd();
    };

    try {
      const result = fn(context);
      if (result && typeof result === "object" && "then" in result) {
        await result;
      }
    } catch (error) {
      console.error(`Benchmark "${name}" failed:`, error);
      throw error;
    }

    const endTime = performance.now();
    const endMemory = performance.memory?.usedJSHeapSize;

    // Calculate duration
    const duration = hasCustomTiming
      ? context.getDuration()
      : endTime - startTime;
    durations.push(duration);

    // Calculate memory usage
    if (startMemory && endMemory) {
      totalMemoryUsed += Math.max(0, endMemory - startMemory);
      memoryMeasurements++;
    }
  }

  // Calculate statistics
  const totalDuration = durations.reduce((sum, d) => sum + d, 0);
  const avgDuration = totalDuration / iterations;
  const iterationsPerSecond = 1000 / avgDuration;
  const avgMemoryUsed =
    memoryMeasurements > 0 ? totalMemoryUsed / memoryMeasurements : undefined;

  const result: BenchResult = {
    name,
    group: options.group,
    baseline: options.baseline || false,
    duration: avgDuration,
    iterations,
    iterationsPerSecond,
    memoryUsed: avgMemoryUsed,
  };

  benchmarkResults.set(name, result);
  return result;
}

/**
 * Run all registered benchmarks
 */
export async function runBenchmarks(): Promise<BenchResult[]> {
  const results: BenchResult[] = [];

  // Filter benchmarks based on only/ignore flags
  const benchmarksToRun = Array.from(benchmarks.values()).filter((bench) => {
    if (bench.options.ignore) return false;
    if (hasOnlyBenchmarks && !bench.options.only) return false;
    return true;
  });

  // Run benchmarks
  for (const benchDef of benchmarksToRun) {
    try {
      const result = await runBenchmark(benchDef);
      results.push(result);
    } catch (error) {
      console.error(`Failed to run benchmark "${benchDef.name}":`, error);
    }
  }

  // Print results
  printBenchmarkResults(results);

  return results;
}

/**
 * Print benchmark results in a formatted table
 */
function printBenchmarkResults(results: BenchResult[]): void {
  if (results.length === 0) {
    console.log("No benchmarks to run.");
    return;
  }

  // Group results
  const groups = new Map<string, BenchResult[]>();
  const ungrouped: BenchResult[] = [];

  for (const result of results) {
    if (result.group) {
      if (!groups.has(result.group)) {
        groups.set(result.group, []);
      }
      groups.get(result.group)!.push(result);
    } else {
      ungrouped.push(result);
    }
  }

  // Print header
  console.log("\nBenchmark Results:");
  console.log("==================");

  // Print ungrouped results
  if (ungrouped.length > 0) {
    printResultGroup(ungrouped);
  }

  // Print grouped results
  for (const [groupName, groupResults] of Array.from(groups.entries())) {
    console.log(`\n${groupName}:`);
    console.log("-".repeat(groupName.length + 1));
    printResultGroup(groupResults);
  }
}

/**
 * Print a group of benchmark results
 */
function printResultGroup(results: BenchResult[]): void {
  // Find baseline for comparison
  const baseline = results.find((r) => r.baseline);

  // Sort by performance (fastest first)
  const sortedResults = [...results].sort((a, b) => a.duration - b.duration);

  // Print results
  for (const result of sortedResults) {
    const durationStr = formatDuration(result.duration);
    const opsPerSecStr = formatNumber(result.iterationsPerSecond);
    const memoryStr = result.memoryUsed ? formatBytes(result.memoryUsed) : "";

    let line = `  ${result.name.padEnd(30)} ${durationStr.padStart(
      12
    )} ${opsPerSecStr.padStart(15)} ops/sec`;

    if (memoryStr) {
      line += ` ${memoryStr.padStart(10)}`;
    }

    // Add baseline comparison
    if (baseline && baseline !== result) {
      const ratio = baseline.duration / result.duration;
      if (ratio > 1) {
        line += ` (${ratio.toFixed(2)}x faster than baseline)`;
      } else {
        line += ` (${(1 / ratio).toFixed(2)}x slower than baseline)`;
      }
    } else if (result.baseline) {
      line += " (baseline)";
    }

    console.log(line);
  }

  // Print summary if there's a baseline
  if (baseline && results.length > 1) {
    console.log("\nSummary:");
    const fastest = sortedResults[0];
    if (fastest !== baseline) {
      const improvement = baseline.duration / fastest.duration;
      console.log(`  ${fastest.name}`);
      console.log(
        `    ${improvement.toFixed(2)}x faster than ${baseline.name}`
      );
    }
  }
}

/*#############################################(UTILITIES)#############################################*/

/**
 * Format duration in appropriate units
 */
function formatDuration(ms: number): string {
  if (ms < 0.001) {
    return `${(ms * 1000000).toFixed(2)} ns`;
  } else if (ms < 1) {
    return `${(ms * 1000).toFixed(2)} μs`;
  } else if (ms < 1000) {
    return `${ms.toFixed(2)} ms`;
  } else {
    return `${(ms / 1000).toFixed(2)} s`;
  }
}

/**
 * Format numbers with appropriate separators
 */
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(2)}K`;
  } else {
    return num.toFixed(0);
  }
}

/**
 * Format bytes in appropriate units
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}

/**
 * Clear all registered benchmarks (useful for testing)
 */
export function clearBenchmarks(): void {
  benchmarks.clear();
  benchmarkGroups.clear();
  benchmarkResults.clear();
  hasOnlyBenchmarks = false;
}

/**
 * Get all registered benchmarks
 */
export function getBenchmarks(): BenchDefinition[] {
  return Array.from(benchmarks.values());
}

/**
 * Get benchmark results
 */
export function getBenchmarkResults(): BenchResult[] {
  return Array.from(benchmarkResults.values());
}
