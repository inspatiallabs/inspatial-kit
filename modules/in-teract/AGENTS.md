# InSpatial Interact (@in/teract)

**Universal interactivity and state management system for cross-platform and spatial applications.**

`@in/teract` provides fine-grained reactivity through signals, state management, universal triggers, and an extensible architecture. This system is framework-agnostic and powers reactive applications across web, native, and XR platforms.

---

## Core Concepts

### 1. Signals - Reactive Primitives

Signals are reactive containers that notify observers when their values change. They form the foundation of InSpatial's reactivity system.

**Creating Signals:**

```typescript
import { createSignal, $, computed } from "@in/teract/signal";

// Basic signal
const count = createSignal(0);

// Computed signal (alias: $)
const doubled = computed(() => count.get() * 2);
const tripled = $(() => count.get() * 3);
```

**Reading & Writing:**

```typescript
// Reactive read (creates dependency)
const value = count.get();

// Non-reactive read (no dependency)
const value = count.peek();

// Write
count.set(5);

// Non-reactive write
count.poke(5);

// Manual trigger (for object/array mutations)
count.trigger();
```

**Understanding Signal Read Methods:**

InSpatial signals provide three ways to read values, each serving a specific purpose:

```typescript
const count = createSignal(0);

// 1. .get() - Reactive read (recommended)
// - Creates dependency in effects/computed
// - Triggers re-runs when signal changes
// - Use in: watch(), $(), component body
watch(() => {
  console.log(count.get()); // Tracks count
});

// 2. .peek() - Non-reactive read
// - Does NOT create dependency
// - Read current value without tracking
// - Use when you need value but don't want re-runs
const setDouble = createAction(count, (current) => {
  const other = otherSignal.peek(); // No dependency on otherSignal
  return current * 2;
});

// 3. .value - Syntactic sugar for .get()
// - Getter that internally calls .get()
// - Useful for property-like access: count.value
// - Identical behavior to .get()
watch(() => {
  console.log(count.value); // Same as count.get()
});
```

**When to Use Each:**

| Method    | Reactive? | Use Case                         |
| --------- | --------- | -------------------------------- |
| `.get()`  | ✅ Yes    | Reactive read (recommended)      |
| `.peek()` | ❌ No     | Read without creating dependency |
| `.value`  | ✅ Yes    | Syntactic sugar for `.get()`     |

**NOTE:** `.value` is a convenience wrapper for `.get()` and matches other reactive libraries (Vue's `ref.value`, Solid's getters).

**Signal Auto-Coercion (Important!):**

Signals implement `Symbol.toPrimitive`, which means JavaScript **automatically** calls `.get()` in certain contexts:

```typescript
const count = createSignal(5);

// ✅ Auto-coercion in operations (no .get() needed)
count > 10;        // JavaScript calls Symbol.toPrimitive → .get()
count + 5;         // Auto-coerces to number
`Count: ${count}`; // Auto-coerces to string

// ✅ Explicit .get() (more clear)
count.get() > 10;  // Explicit about reactivity

// ✅ Both work in JSX
<Text>{count}</Text>       // Renderer handles signal
<Text>{count.get()}</Text> // Also works, more explicit
```

**Common Patterns:**

```typescript
// ✅ Good: Use .get() for reactive reads
const doubled = $(() => count.get() * 2);

// ✅ Also Good: .value is syntactic sugar
const tripled = $(() => count.value * 3);

// ✅ Good: Use .peek() to avoid dependency
const setIncrement = createAction(count, (current) => {
  const multiplier = useConfig.multiplier.peek(); // Don't track multiplier
  return current + multiplier;
});

// ❌ Wrong: Using .peek() when you want reactivity
const doubled = $(() => count.peek() * 2); // Won't update when count changes!
```

**Write Methods:**

```typescript
const count = createSignal(0);

// 1. .set(value) - Reactive write (recommended)
count.set(5); // Triggers effects

// 2. .poke(value) - Non-reactive write
count.poke(15); // Updates value, NO effects triggered

// 3. .value = x - Syntactic sugar for .set()
count.value = 10; // Same as count.set(10)
```

**Signal Operations:**

```typescript
const count = createSignal(5);

// Comparisons
const isPositive = count.gt(0); // greater than
const isZero = count.eq(0); // equal
const isNegative = count.lt(0); // less than
const inRange = count.between(0, 10); // range check

// Logical operations
const hasValue = count.hasValue(); // not nullish (returns boolean)
const isValid = count.gt(0).and(count.lt(100));

// Boolean checks
const isTruthy = count.isTruthy();
const isEmpty = count.isEmpty(); // for arrays/strings
```

**Advanced Signal Utilities:**

```typescript
import { merge, derive, extract, tpl, not } from "@in/teract/signal";

// Merge multiple signals
const fullName = merge([firstName, lastName], (f, l) => `${f} ${l}`);

// Derive property from object signal
const userName = derive(user, "name");
const upperName = derive(user, "name", (n) => n.toUpperCase());

// Extract multiple properties
const { name, email } = extract(user, "name", "email");

// Template literals (reactive)
const message = tpl`Hello, ${name}!`;

// Negation
const isNotReady = not(isReady);
```

**Enhanced Subscriptions:**

```typescript
// Basic subscription
const unsubscribe = count.subscribe((value) => {
  console.log("New value:", value);
});

// Enhanced subscription with change context
const unsubscribe = count.on("change", (newValue, oldValue, context) => {
  console.log(`Changed from ${oldValue} to ${newValue}`);
  console.log(`Trigger context: ${context}`); // e.g., "increment", "reset"
});

// Providing context when setting
count.set(5, "increment"); // Context: "increment"
count.set(0, "reset"); // Context: "reset"
```

---

### 2. Effects - Reactive Side Effects

Effects run automatically when their signal dependencies change.

**Basic Effects:**

```typescript
import { watch, onDispose } from "@in/teract/signal";

// watch runs immediately and re-runs on dependency changes
const dispose = watch(() => {
  console.log("Count:", count.get());
});

// Clean up when done
dispose();
```

**Effects with Cleanup:**

```typescript
import { createSideEffect } from "@in/teract/signal";

createSideEffect(() => {
  const handler = () => console.log("resize");
  window.addEventListener("resize", handler);

  // Return cleanup function
  return () => window.removeEventListener("resize", handler);
});
```

**Cleanup Registration:**

```typescript
watch(() => {
  const timer = setInterval(() => console.log("tick"), 1000);

  onDispose(() => {
    clearInterval(timer);
  });
});
```

**Untracked Operations:**

```typescript
import { untrack, peek } from "@in/teract/signal";

watch(() => {
  // This creates a dependency
  console.log(count.get());

  // This doesn't create a dependency
  untrack(() => {
    console.log(otherValue.get());
  });

  // Neither does peek
  const peeked = peek(anotherValue);
});
```

---

### 3. State - Structured Reactivity

State transforms plain objects into reactive signal-based structures.

**Basic State:**

```typescript
import { createState } from "@in/teract/state";

const useCounter = createState({
  count: 0,
  name: "Charlotte",
});

// Each property is a signal
useCounter.count.set(5);
useCounter.name.set("Ben");

// State methods
useCounter.batch((s) => {
  s.count.set(10);
  s.name.set("Charlie");
}); // Single notification

useCounter.reset(); // Reset to initial values
const snap = useCounter.snapshot(); // Get current plain values
useCounter.subscribe((snapshot) => console.log(snapshot));
```

**State with Actions:**

```typescript
import { createAction } from "@in/teract/state";

// Direct signal action
const setIncrement = createAction(
  useCounter.count,
  (current, amount = 1) => current + amount
);
setIncrement(5);

// State property tuple
const setDecrement = createAction(
  [useCounter, "count"],
  (current, amount = 1) => current - amount
);
setDecrement(2);

// Batch actions
const handleCounter = createAction(useCounter, {
  increment: { key: "count", fn: (c, n = 1) => c + n },
  decrement: { key: "count", fn: (c, n = 1) => c - n },
  reset: { key: "count", fn: () => 0 },
});

handleCounter.increment(5);
handleCounter.reset();
```

**Action Options:**

```typescript
const setThrottledIncrement = createAction(
  useCounter.count,
  (c) => c + 1,
  { throttle: 100 } // Limit calls to once per 100ms
);

const setDebouncedSave = createAction(
  useApp.data,
  (d) => saveToServer(d),
  { debounce: 500 } // Wait 500ms after last call
);

const setOneTimeInit = createAction(
  useApp.initialized,
  () => true,
  { once: true } // Only execute once
);
```

**State Destructuring & Organization Patterns:**

InSpatial provides three main patterns for organizing state and actions: **Scalar Pattern** **Separation Pattern** and **Explicit Pattern**.

**Scalar Pattern**

```typescript
// createState can handle primitives too
const count = createState(0); // Returns Signal<number>
count.set(5);
const doubled = count.gt(10);
```

**Separation Pattern (Recommended for most cases):**

```typescript
import { createState, createAction } from "@in/teract/state";

// 1. Create state
const useCounter = createState({
  count: 0,
  multiplier: 2,
  name: "Counter",
});

// 2. Create individual actions (setX naming)
const setIncrement = createAction(
  useCounter.count,
  (current, amount = 1) => current + amount
);

const setDecrement = createAction(
  useCounter.count,
  (current, amount = 1) => current - amount
);

// 3. Create batch actions (handleX naming)
const handleCounter = createAction(useCounter, {
  increment: { key: "count", fn: (c, n = 1) => c + n },
  decrement: { key: "count", fn: (c, n = 1) => c - n },
  reset: { key: "count", fn: () => 0 },
  multiply: {
    key: "count",
    fn: (c) => {
      // Can access other state properties via peek
      const mult = useCounter.multiplier.peek();
      return c * mult;
    },
  },
});

// Usage in components
function Counter() {
  // Access state properties directly
  useCounter.count.set(useCounter.count.get() + 1);

  // Or use individual actions
  setIncrement(5);

  // Or use batch actions
  handleCounter.increment(10);
  handleCounter.multiply();

  return <Text>{useCounter.count}</Text>;
}
```

**Why Separation Pattern?**

- **Clarity**: State and actions are separate concerns
- **Flexibility**: Mix `.set()` writes, individual actions, and batch actions
- **Searchability**: Find all actions (search `setX`, `handleX`)
- **Composability**: Actions can be imported/exported independently

**When to Use Direct `.set()` vs Actions:**

```typescript
const useCounter = createState({ count: 0, name: "Charlotte" });

// ✅ Direct .set(): Simple updates
useCounter.count.set(5);
useCounter.name.set("Ben");

// ✅ Syntactic sugar: .value = x
useCounter.count.value = 10; // Same as .set(10)

// ✅ Individual Actions: Reusable logic
const setIncrement = createAction(useCounter.count, (c, n = 1) => c + n);
setIncrement(5); // Can be called from anywhere

// ✅ Batch Actions: Related operations
const handleCounter = createAction(useCounter, {
  increment: { key: "count", fn: (c) => c + 1 },
  decrement: { key: "count", fn: (c) => c - 1 },
});
handleCounter.increment();
```

**Explicit Pattern (All-in-one configuration):**

```typescript
import { createState } from "@in/teract/state";

const useGame = createState.in({
  id: "game-state",
  initialState: { health: 100, score: 0 },

  action: {
    takeDamage: { key: "health", fn: (h, dmg = 10) => Math.max(0, h - dmg) },
    addScore: { key: "score", fn: (s, pts = 100) => s + pts },
    heal: { key: "health", fn: (h, amt = 20) => Math.min(100, h + amt) },
  },

  storage: [{ key: "game-save", backend: "local", exclude: ["health"] }],
});

// Access state properties (same as separation)
useGame.health.set(50);
useGame.score.set(useGame.score.get() + 100);

// Access actions via .action
useGame.action.takeDamage(25);
useGame.action.addScore(500);
useGame.action.heal(30);

// Dynamic management
useGame.addAction("boost", { key: "score", fn: (s) => s * 2 });
useGame.action.boost();
```

**Destructuring State (Avoiding Repetition):**

While `useCounter.count.get()` and `.set()` are clear, you can destructure for less repetition:

```typescript
const useCounter = createState({
  count: 0,
  multiplier: 2,
  name: "Counter",
});

// ❌ Don't destructure signals directly (loses reactivity tracking)
const { count, multiplier } = useCounter; // Signals, not values
count.set(count.get() + 1); // Still verbose

// ✅ Better: Use destructuring for organization, not syntax sugar
function CounterComponent() {
  // Access properties directly when needed
  const currentCount = useCounter.count.get();
  const currentName = useCounter.name.get();

  return (
    <YStack>
      <Text>{useCounter.count}</Text> {/* Signal auto-unwraps in JSX */}
      <Text>{useCounter.name}</Text>
      <Button on:tap={() => useCounter.count.set(useCounter.count.get() + 1)}>
        Increment
      </Button>
    </YStack>
  );
}

// ✅ Good: Destructure for explicit pattern
const { action } = useGame; // Separate actions from state
action.takeDamage(10);
action.addScore(50);
```

**Key Differences: Separation vs Explicit:**

| Aspect            | Separation Pattern                                  | Explicit Pattern                  |
| ----------------- | --------------------------------------------------- | --------------------------------- |
| **Definition**    | State + separate actions                            | All-in-one config                 |
| **State Access**  | `useCounter.count.set()` / `.get()`                 | `useGame.health.set()` / `.get()` |
| **Action Access** | `setIncrement()` or `handleCounter.increment()`     | `useGame.action.takeDamage()`     |
| **Flexibility**   | Can mix `.set()`, individual actions, batch actions | Must use `.action.*`              |
| **Use Case**      | Most common, more flexible                          | Complex state with many actions   |
| **Destructuring** | `const setInc = setIncrement;`                      | `const { action } = useGame;`     |

**Best Practices:**

```typescript
// ✅ Good: Name state with "use" prefix
const useCounter = createState({ count: 0 });

// ✅ Good: Individual actions with "set" prefix
const setIncrement = createAction(useCounter.count, (c) => c + 1);

// ✅ Good: Batch actions with "handle" prefix
const handleCounter = createAction(useCounter, { ... });

// ✅ Good: Access signals in JSX (auto-unwraps)
<Text>{useCounter.count}</Text>

// ✅ Good: Use .set() for imperative updates
useCounter.count.set(5);

// ✅ Good: Syntactic sugar .value = x
useCounter.count.value = 10; // Same as .set(10)

// ✅ Good: Use .peek() to avoid dependencies in actions
const setMultiply = createAction(useCounter.count, (c) => {
  const mult = useCounter.multiplier.peek(); // No dependency
  return c * mult;
});

// ❌ Wrong: Destructuring state signals for "convenience"
const { count } = useCounter;
count.set(count.get() + 1); // Still verbose, but now less searchable

// ❌ Wrong: Expecting destructured values to be reactive
const { count } = useCounter;
watch(() => console.log(count)); // Won't work - count is a signal, not unwrapped
```

**State with Storage:**

```typescript
import { createStorage } from "@in/teract/state";

const useCounter = createState({ count: 0, name: "Charlotte" });

// Auto-persist to localStorage
const cleanup = createStorage(useCounter, {
  key: "app-state",
  backend: "local", // "local" | "session" | "memory" | custom
  exclude: ["temporaryData"],
  debounce: 500,
});

// Stop persistence
cleanup();
```

**Explicit Pattern (All-in-One):**

```typescript
const useGame = createState.in({
  id: "game-state",
  initialState: { health: 100, score: 0 },

  action: {
    takeDamage: { key: "health", fn: (h, dmg = 10) => Math.max(0, h - dmg) },
    addScore: { key: "score", fn: (s, pts = 100) => s + pts },
  },

  storage: [
    { key: "game-save", backend: "local", exclude: ["health"] },
    { key: "game-session", backend: "session" },
  ],
});

// Dynamic management
useGame.action.takeDamage(25);
useGame.addAction("heal", { key: "health", fn: (h) => Math.min(100, h + 20) });
useGame.addStorage({ key: "cloud", backend: customBackend });
```

---

### 4. Triggers - Universal Event System

Triggers provide a unified event handling system across platforms.

**Built-in Universal Triggers:**

```typescript
import { InUniversalTriggerProps } from "@in/teract/trigger";

// Interaction triggers
on: tap; // Universal tap/click
on: longpress; // Press and hold
on: rightclick; // Context menu
on: hover; // Hover state (callback receives boolean)
on: hoverstart; // Hover enter
on: hoverend; // Hover exit

// Keyboard triggers
on: key; // Any key event
on: key: down; // Key down
on: key: up; // Key up
on: escape; // Escape key

// Lifecycle triggers
on: mount; // After element is mounted
on: beforeMount; // Before element is mounted
on: frameChange; // Animation frame updates

// Form triggers
on: change; // Input change
on: submit; // Form submit
on: focus; // Element focus

// Gamepad triggers
on: gamepad; // Gamepad state polling
on: gamepadconnect; // Gamepad connected
on: gamepaddisconnect; // Gamepad disconnected

// Capacitor app triggers (mobile)
on: back; // Android back button
on: resume; // App resumed
on: pause; // App paused
on: urlopen; // Deep link opened
on: statechange; // App state changed
on: restored; // App restored
```

**DOM Event Triggers:**

```typescript
import { InDOMTriggerProps } from "@in/teract/trigger";

// Standard DOM events with modifiers
on:click
on:input
on:change
on:keydown
on:scroll

// Event modifiers
on-once:click       // Fire only once
on-passive:scroll   // Passive event listener
on-capture:click    // Capture phase
on-prevent:submit   // Prevent default
```

**Creating Custom Triggers:**

```typescript
import { createTrigger } from "@in/teract/trigger";

createTrigger(
  "swipe",
  (node, handler) => {
    let startX = 0,
      startY = 0;

    const onDown = (e: PointerEvent) => {
      startX = e.clientX;
      startY = e.clientY;
    };

    const onUp = (e: PointerEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
        handler({
          type: "swipe",
          direction:
            Math.abs(deltaX) > Math.abs(deltaY)
              ? deltaX > 0
                ? "right"
                : "left"
              : deltaY > 0
              ? "down"
              : "up",
          distance: Math.sqrt(deltaX * deltaX + deltaY * deltaY),
        });
      }
    };

    node.addEventListener("pointerdown", onDown);
    node.addEventListener("pointerup", onUp);

    // Return cleanup function
    return () => {
      node.removeEventListener("pointerdown", onDown);
      node.removeEventListener("pointerup", onUp);
    };
  },
  {
    platforms: ["dom", "native"],
    fallback: "tap",
  }
);

// Use in JSX
<Button on:swipe={({ direction }) => console.log(direction)}>Swipe me</Button>;
```

**Trigger Props (Reactive Directives):**

```typescript
// Conditional classes
class:active={isActive}           // Add class when true
class:disabled={isDisabled}

// Dynamic styles
style:color={textColor}           // Dynamic CSS property
style:opacity={opacity}
```

---

### 5. Extensions - Extensibility System

Extensions add custom capabilities to InSpatial renderers.

**Creating Extensions:**

```typescript
import { createExtension } from "@in/teract/extension";

const MyExtension = createExtension({
  meta: {
    key: "my-extension",
    name: "My Extension",
    description: "Adds custom functionality",
    author: { name: "Your Name" },
    version: "1.0.0",
    type: "Universal",
  },

  scope: {
    clientScope: "progressive",
    editorScopes: ["Windows", "Scenes"],
  },

  permissions: {
    network: { domains: ["api.example.com"] },
    storage: { local: true },
    renderer: { props: true, directives: ["my"] },
  },

  capabilities: {
    // Add custom triggers
    triggers: {
      "my-event": {
        handler: (node, value) => {
          node.addEventListener("custom", value);
        },
        platforms: ["dom"],
        description: "Custom event handler",
      },
    },

    // Add custom renderer props
    rendererProps: {
      onDirective: (prefix, key, prop) => {
        if (prefix === "my") {
          return (node, value) => {
            node.setAttribute(`data-my-${key}`, value);
          };
        }
      },

      namespaces: {
        my: "https://example.com/my-namespace",
      },

      tagAliases: {
        MyButton: "button",
      },
    },
  },

  lifecycle: {
    setup: (renderer) => {
      console.log("Extension setup");
    },

    onInstall: () => {
      console.log("Extension installed");
    },

    validate: () => {
      if (!window.customAPI) {
        throw new Error("Custom API not available");
      }
    },
  },
});
```

**InTrigger Extension:**

```typescript
import { InTrigger } from "@in/teract/trigger";
import { createRenderer } from "@inspatial/kit/renderer";

// InTrigger enables all trigger prop functionality
createRenderer({
  mode: "auto",
  extensions: [InTrigger, MyExtension],
}).then((InSpatial) => {
  InSpatial.render(document.getElementById("app"), App);
});
```

---

## Naming Convention

InSpatial follows a strict naming pattern for state, actions, and triggers to ensure zero cognitive load and maximum searchability:

```typescript
// ✅ State Variables (useX)
const useCounter = createState({ count: 0 });
const useTheme = createState({ mode: "dark" });
const useAuth = createState({ user: null });

// ✅ Action Triggers (handleX) - Batch actions
const handleCounter = createAction(useCounter, {
  increment: { key: "count", fn: (c) => c + 1 },
  decrement: { key: "count", fn: (c) => c - 1 },
});

// ✅ Action Declarations (setX) - Individual actions
const setIncrement = createAction(useCounter.count, (c) => c + 1);
const setReset = createAction(useCounter.count, () => 0);
```

**Benefits:**

- **Zero cognitive load** - developers know exactly what to expect
- **Searchable** - find all states (search `use`), triggers (search `handle`), actions (search `set`)
- **Consistent** - same pattern across entire codebase
- **Maintainable** - refactoring becomes predictable

---

## Asynchronous Scheduler

**Critical: All signal updates are asynchronous and batched.**

InSpatial's signal system uses a **tick-driven scheduler** that batches all updates and flushes them on microtasks. This is fundamentally different from synchronous reactivity systems.

### Why Async?

- **Performance**: Batching multiple updates prevents unnecessary re-renders
- **Consistency**: All effects see the same snapshot of state
- **Predictability**: Update order is deterministic within a tick

### Tick vs NextTick

```typescript
import { tick, nextTick } from "@in/teract/signal";

const count = createSignal(0);
const doubled = $(() => count.value * 2);

count.value = 5;

// ❌ WRONG - doubled is not updated yet
console.log(doubled.value); // Still old value

// ✅ CORRECT - Wait for next tick
nextTick(() => {
  console.log(doubled.value); // Now 10
});

// Or use await
await nextTick();
console.log(doubled.value); // Now 10

// Force immediate flush (rarely needed)
tick();
```

### Understanding Batching

```typescript
// Multiple updates are batched automatically
count.value = 1;
count.value = 2;
count.value = 3;
// Effect runs only once with final value (3)

watch(() => {
  console.log(count.value); // Logs: 3 (not 1, 2, 3)
});
```

### Common Pitfalls

```typescript
// ❌ WRONG - Expecting immediate computed update
const useCounter = createState({ count: 0 });
const doubled = $(() => useCounter.count.get() * 2);

useCounter.count.set(5);
console.log(doubled.get()); // Still 0, not 10!

// ✅ CORRECT - Schedule read after write
useCounter.count.set(5);
await nextTick();
console.log(doubled.get()); // Now 10

// ✅ ALSO CORRECT - Use peek for non-reactive read
useCounter.count.set(5);
await nextTick();
const result = doubled.peek(); // Non-reactive, but value is updated
```

---

## API Reference

### Signal APIs

```typescript
// Creation
createSignal<T>(value: T): Signal<T>
computed<T>(fn: () => T): Signal<T>
$(fn: () => T): Signal<T>  // Alias for computed

// Signal methods
.get(): T                    // Reactive read
.set(value: T): void         // Write
.peek(): T                   // Non-reactive read
.poke(value: T): void        // Non-reactive write
.trigger(): void             // Manual update notification
.subscribe(fn): () => void   // Subscribe to changes
.on("change", fn): () => void // Enhanced subscription

// Comparisons
.eq(other): Signal<boolean>
.neq(other): Signal<boolean>
.gt(other): Signal<boolean>
.lt(other): Signal<boolean>
.gte(other): Signal<boolean>
.lte(other): Signal<boolean>

// Logical
.and(other): Signal<T | U>
.or(other): Signal<T | U>
.inverse(): Signal<boolean>
.hasValue(): boolean         // Returns boolean, not Signal

// Range & checks
.between(min, max): Signal<boolean>
.isEmpty(): Signal<boolean>
.includes(item): Signal<boolean>
.isTruthy(): Signal<boolean>
.isNullish(): Signal<boolean>

// Utilities
read(value): T
write(signal, value): T
peek(value): T
poke(signal, value): T
touch(...signals): void
merge(signals, fn): Signal<R>
derive(signal, key, transform?): Signal<R>
extract(signal, ...keys): { [K]: Signal<T[K]> }
tpl`...`: Signal<string>
not(signal): Signal<boolean>
```

### Effect APIs

```typescript
watch(effect): () => void
createSideEffect(effect, ...args): () => void
onDispose(cleanup): void
untrack(fn): T
freeze(fn): (...args) => R
connect(signals, effect, runImmediate?): void
listen(signals, effect): void
```

### State APIs

```typescript
createState<T>(initial: T): State<T> | Signal<T>
createState<T>(config: StateConfig<T>): EnhancedState<T>

createAction(signal, fn, options?): (...args) => void
createAction([state, key], fn, options?): (...args) => void
createAction(state, definitions): Actions

createStorage(state, options): () => void
```

### Scheduling APIs

```typescript
tick(): Promise<void>
nextTick(callback): Promise<void>
nextTick<T>(callback, ...args): Promise<void>
```

---

## Best Practices

**1. Prefer `createState` for structured data:**

```typescript
// ✅ Good
const useCounter = createState({ count: 0, name: "Charlotte" });

// ❌ Avoid (unless you need a scalar signal)
const count = createSignal(0);
const name = createSignal("Charlotte");
```

**2. Use computed for derived values:**

```typescript
// ✅ Good
const doubled = $(() => count.get() * 2);

// ❌ Avoid (manual tracking)
let doubled = count.get();
watch(() => {
  doubled = count.get() * 2;
});
```

**3. Always wrap dynamic JSX expressions:**

```typescript
// ✅ Good
<Text>{$(() => `Count: ${count.get()}`)}</Text>

// ❌ Wrong (not reactive)
<Text>{`Count: ${count.get()}`}</Text>

// ✅ Also good (signal auto-unwraps)
<Text>{count}</Text>
```

**4. Use `.peek()` to avoid dependencies:**

```typescript
createAction(useCounter.count, (current) => {
  const other = useCounter.multiplier.peek(); // No dependency
  return current * other;
});
```

**5. Manual triggering for mutations:**

```typescript
const items = createSignal([1, 2, 3]);
const arr = items.get();
arr.push(4);
items.trigger(); // Notify observers
```

**6. Schedule reads after writes:**

```typescript
count.set(5);
await nextTick();
console.log(doubled.get()); // Now updated
```

**7. Use `onDispose` for cleanup:**

```typescript
watch(() => {
  const timer = setInterval(() => {}, 1000);
  onDispose(() => clearInterval(timer));
});
```

---

## Common Patterns

**Derived State:**

```typescript
const useCart = createState({ items: [], tax: 0.1 });
const subtotal = $(() =>
  useCart.items.get().reduce((sum, item) => sum + item.price, 0)
);
const total = $(() => subtotal.get() * (1 + useCart.tax.get()));
```

**Conditional Signals:**

```typescript
const isValid = username.gt("").and(password.gt(8));
const canSubmit = isValid.and(isNotSubmitting);
```

**Cross-State Actions:**

```typescript
const useApp = createState.in({
  id: "app",
  initialState: { count: 0 },
  action: {
    syncExternal: {
      key: "count",
      fn: (c) => {
        useExternal.value.set(c); // Update external state
        return c + 1;
      },
    },
  },
});
```

**Custom Storage Backend:**

```typescript
import { createAsyncStorage } from "@in/teract/state";

const cloudStorage = createAsyncStorage(
  async (key) => await fetchFromCloud(key),
  async (key, value) => await saveToCloud(key, value),
  async (key) => await deleteFromCloud(key)
);

createStorage(useApp, {
  key: "app-state",
  backend: cloudStorage,
});
```

---

## Signal & Effect Rules

Critical guidelines for working with InSpatial's reactive system:

### State Management

**Always use `createState` for structured data:**

```typescript
// ✅ Preferred - Signal-backed state
const useCounter = createState({ count: 0, multiplier: 2 });

// ❌ Avoid - Separate signals
const count = createSignal(0);
const multiplier = createSignal(2);
```

**Use naming conventions:**

- Prefix state with `use` (e.g., `useCounter`, `useTheme`)
- Destructure when needed: `const { count, multiplier } = useCounter`
- Actions as `handleX` (batches) or `setX` (individual)

### Never Rely on Synchronous State

**Critical:** After mutation, derived values are NOT immediately updated.

```typescript
const useCounter = createState({ count: 0 });
const doubled = $(() => useCounter.count.get() * 2);

// ❌ WRONG - Will read stale value
useCounter.count.set(5);
console.log(doubled.get()); // Still 0, not 10!

// ✅ CORRECT - Schedule after tick
useCounter.count.set(5);
await nextTick();
console.log(doubled.get()); // Now 10
```

### Array/Object Mutations

When mutating arrays or objects directly, you **must** call `.trigger()`:

```typescript
const useList = createState({ items: [1, 2, 3] });

// ❌ WRONG - Mutation without trigger
const arr = useList.items.get();
arr.push(4);
// Effects won't run!

// ✅ CORRECT - Trigger after mutation
const arr = useList.items.get();
arr.push(4);
useList.items.trigger();

// ✅ BETTER - Immutable update
useList.items.set([...useList.items.peek(), 4]);
```

**Alternative: Use reactive utilities:**

```typescript
import { makeReactive, derive } from "@in/teract/signal";

// makeReactive tracks property access
const reactive = makeReactive(useList);
reactive.items.push(4); // Automatically tracked
```

### Derivation Patterns

**Always wrap computations:**

```typescript
// ❌ WRONG - Not reactive
const total = useCart.items.get().reduce((sum, item) => sum + item.price, 0);

// ✅ CORRECT - Wrapped in computed
const total = $(() =>
  useCart.items.get().reduce((sum, item) => sum + item.price, 0)
);
```

**Prefer `$` over `computed` for brevity** (they're identical):

```typescript
const doubled = $(() => count.get() * 2); // ✅ Preferred
const doubled = computed(() => count.get() * 2); // ✅ Also valid
```

### Untracked Operations

Use `.peek()`, `untrack()`, or `.touch()` to control dependencies:

```typescript
// Read without creating dependency
const setMultiply = createAction(useCounter.count, (current) => {
  const multiplier = useCounter.multiplier.peek(); // No dependency
  return current * multiplier;
});

// Execute without tracking
untrack(() => {
  console.log(count.get()); // Doesn't create dependency
});

// Establish dependency without reading
signal.touch(); // Creates dependency, doesn't read value
```

### Effect Management

**Use `watch` for auto-tracked effects:**

```typescript
// ✅ Runs immediately, re-runs on dependency changes
const dispose = watch(() => {
  console.log("Count:", useCounter.count.get());
});

// Clean up when done
dispose();
```

**Use `createSideEffect` for effects with cleanup:**

```typescript
createSideEffect(() => {
  const handler = () => console.log("Event");
  window.addEventListener("custom", handler);

  // Return cleanup
  return () => window.removeEventListener("custom", handler);
});
```

**Lazy effects with `connect`:**

```typescript
import { connect } from "@in/teract/signal";

// Deferred effect (doesn't run immediately)
connect(
  [signal1, signal2],
  () => {
    console.log("Effect runs on signal changes");
  },
  false
); // false = don't run immediately
```

---

## API Usage Do's & Don'ts

### ✅ Do

**Import from correct modules:**

```typescript
// Signals
import { createSignal, $, watch } from "@in/teract/signal";

// State
import { createState, createAction, createStorage } from "@in/teract/state";

// Triggers
import { createTrigger, InTrigger } from "@in/teract/trigger";

// Extensions
import { createExtension } from "@in/teract/extension";
```

**Use helper utilities for complex data:**

```typescript
import { derive, extract, makeReactive, merge } from "@in/teract/signal";

// Extract multiple properties
const { name, email } = extract(useUser, "name", "email");

// Derive with transformation
const upperName = derive(useUser, "name", (n) => n.toUpperCase());

// Merge multiple signals
const fullName = merge([firstName, lastName], (f, l) => `${f} ${l}`);
```

**Always call `.trigger()` after mutations:**

```typescript
useList.items.value.push(item);
useList.items.trigger();
```

**Compose `watch` with `onDispose`:**

```typescript
watch(() => {
  const timer = setInterval(() => {}, 1000);
  onDispose(() => clearInterval(timer));
});
```

**Use trigger props for events:**

```typescript
<Button on:tap={handleClick}>Click</Button>
<Input on:change={handleChange} />
```

### ❌ Don't

**Don't use other framework primitives:**

```typescript
// ❌ NEVER do this
import { useState, useEffect } from "react";
import { createSignal, createEffect } from "solid-js";
import { ref, reactive } from "vue";

// ✅ Always use InSpatial
import { createState, watch } from "@in/teract";
```

**Signals in JSX:**

```typescript
// ✅ Both work - signal passes through
<Text>{count}</Text>       // Renderer handles signal
<Text>{count.get()}</Text> // Explicit, also valid

// ✅ In templates - auto-coercion or explicit
<Text>{$(() => `Count: ${count}`)}</Text>       // Auto-coerces to string
<Text>{$(() => `Count: ${count.get()}`)}</Text> // Explicit .get()

// ✅ In comparisons - auto-coercion works
<Show when={count > 10}> // Symbol.toPrimitive → .get()
<Show when={count.get() > 10}> // Explicit, same result
```

**Don't use manual DOM manipulation:**

```typescript
// ❌ WRONG
element.addEventListener("click", handler);
element.classList.add("active");

// ✅ CORRECT
<Element on:click={handler} class:active={isActive} />;
```

**Don't expect immediate propagation:**

```typescript
// ❌ WRONG
count.set(5);
console.log(doubled.get()); // Stale!

// ✅ CORRECT
count.set(5);
await nextTick();
console.log(doubled.get()); // Updated!
```

**Don't mutate state without triggering:**

```typescript
// ❌ WRONG
const arr = state.items.get();
arr.push(item); // Silent failure

// ✅ CORRECT
const arr = state.items.get();
arr.push(item);
state.items.trigger();
```

---

## Migration Guide Essentials

**From React:**

- `useState` → `createState` / `createSignal`
- `useEffect` → `watch` / `createSideEffect`
- `useRef` → `$ref` (signal, not `.current`)
- `useMemo` → `computed` / `$`
- `useCallback` → Just use closures

**From Solid:**

- Very similar API, but all updates are tick-based (async)
- `createSignal` → Same concept, different scheduler
- `createMemo` → `computed` / `$`
- `createEffect` → `watch`
- `onCleanup` → `onDispose`

**From Vue:**

- `ref` → `createSignal` / `createState`
- `reactive` → `createState` / `makeReactive`
- `computed` → `computed` / `$`
- `watch` → `watch` (always eager)
- `watchEffect` → `watch`

**From Svelte:**

- `$:` → `$` / `computed` / `watch`
- `derived` → `computed` / `$`
- `writable` → `createSignal`
- `onMount` → `on:mount` trigger
- `onDestroy` → `onDispose`

---

## Framework Migration FAQs

Detailed questions and answers for migrating from other reactive frameworks:

### Coming From React

**Q: Does `createState` replace `useState`, and can I read new values synchronously?**

A: `createState()` gives you synchronous setters and readers for raw state (`count.set()` / `count.get()`), but _all_ downstream computations/effects only flush on the tick queue. After `count.set(next)`, effects and computed values do NOT recalculate synchronously. Always use `nextTick` before acting on downstream effects.

```typescript
// React (synchronous)
const [count, setCount] = useState(0);
setCount(5);
console.log(count); // 5 immediately

// InSpatial (asynchronous propagation)
const useCounter = createState({ count: 0 });
useCounter.count.set(5);
console.log(useCounter.count.get()); // 5 (raw value)

const doubled = $(() => useCounter.count.get() * 2);
console.log(doubled.get()); // Still old value!
await nextTick();
console.log(doubled.get()); // Now updated
```

**Q: Should I move all `useEffect` calls into `watch`?**

A: Yes. `watch(fn)` auto-tracks dependencies (no dependency array required), returns a disposer, and always runs immediately. Use `onDispose` for teardown logic.

```typescript
// React
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer);
}, [dependency]);

// InSpatial
watch(() => {
  dependency.get(); // Auto-tracked
  const timer = setInterval(() => {}, 1000);
  onDispose(() => clearInterval(timer));
});
```

**Q: How do I replicate `ref` / `useRef`?**

A: Use `$ref` prop with a signal or callback. There's no mutable `.current` object `$ref` writes directly to a signal.

```typescript
// React
const ref = useRef(null);
<div ref={ref}>

// InSpatial
const ref = createSignal(null);
<Slot $ref={ref}>
```

**Q: What about `useMemo` / `useCallback`?**

A: Use `$()` or `computed()` for memoization. For callbacks, just use closures—there are no hook order rules.

```typescript
// React
const doubled = useMemo(() => count * 2, [count]);
const handleClick = useCallback(() => {}, [dep]);

// InSpatial
const doubled = $(() => count.get() * 2); // Auto-tracked
const handleClick = () => {}; // Just a closure, no special handling needed
```

### Coming From Solid

**Q: Are signals drop-in replacements for `createSignal`, `createMemo`, `createEffect`?**

A: Very similar, but _all_ propagation is tick-driven (never synchronous). `watch()` is always eager unless overridden with `runImmediate: false` in `connect()`.

```typescript
// Solid (synchronous)
const [count, setCount] = createSignal(0);
const doubled = createMemo(() => count() * 2);
setCount(5);
console.log(doubled()); // 10 immediately

// InSpatial (asynchronous)
const count = createSignal(0);
const doubled = $(() => count.get() * 2);
count.set(5);
console.log(doubled.get()); // Still old!
await nextTick();
console.log(doubled.get()); // Now 10
```

**Q: Do I need Solid's `on(...)` helpers?**

A: No. InSpatial has built-in signal methods: `.touch()`, `.and()`, `.or()`, etc. All branching/reactivity helpers are methods of the signal itself.

```typescript
// Solid
on(signal, () => {});

// InSpatial
signal.touch(); // Establish dependency
signal.and(other); // Logical AND
signal.or(other); // Logical OR
```

**Q: How do lifecycles work?**

A: `onDispose` maps to Solid's `onCleanup`. Use within `watch` or `createSideEffect`. No separate lifecycle hooks exist.

```typescript
// Solid
onCleanup(() => {});

// InSpatial
watch(() => {
  onDispose(() => {});
});
```

### Coming From Vue

**Q: Do `createState`/`createSignal` map to `ref`?**

A: Yes, but computed and derived values always remain wrapped. Never access `.value` directly in JSX output—pass the signal itself.

```typescript
// Vue
const count = ref(0);
<div>{{ count.value }}</div>

// InSpatial
const count = createSignal(0);
<Text>{count}</Text> // Signal auto-unwraps in JSX
```

**Q: What's the difference between `watch` and `watchEffect`?**

A: InSpatial's `watch(fn)` is always eager (runs immediately). For lazy watchers like Vue's `watch` with `immediate: false`, use `connect([...sources], effect, false)`.

```typescript
// Vue
watch(source, callback, { immediate: false });
watchEffect(callback); // Runs immediately

// InSpatial
watch(callback); // Runs immediately (like watchEffect)
connect([signal], callback, false); // Deferred (like watch with immediate: false)
```

**Q: What about template refs and directives?**

A: Use `$ref` for DOM nodes. For prop directives, use trigger props (`on:`, `className:`, `class:`, `style:`).

```typescript
// Vue
<div ref="myRef" v-if="show" v-for="item in items">

// InSpatial
<Slot $ref={myRef}>
<Show when={show}>{() => <Content />}</Show>
<List each={items}>{(item) => <Item data={item} />}</List>
```

### Coming From Svelte

**Q: Are signals the same as stores or `$:`?**

A: Signals combine writable/readable stores and reactivity statements. Crucially, **updates are always async batch-flushed; never sync**.

```typescript
// Svelte
let count = 0;
$: doubled = count * 2;
count = 5; // doubled updates immediately

// InSpatial
const count = createSignal(0);
const doubled = $(() => count.get() * 2);
count.set(5);
console.log(doubled.get()); // Still old!
await nextTick();
console.log(doubled.get()); // Now 10
```

**Q: How do I migrate `$:` or `derived`?**

A: `$:` becomes `$()`, `computed()`, or `watch()` depending on usage.

```typescript
// Svelte
$: doubled = count * 2; // Reactive statement
$: {
  console.log(count);
} // Reactive block

// InSpatial
const doubled = $(() => count.get() * 2); // Derived
watch(() => console.log(count.get())); // Effect
```

**Q: What about `onMount`, `afterUpdate`, `onDestroy`?**

A: Use `watch` (eager, auto-run on change) and `onDispose`. There are no post-update hooks. Use `on:mount` trigger for mount behavior.

```typescript
// Svelte
onMount(() => {});
onDestroy(() => {});

// InSpatial
watch(() => {
  // Setup
  onDispose(() => {
    // Cleanup
  });
});

// Or use trigger
<Element on:mount={() => {}}>
```

**Q: How does two-way binding work?**

A: Direct binding requires explicit wiring. Use signal state and event listeners.

```typescript
// Svelte
<input bind:value={name}>

// InSpatial
<Input
  value={name}
  on:input={(e: any) => name.set(e.target.value)}
/>
```

---

## Anti-Pattern Remediation

Common mistakes and their fixes:

### Anti-Pattern 1: React-Style State

**❌ Wrong:**

```typescript
const [count, setCount] = useState(0);
return <button onClick={() => setCount(count + 1)}>{count}</button>;
```

**✅ Correct:**

```typescript
const useCounter = createState({ count: 0 });
return (
  <Button on:tap={() => useCounter.count.set(useCounter.count.get() + 1)}>
    {useCounter.count}
  </Button>
);
```

### Anti-Pattern 2: Not Understanding Signal Auto-Coercion

**❌ Wrong Understanding:**

```typescript
// Thinking .get() is "bad" in JSX
<Text>{name}</Text> // Only this works?
<Text>{$(() => `Hello, ${name.get()}`)}</Text> // Must use .get() here?
```

**✅ Correct Understanding:**

```typescript
// Both work due to Symbol.toPrimitive and renderer handling
<Text>{name}</Text>           // Signal passes through to renderer
<Text>{name.get()}</Text>     // Explicit unwrap, also valid

// Both work in templates
<Text>{$(() => `Hello, ${name}`)}</Text>       // Auto-coercion
<Text>{$(() => `Hello, ${name.get()}`)}</Text> // Explicit

// Both work in comparisons
<Show when={count > 10} />       // Auto-coercion via Symbol.toPrimitive
<Show when={count.get() > 10} /> // Explicit, clearer intent
```

### Anti-Pattern 3: Manual DOM Event Listeners

**❌ Wrong:**

```typescript
useEffect(() => {
  const handler = () => setOpen(true);
  document.addEventListener("click", handler);
  return () => document.removeEventListener("click", handler);
}, []);
```

**✅ Correct:**

```typescript
// Create custom trigger
createTrigger("clickOutside", (node, value) => {
  if (!value) return;
  const listener = (event) => {
    if (!node.contains(event.target)) value();
  };
  document.addEventListener("click", listener);
  return () => document.removeEventListener("click", listener);
});

// Use trigger prop
<Button on:clickOutside={() => setOpen(false)} />;
```

### Anti-Pattern 4: Expecting Synchronous Updates

**❌ Wrong:**

```typescript
count.set(5);
console.log(doubled.get()); // Expects 10, gets old value
```

**✅ Correct:**

```typescript
count.set(5);
await nextTick();
console.log(doubled.get()); // Now 10
```

### Anti-Pattern 5: Mutations Without Triggering

**❌ Wrong:**

```typescript
const useList = createState({ items: [1, 2, 3] });
const arr = useList.items.get();
arr.push(4); // Silent failure!
```

**✅ Correct:**

```typescript
// Option 1: Trigger manually
const arr = useList.items.get();
arr.push(4);
useList.items.trigger();

// Option 2: Immutable update (preferred)
useList.items.set([...useList.items.peek(), 4]);
```

### Anti-Pattern 6: Using HTML Elements

**❌ Wrong:**

```typescript
<div className="container">
  <span>Hello</span>
  <button onClick={handler}>Click</button>
</div>
```

**✅ Correct:**

```typescript
<XStack className="container">
  <Text>Hello</Text>
  <Button on:tap={handler}>Click</Button>
</XStack>
```

### Anti-Pattern 7: Manual State Splitting

Switching Effeciently from Scalar to Separation/Object pattern

**❌ Wrong:**

```typescript
// Signals
const count = createSignal(0);
const name = createSignal("");
const email = createSignal("");

// State Signals (Scalars)
const count = createState(0);
const name = createState("");
const email = createState("");
```

**✅ Correct:**

```typescript
const useForm = createState({
  count: 0,
  name: "",
  email: "",
});
```

### Anti-Pattern 8: Ignoring Naming Conventions

**❌ Wrong:**

```typescript
const state = createState({ count: 0 });
const increment = createAction(state.count, (c) => c + 1);
const actions = createAction(state, { ... });
```

**✅ Correct:**

```typescript
const useCounter = createState({ count: 0 });
const setIncrement = createAction(useCounter.count, (c) => c + 1);
const handleCounter = createAction(useCounter, { ... });
```

---

## Quality Checklist

- ✅ All reactive values are signals
- ✅ Computed values use `$()` or `computed()`
- ✅ Effects use `watch()` or `createSideEffect()`
- ✅ Cleanup registered via `onDispose()`
- ✅ No direct `.value` access in JSX
- ✅ Mutations followed by `.trigger()`
- ✅ Async reads use `nextTick()`
- ✅ Event handlers use trigger props (`on:`)
- ✅ No manual `addEventListener` (use triggers)

---

**For complete documentation, see:** [InSpatial Interact](https://github.com/inspatiallabs/inspatial-kit-doc/tree/master/2.%20interactivity)
