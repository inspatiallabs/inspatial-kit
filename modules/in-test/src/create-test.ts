/**
 * Syntactic sugar for creating scoped tests with optional suite/prefix.
 *
 * Usage:
 * ```ts
 * import { createTest } from "@inspatial/kit/test";
 *
 * const t = createTest("Authentication");
 * t("should login", async () => { /* ... *\/ });
 * t.skip?.("should logout", () => { /* ... *\/ });
 * ```
 */
import { test } from "./runtime.ts";

export interface CreateTestOptions {
  /** Optional suite name to prefix test names */
  suite?: string;
  /** Optional textual prefix if you prefer */
  prefix?: string;
}

export interface TestCreator {
  (name: string, fn: () => unknown | Promise<unknown>): void;
  only?: (name: string, fn: () => unknown | Promise<unknown>) => void;
  skip?: (name: string, fn: () => unknown | Promise<unknown>) => void;
  todo?: (name: string, fn?: () => unknown | Promise<unknown>) => void;
}

export function createTest(options?: CreateTestOptions | string): TestCreator {
  const suite = typeof options === "string" ? options : options?.suite || options?.prefix;

  const call = (name: string, fn: () => unknown | Promise<unknown>) => {
    const fullName = suite ? `${suite} › ${name}` : name;
    return (test as (name: string, fn: () => unknown | Promise<unknown>) => void)(
      fullName,
      fn
    );
  };

  const creator = call as TestCreator;

  // Attach modifiers if available on the underlying test implementation
  const anyTest = test as unknown as Record<string, any>;

  if (typeof anyTest.only === "function") {
    creator.only = (name, fn) => {
      const fullName = suite ? `${suite} › ${name}` : name;
      return anyTest.only(fullName, fn);
    };
  }

  if (typeof anyTest.skip === "function") {
    creator.skip = (name, fn) => {
      const fullName = suite ? `${suite} › ${name}` : name;
      return anyTest.skip(fullName, fn);
    };
  }

  if (typeof anyTest.todo === "function") {
    creator.todo = (name, fn?) => {
      const fullName = suite ? `${suite} › ${name}` : name;
      return anyTest.todo(fullName, fn);
    };
  }

  return creator;
}


