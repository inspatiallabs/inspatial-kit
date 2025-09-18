# Testing & Specifications

### Vitest ↔ InSpatial Test Equivalents

#### A friendly map from Vitest to @in/test so you can switch without friction

InSpatial Test is built on InSpatial's `@in/test`. Use this quick table to see the equivalent of common Vitest APIs. It’s designed to feel familiar while keeping tests readable and fast.

| What you want to do | Vitest | @in/test | Notes |
| --- | --- | --- | --- |
| Define a suite | `describe()` | `describe()` | Same usage and semantics. |
| Define a test | `it()` / `test()` | `it()` / `test()` | Both are available. |
| Basic assertions | `expect(value)` | `expect(value)` | Common matchers supported. |
| Create a mock function | `vi.fn()` | `mockFn()` | `mockFn` keeps call history; use `getMockCalls(mock)` to inspect. |
| Spy on a method | `vi.spyOn(obj, 'm')` | `spy(obj, 'm')` | Non-invasive: records calls/returns/errors. |
| Replace (stub) a method | n/a | `stub(obj, 'm', impl)` | Fully replaces implementation and records calls. |
| Restore all mocks | `vi.restoreAllMocks()` | `restoreTest()` | Or use `using` with `spy/stub` for auto-restore. |
| Start fake timers | `vi.useFakeTimers()` | `new FakeTime()` | Controls Date, timeouts, intervals. |
| Advance timers | `vi.advanceTimersByTime(ms)` | `time.tick(ms)` | Also `time.tickAsync(ms)`. |
| Run all timers | `vi.runAllTimers()` | `time.runAll()` / `time.runAllAsync()` | Flush all scheduled timers. |
| Mock return once | `vi.fn().mockReturnValueOnce(v)` | `returnsNext([v, ...])` | Sequential sync returns. |
| Mock resolve once | `vi.fn().mockResolvedValueOnce(v)` | `resolvesNext([v, ...])` | Sequential async resolves/rejections. |
| Assert calls (count) | `expect(fn).toHaveBeenCalledTimes(n)` | `assertSpyCalls(spy, n)` | Works with `spy`/`stub`. |
| Assert calls (args/return) | `expect(fn).toHaveBeenCalledWith(...)` | `assertSpyCall(spy, idx, { args, returned })` | Check a specific call by index. |
| Snapshots | `expect(v).toMatchSnapshot()` | `assertSnapshot(t, v, opts?)` | Uses test context `t`. Also `createAssertSnapshot`. |
| Wait for condition | `vi.waitFor(fn)` | custom await/poll | Use your own loop or drive with `FakeTime` and re-assert. |

> **Note:** For multi-step mocking, prefer `spy(obj, 'method')` if you just need to observe; use `stub(obj, 'method', impl)` when you need to replace behavior.

### Handy snippets

```ts
// Mock function (like vi.fn)
import { mockFn, getMockCalls } from "@in/test";
const fn = mockFn((a: number) => a + 1);
fn(1);
console.log(getMockCalls(fn).length); // 1
```

```ts
// Spy and assert
import { spy, assertSpyCalls, assertSpyCall } from "@in/test";
const math = { add: (a: number, b: number) => a + b };
using s = spy(math, "add");
math.add(2, 3);
assertSpyCalls(s, 1);
assertSpyCall(s, 0, { args: [2, 3], returned: 5 });
```

```ts
// Fake time
import { FakeTime } from "@in/test";
using t = new FakeTime();
let hits = 0;
setTimeout(() => hits++, 1000);
t.tick(1000);
// hits === 1
```

```ts
// Snapshots
import { assertSnapshot } from "@in/test";
// inside a test with context `t`
await assertSnapshot(t, { hello: "world" });
```

> **Note:** To discover `*.spec.*` files, you can use the built-in spec runner task in `@in/test` or include spec globs in your project’s `deno.json` test task.
