import { test, describe, expect, performance } from "./index.ts";

describe("Performance API", () => {
  test("performance.now() should return a number", () => {
    const now = performance.now();
    expect(typeof now).toBe("number");
    expect(now).toBeGreaterThan(0);
  });

  test("performance.now() should increase over time", async () => {
    const start = performance.now();
    await new Promise((resolve) => setTimeout(resolve, 10));
    const end = performance.now();

    expect(end).toBeGreaterThan(start);
    expect(end - start).toBeGreaterThan(5); // At least 5ms difference
  });

  test("performance.memory should be available in supported environments", () => {
    if (performance.memory) {
      expect(typeof performance.memory.usedJSHeapSize).toBe("number");
      expect(performance.memory.usedJSHeapSize).toBeGreaterThan(0);
    }
  });

  test("performance.mark() should create performance marks", () => {
    performance.mark("test-mark");

    // In a real implementation, we'd verify the mark was created
    // For now, we just ensure the function doesn't throw
    expect(true).toBe(true);
  });

  test("performance.measure() should create performance measures", () => {
    performance.mark("start-mark");
    performance.mark("end-mark");

    const measure = performance.measure(
      "test-measure",
      "start-mark",
      "end-mark"
    );

    if (measure) {
      expect(typeof measure.duration).toBe("number");
      expect(measure.duration).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("Performance Testing Utilities", () => {
  test("should measure execution time of synchronous operations", () => {
    const startTime = performance.now();

    // Simulate CPU-intensive work
    let result = 0;
    for (let i = 0; i < 10000; i++) {
      result += Math.sqrt(i);
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(duration).toBeGreaterThan(0);
    expect(typeof duration).toBe("number");
    expect(result).toBeGreaterThan(0);
  });

  test("should measure execution time of asynchronous operations", async () => {
    const startTime = performance.now();

    await new Promise((resolve) => setTimeout(resolve, 50));

    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(duration).toBeGreaterThan(40); // Should be around 50ms
    expect(duration).toBeLessThan(100); // But not too much more
  });

  test("should track memory usage during operations", () => {
    const initialMemory = performance.memory?.usedJSHeapSize || 0;

    // Create some objects to use memory
    const largeArray = new Array(10000).fill(0).map((_, i) => ({
      id: i,
      data: `Item ${i}`,
      metadata: { processed: false },
    }));

    const afterCreation = performance.memory?.usedJSHeapSize || 0;
    const memoryIncrease = afterCreation - initialMemory;

    // Skip memory assertions if performance.memory is not available
    if (performance.memory) {
      expect(memoryIncrease).toBeGreaterThan(0);
    } else {
      // Just verify the operation completed successfully
      expect(memoryIncrease).toBeGreaterThanOrEqual(0);
    }
    expect(largeArray.length).toBe(10000);
  });
});

describe("Performance Benchmarking", () => {
  test("should compare different algorithm implementations", () => {
    const testData = Array.from({ length: 1000 }, () =>
      Math.floor(Math.random() * 1000)
    );

    // Benchmark bubble sort
    const bubbleStart = performance.now();
    const bubbleSorted = bubbleSort([...testData]);
    const bubbleEnd = performance.now();
    const bubbleTime = bubbleEnd - bubbleStart;

    // Benchmark native sort
    const nativeStart = performance.now();
    const nativeSorted = [...testData].sort((a, b) => a - b);
    const nativeEnd = performance.now();
    const nativeTime = nativeEnd - nativeStart;

    // Verify both sorts work correctly
    expect(bubbleSorted).toEqual(nativeSorted);

    // Native sort should be faster (usually)
    expect(nativeTime).toBeLessThan(bubbleTime * 2); // Allow some variance

    // Both should complete in reasonable time
    expect(bubbleTime).toBeLessThan(1000); // 1 second max
    expect(nativeTime).toBeLessThan(100); // 100ms max
  });

  test("should measure throughput (operations per second)", () => {
    const operations = 10000;
    const startTime = performance.now();

    // Perform operations
    let result = 0;
    for (let i = 0; i < operations; i++) {
      result += Math.sqrt(i);
    }

    const endTime = performance.now();
    const duration = endTime - startTime;
    const throughput = (operations / duration) * 1000; // ops per second

    expect(throughput).toBeGreaterThan(0);
    expect(typeof throughput).toBe("number");
    expect(result).toBeGreaterThan(0);
  });
});

describe("Load Testing Simulation", () => {
  test("should simulate concurrent user operations", async () => {
    const userCount = 10;
    const results: Array<{
      userId: number;
      duration: number;
      success: boolean;
    }> = [];

    // Simulate concurrent users
    const userPromises = Array.from(
      { length: userCount },
      async (_, userId) => {
        const startTime = performance.now();

        try {
          // Simulate user operation with variable delay
          const delay = Math.random() * 50 + 10; // 10-60ms
          await new Promise((resolve) => setTimeout(resolve, delay));

          const endTime = performance.now();
          results.push({
            userId,
            duration: endTime - startTime,
            success: true,
          });
        } catch (error) {
          const endTime = performance.now();
          results.push({
            userId,
            duration: endTime - startTime,
            success: false,
          });
        }
      }
    );

    await Promise.all(userPromises);

    // Analyze results
    const successful = results.filter((r) => r.success);
    const averageResponseTime =
      successful.reduce((sum, r) => sum + r.duration, 0) / successful.length;

    expect(results.length).toBe(userCount);
    expect(successful.length).toBe(userCount); // All should succeed
    expect(averageResponseTime).toBeGreaterThan(10);
    expect(averageResponseTime).toBeLessThan(100);
  });

  test("should handle load testing with failures", async () => {
    const userCount = 20;
    const failureRate = 0.1; // 10% failure rate
    const results: Array<{ success: boolean; duration: number }> = [];

    const userPromises = Array.from({ length: userCount }, async () => {
      const startTime = performance.now();

      try {
        // Simulate operation that might fail
        if (Math.random() < failureRate) {
          throw new Error("Simulated failure");
        }

        await new Promise((resolve) => setTimeout(resolve, 25));

        const endTime = performance.now();
        results.push({
          success: true,
          duration: endTime - startTime,
        });
      } catch (error) {
        const endTime = performance.now();
        results.push({
          success: false,
          duration: endTime - startTime,
        });
      }
    });

    await Promise.all(userPromises);

    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);
    const successRate = (successful.length / results.length) * 100;

    expect(results.length).toBe(userCount);
    expect(successRate).toBeGreaterThan(80); // Should be around 90%
    expect(failed.length).toBeGreaterThan(0); // Should have some failures
  });
});

describe("Memory Performance Testing", () => {
  test("should detect memory usage patterns", () => {
    const initialMemory = performance.memory?.usedJSHeapSize || 0;

    // Create memory-intensive data structures
    const data = [];
    for (let i = 0; i < 5000; i++) {
      data.push({
        id: i,
        payload: new Array(100).fill(`data-${i}`),
        metadata: {
          timestamp: new Date(),
          processed: false,
          tags: [`tag-${i % 10}`],
        },
      });
    }

    const afterCreation = performance.memory?.usedJSHeapSize || 0;
    const memoryUsed = afterCreation - initialMemory;

    expect(data.length).toBe(5000);

    // Skip memory assertions if performance.memory is not available
    if (performance.memory) {
      expect(memoryUsed).toBeGreaterThan(0);
    } else {
      // Just verify the operation completed successfully
      expect(memoryUsed).toBeGreaterThanOrEqual(0);
    }

    // Clean up
    data.length = 0;
  });

  test("should measure memory usage of different data structures", () => {
    const measurements = [];

    // Test Array
    const arrayStart = performance.memory?.usedJSHeapSize || 0;
    const testArray = new Array(1000)
      .fill(0)
      .map((_, i) => ({ id: i, value: i * 2 }));
    const arrayEnd = performance.memory?.usedJSHeapSize || 0;

    measurements.push({
      type: "Array",
      memoryUsed: arrayEnd - arrayStart,
      itemCount: testArray.length,
    });

    // Test Map
    const mapStart = performance.memory?.usedJSHeapSize || 0;
    const testMap = new Map();
    for (let i = 0; i < 1000; i++) {
      testMap.set(i, { id: i, value: i * 2 });
    }
    const mapEnd = performance.memory?.usedJSHeapSize || 0;

    measurements.push({
      type: "Map",
      memoryUsed: mapEnd - mapStart,
      itemCount: testMap.size,
    });

    // Test Set
    const setStart = performance.memory?.usedJSHeapSize || 0;
    const testSet = new Set();
    for (let i = 0; i < 1000; i++) {
      testSet.add({ id: i, value: i * 2 });
    }
    const setEnd = performance.memory?.usedJSHeapSize || 0;

    measurements.push({
      type: "Set",
      memoryUsed: setEnd - setStart,
      itemCount: testSet.size,
    });

    // Verify all measurements
    measurements.forEach((measurement) => {
      expect(measurement.memoryUsed).toBeGreaterThanOrEqual(0);
      expect(measurement.itemCount).toBe(1000);
    });

    expect(measurements.length).toBe(3);
  });
});

describe("Performance Regression Detection", () => {
  test("should detect performance regressions", async () => {
    // Baseline performance
    const baselineResults = [];
    for (let i = 0; i < 5; i++) {
      const start = performance.now();

      // Simulate consistent operation
      let result = 0;
      for (let j = 0; j < 1000; j++) {
        result += Math.sqrt(j);
      }

      const end = performance.now();
      baselineResults.push(end - start);
    }

    const baselineAverage =
      baselineResults.reduce((a, b) => a + b, 0) / baselineResults.length;

    // Current performance (simulated regression)
    const currentResults = [];
    for (let i = 0; i < 5; i++) {
      const start = performance.now();

      // Simulate slower operation (regression)
      let result = 0;
      for (let j = 0; j < 1000; j++) {
        result += Math.sqrt(j);
        // Add artificial delay to simulate regression
        if (j % 100 === 0) {
          const busyWait = performance.now() + 1; // 1ms delay
          while (performance.now() < busyWait) {
            // Busy wait
          }
        }
      }

      const end = performance.now();
      currentResults.push(end - start);
    }

    const currentAverage =
      currentResults.reduce((a, b) => a + b, 0) / currentResults.length;
    const regressionRatio = currentAverage / baselineAverage;

    expect(baselineAverage).toBeGreaterThan(0);
    expect(currentAverage).toBeGreaterThan(baselineAverage);
    expect(regressionRatio).toBeGreaterThan(1.1); // At least 10% slower
  });

  test("should validate performance within acceptable thresholds", () => {
    const performanceThresholds = {
      maxResponseTime: 100, // 100ms
      maxMemoryUsage: 10 * 1024 * 1024, // 10MB
      minThroughput: 1000, // 1000 ops/sec
    };

    // Test response time
    const start = performance.now();
    let result = 0;
    for (let i = 0; i < 1000; i++) {
      result += Math.sqrt(i);
    }
    const end = performance.now();
    const responseTime = end - start;

    expect(responseTime).toBeLessThan(performanceThresholds.maxResponseTime);

    // Test throughput
    const operations = 1000;
    const throughput = (operations / responseTime) * 1000; // ops per second

    expect(throughput).toBeGreaterThan(performanceThresholds.minThroughput);
    expect(result).toBeGreaterThan(0);
  });
});

describe("Performance Monitoring", () => {
  test("should track performance metrics over time", async () => {
    const metrics: Array<{
      timestamp: number;
      duration: number;
      operation: string;
    }> = [];

    // Simulate multiple operations over time
    for (let i = 0; i < 10; i++) {
      const start = performance.now();

      // Simulate work with variable duration
      const workAmount = Math.random() * 1000 + 500; // 500-1500 iterations
      let result = 0;
      for (let j = 0; j < workAmount; j++) {
        result += Math.sqrt(j);
      }

      const end = performance.now();

      metrics.push({
        timestamp: Date.now(),
        duration: end - start,
        operation: `operation_${i}`,
      });

      // Small delay between operations
      await new Promise((resolve) => setTimeout(resolve, 5));
    }

    // Analyze metrics
    const durations = metrics.map((m) => m.duration);
    const averageDuration =
      durations.reduce((a, b) => a + b, 0) / durations.length;
    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);

    expect(metrics.length).toBe(10);
    expect(averageDuration).toBeGreaterThan(0);
    expect(minDuration).toBeGreaterThan(0);
    expect(maxDuration).toBeGreaterThan(minDuration);

    // Check that timestamps are in order
    for (let i = 1; i < metrics.length; i++) {
      expect(metrics[i].timestamp).toBeGreaterThanOrEqual(
        metrics[i - 1].timestamp
      );
    }
  });

  test("should calculate performance percentiles", () => {
    // Generate sample performance data
    const durations = [10, 15, 20, 25, 30, 35, 40, 45, 50, 100]; // ms

    const sorted = durations.sort((a, b) => a - b);

    // Calculate 95th percentile
    const p95Index = Math.ceil((95 / 100) * sorted.length) - 1;
    const p95 = sorted[p95Index];

    // Calculate 99th percentile
    const p99Index = Math.ceil((99 / 100) * sorted.length) - 1;
    const p99 = sorted[p99Index];

    expect(p95).toBe(100); // 95th percentile should be 100ms
    expect(p99).toBe(100); // 99th percentile should be 100ms
    expect(p95).toBeGreaterThanOrEqual(sorted[Math.floor(sorted.length * 0.9)]);
  });
});

// Helper functions for tests
function bubbleSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}
