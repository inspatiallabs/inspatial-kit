// eslint-disable-next-line no-empty-function
export function nop(): void {}

export function cached<T, R>(handler: (arg: T) => R): (arg: T) => R {
	const store = new Map<T, R>()
	return function(arg: T): R {
		let val = store.get(arg)
		if (val === undefined) {
			val = handler(arg)
			store.set(arg, val)
		}
		return val
	}
}

export function cachedStrKeyNoFalsy<T>(handler: (key: string) => T): (key: string) => T {
	const store: Record<string, T> = Object.create(null)
	return function(key: string): T {
		return (store[key] || (store[key] = handler(key)))
	}
}

export function removeFromArr<T>(arr: T[], val: T): void {
  const index = arr.indexOf(val)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function isPrimitive(val: unknown): val is string | number | boolean | null | undefined | symbol | bigint {
	return Object(val) !== val
}

export function isThenable<T = unknown>(val: unknown): val is Promise<T> | { then: (onFulfilled?: (value: unknown) => T | PromiseLike<T>) => PromiseLike<T> } {
	return Boolean(val && typeof (val as any).then === 'function')
}

export function splitFirst(val: string, splitter: string): [string] | [string, string] {
	const idx = val.indexOf(splitter)
	if (idx < 0) return [val]
	const front = val.slice(0, idx)
	const back = val.slice(idx + splitter.length, val.length)
	return [front, back]
} 

/**
 * @fileoverview Shared utilities for HOT plugins
 * @module @inspatial/kit/hot/utils
 */

/**
 * Filter pattern types for file inclusion/exclusion
 */
export type FilterPattern = string | RegExp | Array<string | RegExp>;

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
export function createFilter(include: FilterPattern = [], exclude: FilterPattern = []): FilterFunction {
	const includePatterns = Array.isArray(include) ? include : [include];
	const excludePatterns = Array.isArray(exclude) ? exclude : [exclude];

	// Convert glob patterns to regex
	function globToRegex(pattern: string | RegExp): RegExp {
		if (pattern instanceof RegExp) {
			return pattern;
		}
		return new RegExp(
			pattern
				.replace(/\./g, "\\.")
				.replace(/\*\*/g, ".*")
				.replace(/\*/g, "[^/]*")
				.replace(/\?/g, "[^/]")
		);
	}

	const includeRegexes = includePatterns.map(globToRegex);
	const excludeRegexes = excludePatterns.map(globToRegex);

	return function filter(id: string): boolean {
		// Check excludes first
		if (excludeRegexes.some((regex) => regex.test(id))) {
			return false;
		}

		// If no includes specified, include everything (that's not excluded)
		if (includePatterns.length === 0) {
			return true;
		}

		// Check includes
		return includeRegexes.some((regex) => regex.test(id));
	};
}

/**
 * Default file patterns for InSpatial HOT
 */
export const DEFAULT_INCLUDE_PATTERNS: string[] = ["**/*.jsx", "**/*.tsx", "**/*.mdx"]; 