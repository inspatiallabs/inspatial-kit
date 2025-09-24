/**
 * Resource cleanup utilities for test environments
 *
 * @module cleanup
 */

/**
 * Test cleanup manager for handling resource cleanup in tests
 *
 * @example
 * ```typescript
 * import { TestCleanup } from "@inspatial/kit/test";
 *
 * test("database operations", async () => {
 *   const cleanup = new TestCleanup();
 *
 *   try {
 *     const testDb = await createTestDatabase();
 *     cleanup.addCleanup(() => testDb.close());
 *
 *     const testUser = await createTestUser(testDb);
 *     cleanup.addCleanup(() => deleteTestUser(testUser.id));
 *
 *     // Run your tests
 *     expect(testUser.name).toBe("Test User");
 *
 *   } finally {
 *     await cleanup.cleanup();
 *   }
 * });
 * ```
 */
export class TestCleanup {
  private cleanupTasks: Array<() => Promise<void> | void> = [];
  private cleaned = false;

  /**
   * Add a cleanup task to be executed later
   *
   * @param task - Function to execute during cleanup
   */
  addCleanup(task: () => Promise<void> | void): void {
    if (this.cleaned) {
      console.warn(
        "Warning: Adding cleanup task after cleanup has already been performed"
      );
    }
    this.cleanupTasks.push(task);
  }

  /**
   * Execute all cleanup tasks in reverse order (LIFO)
   *
   * @param options - Cleanup options
   */
  async cleanup(options: CleanupOptions = {}): Promise<void> {
    const { continueOnError = true, logErrors = true } = options;

    if (this.cleaned) {
      return;
    }

    const errors: Error[] = [];

    // Execute cleanup tasks in reverse order (LIFO - Last In, First Out)
    for (const task of this.cleanupTasks.reverse()) {
      try {
        await task();
      } catch (error) {
        const cleanupError = error as Error;
        errors.push(cleanupError);

        if (logErrors) {
          console.warn("Cleanup task failed:", cleanupError.message);
        }

        if (!continueOnError) {
          break;
        }
      }
    }

    this.cleanupTasks = [];
    this.cleaned = true;

    // If there were errors and we're not continuing on error, throw the first one
    if (errors.length > 0 && !continueOnError) {
      throw errors[0];
    }

    // If there were multiple errors, log them
    if (errors.length > 1 && logErrors) {
      console.warn(`${errors.length} cleanup tasks failed`);
    }
  }

  /**
   * Get the number of pending cleanup tasks
   */
  get pendingTasks(): number {
    return this.cleanupTasks.length;
  }

  /**
   * Check if cleanup has been performed
   */
  get isCleanedUp(): boolean {
    return this.cleaned;
  }

  /**
   * Clear all cleanup tasks without executing them
   */
  clear(): void {
    this.cleanupTasks = [];
  }
}

/**
 * Options for cleanup execution
 */
export interface CleanupOptions {
  /** Continue executing cleanup tasks even if one fails (default: true) */
  continueOnError?: boolean;
  /** Log cleanup errors to console (default: true) */
  logErrors?: boolean;
}

/**
 * Global cleanup manager for test suites
 */
class GlobalCleanupManager {
  private cleanupInstances: Set<TestCleanup> = new Set();
  private globalTasks: Array<() => Promise<void> | void> = [];

  /**
   * Register a TestCleanup instance for global cleanup
   */
  register(cleanup: TestCleanup): void {
    this.cleanupInstances.add(cleanup);
  }

  /**
   * Unregister a TestCleanup instance
   */
  unregister(cleanup: TestCleanup): void {
    this.cleanupInstances.delete(cleanup);
  }

  /**
   * Add a global cleanup task
   */
  addGlobalCleanup(task: () => Promise<void> | void): void {
    this.globalTasks.push(task);
  }

  /**
   * Cleanup all registered instances and global tasks
   */
  async cleanupAll(options: CleanupOptions = {}): Promise<void> {
    const errors: Error[] = [];

    // Cleanup all registered TestCleanup instances
    for (const cleanup of Array.from(this.cleanupInstances)) {
      try {
        await cleanup.cleanup(options);
      } catch (error) {
        errors.push(error as Error);
      }
    }

    // Execute global cleanup tasks
    for (const task of this.globalTasks.reverse()) {
      try {
        await task();
      } catch (error) {
        errors.push(error as Error);
        if (!options.continueOnError) {
          break;
        }
      }
    }

    this.cleanupInstances.clear();
    this.globalTasks = [];

    if (errors.length > 0 && !options.continueOnError) {
      throw errors[0];
    }
  }
}

/**
 * Global cleanup manager instance
 */
export const globalCleanup = new GlobalCleanupManager();

/**
 * Decorator for automatic cleanup registration
 *
 * @example
 * ```typescript
 * import { withCleanup } from "@inspatial/kit/test";
 *
 * test("automatic cleanup", withCleanup(async (cleanup) => {
 *   const resource = await createResource();
 *   cleanup.addCleanup(() => resource.dispose());
 *
 *   // Test logic here
 *   expect(resource.isActive()).toBe(true);
 *
 *   // Cleanup happens automatically
 * }));
 * ```
 */
export function withCleanup<T>(
  testFn: (cleanup: TestCleanup) => Promise<T> | T
): () => Promise<T> {
  return async () => {
    const cleanup = new TestCleanup();
    globalCleanup.register(cleanup);

    try {
      return await testFn(cleanup);
    } finally {
      await cleanup.cleanup();
      globalCleanup.unregister(cleanup);
    }
  };
}

/**
 * Create a temporary directory that will be cleaned up automatically
 *
 * @param prefix - Prefix for the temporary directory name
 * @returns Object with path and cleanup function
 *
 * @example
 * ```typescript
 * import { createTempDir } from "@inspatial/kit/test";
 *
 * test("file operations", async () => {
 *   const { path: tempDir, cleanup } = await createTempDir("test-");
 *
 *   try {
 *     // Use tempDir for file operations
 *     await Deno.writeTextFile(`${tempDir}/test.txt`, "content");
 *     const content = await Deno.readTextFile(`${tempDir}/test.txt`);
 *     expect(content).toBe("content");
 *   } finally {
 *     await cleanup();
 *   }
 * });
 * ```
 */
export async function createTempDir(prefix: string = "test-"): Promise<{
  path: string;
  cleanup: () => Promise<void>;
}> {
  let tempDir: string;

  // Create temporary directory based on runtime
  if (typeof Deno !== "undefined") {
    tempDir = await Deno.makeTempDir({ prefix });
  } else if (typeof require !== "undefined") {
    // Node.js environment
    const { mkdtemp } = require("fs/promises");
    const { tmpdir } = require("os");
    const path = require("path");
    tempDir = await mkdtemp(path.join(tmpdir(), prefix));
  } else {
    // Fallback for other environments
    tempDir = `/tmp/${prefix}${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Try to create the directory
    try {
      if (typeof Deno !== "undefined") {
        await Deno.mkdir(tempDir, { recursive: true });
      }
    } catch (error) {
      console.warn("Failed to create temp directory:", error);
    }
  }

  const cleanup = async () => {
    try {
      if (typeof Deno !== "undefined") {
        await Deno.remove(tempDir, { recursive: true });
      } else if (typeof require !== "undefined") {
        const { rm } = require("fs/promises");
        await rm(tempDir, { recursive: true, force: true });
      }
    } catch (error) {
      console.warn(`Failed to cleanup temp directory ${tempDir}:`, error);
    }
  };

  return { path: tempDir, cleanup };
}

/**
 * Create a temporary file that will be cleaned up automatically
 *
 * @param content - Initial content for the file
 * @param suffix - File extension or suffix
 * @returns Object with path and cleanup function
 *
 * @example
 * ```typescript
 * import { createTempFile } from "@inspatial/kit/test";
 *
 * test("file processing", async () => {
 *   const { path: tempFile, cleanup } = await createTempFile("initial content", ".txt");
 *
 *   try {
 *     // Process the file
 *     const content = await Deno.readTextFile(tempFile);
 *     expect(content).toBe("initial content");
 *   } finally {
 *     await cleanup();
 *   }
 * });
 * ```
 */
export async function createTempFile(
  content: string = "",
  suffix: string = ".tmp"
): Promise<{
  path: string;
  cleanup: () => Promise<void>;
}> {
  let tempFile: string;

  if (typeof Deno !== "undefined") {
    tempFile = await Deno.makeTempFile({ suffix });
    if (content) {
      await Deno.writeTextFile(tempFile, content);
    }
  } else if (typeof require !== "undefined") {
    // Node.js environment
    const { mkstemp } = require("fs/promises");
    const { tmpdir } = require("os");
    const path = require("path");
    const fs = require("fs/promises");

    tempFile = path.join(
      tmpdir(),
      `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}${suffix}`
    );
    await fs.writeFile(tempFile, content);
  } else {
    // Fallback
    tempFile = `/tmp/temp-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}${suffix}`;

    try {
      if (typeof Deno !== "undefined") {
        await Deno.writeTextFile(tempFile, content);
      }
    } catch (error) {
      console.warn("Failed to create temp file:", error);
    }
  }

  const cleanup = async () => {
    try {
      if (typeof Deno !== "undefined") {
        await Deno.remove(tempFile);
      } else if (typeof require !== "undefined") {
        const fs = require("fs/promises");
        await fs.unlink(tempFile);
      }
    } catch (error) {
      console.warn(`Failed to cleanup temp file ${tempFile}:`, error);
    }
  };

  return { path: tempFile, cleanup };
}

/**
 * Resource manager for automatic cleanup of various resource types
 *
 * @example
 * ```typescript
 * import { ResourceManager } from "@inspatial/kit/test";
 *
 * test("resource management", async () => {
 *   const resources = new ResourceManager();
 *
 *   try {
 *     const db = await resources.manage(createDatabase(), db => db.close());
 *     const server = await resources.manage(startServer(), server => server.stop());
 *
 *     // Use resources
 *     expect(db.isConnected()).toBe(true);
 *     expect(server.isRunning()).toBe(true);
 *
 *   } finally {
 *     await resources.cleanup();
 *   }
 * });
 * ```
 */
export class ResourceManager {
  private resources: Array<{
    resource: any;
    cleanup: (resource: any) => Promise<void> | void;
  }> = [];

  /**
   * Manage a resource with automatic cleanup
   *
   * @param resource - The resource to manage
   * @param cleanupFn - Function to cleanup the resource
   * @returns The managed resource
   */
  manage<T>(resource: T, cleanupFn: (resource: T) => Promise<void> | void): T {
    this.resources.push({ resource, cleanup: cleanupFn });
    return resource;
  }

  /**
   * Cleanup all managed resources
   */
  async cleanup(): Promise<void> {
    const errors: Error[] = [];

    // Cleanup in reverse order
    for (const { resource, cleanup } of this.resources.reverse()) {
      try {
        await cleanup(resource);
      } catch (error) {
        errors.push(error as Error);
        console.warn("Resource cleanup failed:", error);
      }
    }

    this.resources = [];

    if (errors.length > 0) {
      console.warn(`${errors.length} resource cleanup operations failed`);
    }
  }

  /**
   * Get the number of managed resources
   */
  get count(): number {
    return this.resources.length;
  }
}
