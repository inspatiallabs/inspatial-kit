/**
 * @license
 * MIT License
 *
 * Copyright (c) 2019 RollupJS Plugin Contributors (https://github.com/rollup/plugins/graphs/contributors)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/* -----------------------------------------------------------------------------
 * Modifications by InSpatial Labs
 * SPDX-License-Identifier: Apache-2.0
 * © 2026 InSpatial Labs. Portions © 2025 Yukino Song, SudoMaker Ltd.
 *
 * Description: Hot Reload (InSpatial Hot Reload) – refactors and extensions.
 * Version: v0.7.0
 * Project: https://inspatial.dev
 * --------------------------------------------------------------------------- */

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
