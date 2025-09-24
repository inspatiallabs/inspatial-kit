/**
 * Syntactic sugar around the benchmark harness to quickly define and run
 * grouped benchmarks from code, without manually wiring grouping and runners.
 *
 * This is a thin wrapper over `bench()` and `runBenchmarks()`.
 */
import {
  bench,
  runBenchmarks,
  clearBenchmarks,
  getBenchmarkResults,
  type BenchOptions,
  type BenchResult,
} from "./bench.ts";

/*#############################################(TYPES)#############################################*/
export interface CreateBenchmarkOptions {
  /** Default group applied to all registered benchmarks */
  group?: string;
  /** Default options merged into each registered benchmark */
  defaultOptions?: BenchOptions;
}

export interface BenchmarkRunner {
  /** Register a benchmark */
  run(
    name: string,
    fn: () => unknown | Promise<unknown>,
    options?: BenchOptions
  ): void;
  /** Convenience alias for `run` */
  bench(
    name: string,
    fn: () => unknown | Promise<unknown>,
    options?: BenchOptions
  ): void;
  /** Execute all registered benchmarks */
  execute(): Promise<BenchResult[]>;
  /** Get results from last execution */
  results(): BenchResult[];
  /** Clear all registered benchmarks */
  clear(): void;
}

/*#############################################(FUNCTIONS)#############################################*/
export function createBenchmark(
  options?: CreateBenchmarkOptions | string
): BenchmarkRunner {
  const group = typeof options === "string" ? options : options?.group;
  const defaults =
    (typeof options === "object" && options?.defaultOptions) || {};

  const register = (
    name: string,
    fn: () => unknown | Promise<unknown>,
    opts?: BenchOptions
  ) => {
    const merged: BenchOptions = {
      ...(group ? { group } : {}),
      ...defaults,
      ...(opts || {}),
    };
    if (Object.keys(merged).length > 0) {
      return bench(name, merged, fn);
    }
    return bench(name, fn);
  };

  return {
    run: register,
    bench: register,
    execute: () => runBenchmarks(),
    results: () => getBenchmarkResults(),
    clear: () => clearBenchmarks(),
  };
}
