/**
 * Retry utilities for handling flaky tests in CI/CD environments
 *
 * @module retry
 */

/**
 * Retry a test function multiple times with configurable delay
 *
 * @param testFn - The test function to retry
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @param delay - Delay between retries in milliseconds (default: 1000)
 * @returns Promise that resolves with the test result or rejects after all retries fail
 *
 * @example
 * ```typescript
 * import { retryTest } from "@inspatial/kit/test";
 *
 * test("flaky network operation", async () => {
 *   await retryTest(async () => {
 *     const response = await fetch("https://api.example.com/data");
 *     expect(response.ok).toBe(true);
 *   }, 3, 2000);
 * });
 * ```
 */
export async function retryTest<T>(
  testFn: () => Promise<T> | T,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await testFn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        throw new Error(
          `Test failed after ${maxRetries} attempts: ${lastError.message}`
        );
      }

      console.warn(`Test attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

/**
 * Retry a test function with exponential backoff
 *
 * @param testFn - The test function to retry
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @param initialDelay - Initial delay in milliseconds (default: 1000)
 * @param backoffMultiplier - Multiplier for exponential backoff (default: 2)
 * @returns Promise that resolves with the test result or rejects after all retries fail
 *
 * @example
 * ```typescript
 * import { retryTestWithBackoff } from "@inspatial/kit/test";
 *
 * test("database connection", async () => {
 *   await retryTestWithBackoff(async () => {
 *     const db = await connectToDatabase();
 *     expect(db.isConnected()).toBe(true);
 *   }, 5, 500, 2); // 500ms, 1s, 2s, 4s, 8s delays
 * });
 * ```
 */
export async function retryTestWithBackoff<T>(
  testFn: () => Promise<T> | T,
  maxRetries: number = 3,
  initialDelay: number = 1000,
  backoffMultiplier: number = 2
): Promise<T> {
  let lastError: Error;
  let currentDelay = initialDelay;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await testFn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        throw new Error(
          `Test failed after ${maxRetries} attempts with exponential backoff: ${lastError.message}`
        );
      }

      console.warn(
        `Test attempt ${attempt} failed, retrying in ${currentDelay}ms...`
      );
      await new Promise((resolve) => setTimeout(resolve, currentDelay));
      currentDelay *= backoffMultiplier;
    }
  }

  throw lastError!;
}

/**
 * Retry a test function with custom retry conditions
 *
 * @param testFn - The test function to retry
 * @param shouldRetry - Function that determines if the error should trigger a retry
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @param delay - Delay between retries in milliseconds (default: 1000)
 * @returns Promise that resolves with the test result or rejects after all retries fail
 *
 * @example
 * ```typescript
 * import { retryTestConditional } from "@inspatial/kit/test";
 *
 * test("network operation with specific retry conditions", async () => {
 *   await retryTestConditional(
 *     async () => {
 *       const response = await fetch("https://api.example.com/data");
 *       if (!response.ok) throw new Error(`HTTP ${response.status}`);
 *       return response.json();
 *     },
 *     (error) => {
 *       // Only retry on network errors or 5xx status codes
 *       return error.message.includes('HTTP 5') || error.message.includes('network');
 *     },
 *     3,
 *     2000
 *   );
 * });
 * ```
 */
export async function retryTestConditional<T>(
  testFn: () => Promise<T> | T,
  shouldRetry: (error: Error) => boolean,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await testFn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries || !shouldRetry(lastError)) {
        throw lastError;
      }

      console.warn(`Test attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

/**
 * Retry configuration options
 */
export interface RetryOptions {
  /** Maximum number of retry attempts */
  maxRetries?: number;
  /** Delay between retries in milliseconds */
  delay?: number;
  /** Whether to use exponential backoff */
  exponentialBackoff?: boolean;
  /** Backoff multiplier for exponential backoff */
  backoffMultiplier?: number;
  /** Custom function to determine if an error should trigger a retry */
  shouldRetry?: (error: Error) => boolean;
  /** Custom function to calculate delay for each attempt */
  calculateDelay?: (attempt: number, baseDelay: number) => number;
}

/**
 * Advanced retry function with comprehensive options
 *
 * @param testFn - The test function to retry
 * @param options - Retry configuration options
 * @returns Promise that resolves with the test result or rejects after all retries fail
 *
 * @example
 * ```typescript
 * import { retry } from "@inspatial/kit/test";
 *
 * test("advanced retry example", async () => {
 *   await retry(
 *     async () => {
 *       const result = await someFlakeyOperation();
 *       expect(result).toBeDefined();
 *       return result;
 *     },
 *     {
 *       maxRetries: 5,
 *       exponentialBackoff: true,
 *       backoffMultiplier: 1.5,
 *       shouldRetry: (error) => !error.message.includes('permanent'),
 *       calculateDelay: (attempt, baseDelay) => baseDelay + (attempt * 100)
 *     }
 *   );
 * });
 * ```
 */
export async function retry<T>(
  testFn: () => Promise<T> | T,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    delay = 1000,
    exponentialBackoff = false,
    backoffMultiplier = 2,
    shouldRetry = () => true,
    calculateDelay,
  } = options;

  let lastError: Error;
  let currentDelay = delay;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await testFn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries || !shouldRetry(lastError)) {
        throw lastError;
      }

      // Calculate delay for this attempt
      let retryDelay = currentDelay;
      if (calculateDelay) {
        retryDelay = calculateDelay(attempt, delay);
      } else if (exponentialBackoff) {
        retryDelay = currentDelay;
        currentDelay *= backoffMultiplier;
      }

      console.warn(
        `Test attempt ${attempt} failed, retrying in ${retryDelay}ms...`
      );
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }

  throw lastError!;
}
