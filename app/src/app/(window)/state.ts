import { createState, createTrigger, State } from "@inspatial/state";

export interface Entry {
  id: number;
  name: string;
}

// ==================== PATTERN 1: (EXPLICIT) ====================
export const counterStateExplicit = createState({
  id: "counter-explicit",
  initialState: {
    count: 0,
    message: "Config pattern works!"
  },
  trigger: (state: State<{ count: number; message: string }>) => ({
    // Built-in encapsulated trigger
    increment: (amount = 1) => state.count.set(state.count.get() + amount),
    decrement: (amount = 1) => state.count.set(state.count.get() - amount),
    setMessage: (msg: string) => state.message.set(msg),
    reset: () => {
      state.count.set(0);
      state.message.set("Config pattern works!");
    }
  })
});


// ==================== PATTERN 2: (SEPARATION) ====================
export const counterState = createState({
  count: 0,
  multiplier: 2,
  entries: [
    { id: 1, name: "🚀 Unified createTrigger API!" },
    { id: 2, name: "🧠 75% cognitive load reduction!" },
    { id: 3, name: "✨ One function, three patterns!" },
    { id: 4, name: "🎯 Simple mental model!" },
  ] as Entry[],
});


// Built-in convenience functions using unified createTrigger
export const builtInTrigger = createTrigger(counterState, {
  increment: {
    key: 'count',
    action: (current: number, amount = 1) => current + amount,
    options: { name: "built-in-increment" }
  },
  decrement: {
    key: 'count',
    action: (current: number, amount = 1) => current - amount,
    options: { name: "built-in-decrement" }
  },
  setCount: {
    key: 'count',
    action: (_: number, value: number) => value,
    options: { name: "built-in-set-count" }
  },
  addEntry: {
    key: 'entries',
    action: (entries: Entry[], text: string) => [
      ...entries, 
      { id: Date.now(), name: text }
    ],
    options: { name: "built-in-add-entry" }
  },
  reset: {
    key: 'count',
    action: () => 0,
    options: { name: "built-in-reset" }
  },
  resetEntries: {
    key: 'entries',
    action: (): Entry[] => [
      { id: 1, name: "🚀 Unified createTrigger API!" },
      { id: 2, name: "🧠 75% cognitive load reduction!" },
      { id: 3, name: "✨ One function, three patterns!" },
      { id: 4, name: "🔄 Reset complete!" },
    ],
    options: { name: "built-in-reset-entries" }
  }
});

// ==================== UNIFIED createTrigger API SHOWCASE ====================
// Three Patterns, One Function!

// Pattern 1: Direct Signal (simplest - for single signal operations)
export const directIncrement = createTrigger(
  counterState.count,
  (current: number) => current + 1,
  { name: "direct-increment", throttle: 100 }
);

export const directAddEntry = createTrigger(
  counterState.entries,
  (entries, text: string) => [...entries, { id: Date.now(), name: text }],
  { name: "direct-add-entry", debounce: 200 }
);

// Pattern 2: State Property Tuple (type-safe property targeting)
export const tupleDouble = createTrigger(
  [counterState, 'count'],
  (current) => current * 2,
  { name: "tuple-double" }
);

export const tupleSetMultiplier = createTrigger(
  [counterState, 'multiplier'],
  (_, newValue: number) => newValue,
  { name: "tuple-set-multiplier" }
);

// Pattern 3: Batch Triggers (organized multi-property operations)
export const batchOperations = createTrigger(counterState, {
  multiplyByFactor: {
    key: 'count',
    action: (count) => count * counterState.multiplier.peek(),
    options: { name: "multiply-by-factor" }
  },
  addBonusEntry: {
    key: 'entries',
    action: (entries) => [
      ...entries,
      { id: Date.now(), name: `🎁 Bonus entry! Count: ${counterState.count.peek()}` }
    ],
    options: { name: "add-bonus-entry", debounce: 300 }
  },
  powerReset: {
    key: 'count',
    action: () => 100,
    options: { name: "power-reset" }
  }
});

// 🚀 BONUS: Advanced combined operations
export const advancedOperations = createTrigger(counterState, {
  smartIncrement: {
    key: 'count',
    action: (count) => {
      const multiplier = counterState.multiplier.peek();
      return count + multiplier;
    },
    options: { name: "smart-increment", throttle: 50 }
  },
  celebrationEntry: {
    key: 'entries',
    action: (entries) => {
      const count = counterState.count.peek();
      if (count % 10 === 0) {
        return [...entries, { 
          id: Date.now(), 
          name: `🎉 Milestone reached: ${count}!` 
        }];
      }
      return entries;
    },
    options: { name: "celebration-entry" }
  }
});

// Enhanced subscription with change events
counterState.count.on("change", (newVal, oldVal, context) => {
  console.log(
    `🌍 Global counter changed from ${oldVal} to ${newVal} via: ${
      context || "unknown"
    }`
  );
});
