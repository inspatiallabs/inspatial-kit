// eslint-disable-next-line no-empty-function

/**
 * @fileoverview Shared utilities for HOT plugins
 * @module @inspatial/kit/hot/utils
 */

/**
 * Filter pattern types for file inclusion/exclusion
 */
export type FilterPattern =
  | string
  | RegExp
  | FilterFunction
  | Array<string | RegExp | FilterFunction>;

/**
 * Filter function interface
 */
export interface FilterFunction {
  (id: string): boolean;
}

/**
 * Creates a filter function for file inclusion/exclusion based on glob patterns
 *
 * @param include - Patterns to include (defaults to include all)
 * @param exclude - Patterns to exclude
 * @returns Filter function that returns true if file should be included
 *
 * @example
 * ```typescript
 * // Include only TypeScript files, exclude node_modules
 * const filter = createFilter(
 *   ["**\/*.ts", "**\/*.tsx"],
 *   ["**\/node_modules\/**"]
 * );
 *
 * console.log(filter("src/app.tsx")); // true
 * console.log(filter("node_modules\/lib.js")); // false
 * ```
 */
export function createFilter(
  include: FilterPattern = [],
  exclude: FilterPattern = []
): FilterFunction {
  const includePatterns = Array.isArray(include) ? include : [include];
  const excludePatterns = Array.isArray(exclude) ? exclude : [exclude];

  // Convert glob patterns to regex predicate or pass through functions
  function toPredicate(
    pattern: string | RegExp | FilterFunction
  ): FilterFunction {
    if (typeof pattern === "function") return pattern as FilterFunction;
    const regex =
      pattern instanceof RegExp
        ? pattern
        : new RegExp(
            pattern
              .replace(/\./g, "\\.")
              .replace(/\*\*/g, ".*")
              .replace(/\*/g, "[^/]*")
              .replace(/\?/g, "[^/]")
          );
    return (id: string) => regex.test(id);
  }

  const includeTests: FilterFunction[] = includePatterns.map(toPredicate);
  const excludeTests: FilterFunction[] = excludePatterns.map(toPredicate);

  return function filter(id: string): boolean {
    // Exclude takes precedence
    if (excludeTests.some((fn) => fn(id))) return false;
    // If no includes specified, include everything not excluded
    if (includeTests.length === 0) return true;
    // Include when any include test matches
    return includeTests.some((fn) => fn(id));
  };
}

/**
 * Default file patterns for InSpatial HOT
 */
export const DEFAULT_INCLUDE_PATTERNS: string[] = [
  "**/*.js",
  "**/*.ts",
  "**/*.jsx",
  "**/*.tsx",
  "**/*.mdx",
];
