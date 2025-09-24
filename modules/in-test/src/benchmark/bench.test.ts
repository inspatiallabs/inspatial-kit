import {
  test,
  expect,
  bench,
  clearBenchmarks,
  getBenchmarks,
} from "./index.ts";

test("bench API should register benchmarks", () => {
  clearBenchmarks();

  bench("test benchmark", () => {
    // Simple operation
    let sum = 0;
    for (let i = 0; i < 100; i++) {
      sum += i;
    }
  });

  const benchmarks = getBenchmarks();
  expect(benchmarks).toHaveLength(1);
  expect(benchmarks[0].name).toBe("test benchmark");
});

test("bench API should support options", () => {
  clearBenchmarks();

  bench("baseline test", { baseline: true, group: "math" }, () => {
    const result = 2 + 2;
  });

  const benchmarks = getBenchmarks();
  expect(benchmarks).toHaveLength(1);
  expect(benchmarks[0].options.baseline).toBe(true);
  expect(benchmarks[0].options.group).toBe("math");
});

test("bench API should support modifiers", () => {
  clearBenchmarks();

  bench.only("only test", () => {
    const value = true;
  });

  bench.ignore("ignored test", () => {
    const value = false;
  });

  const benchmarks = getBenchmarks();
  expect(benchmarks).toHaveLength(2);
  expect(benchmarks.find((b) => b.name === "only test")?.options.only).toBe(
    true
  );
  expect(
    benchmarks.find((b) => b.name === "ignored test")?.options.ignore
  ).toBe(true);
});

test("bench context should provide timing control", () => {
  clearBenchmarks();

  bench("context test", (b) => {
    expect(b.name).toBe("context test");
    expect(typeof b.start).toBe("function");
    expect(typeof b.end).toBe("function");

    // Test timing control
    b.start();
    // Some operation
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += i;
    }
    b.end();
  });

  const benchmarks = getBenchmarks();
  expect(benchmarks).toHaveLength(1);
  expect(benchmarks[0].name).toBe("context test");
  expect(typeof benchmarks[0].fn).toBe("function");
});
