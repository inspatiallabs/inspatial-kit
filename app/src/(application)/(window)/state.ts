import { createState, createTrigger, createStorage, State } from "@inspatial/state";
import type { Signal } from "@inspatial/signal";
import { cloud } from "@inspatial/app/api/inspatial-cloud.api.ts";




// ########################## (CLOUD) ##########################

cloud.auth.login("user@inspatial.com", "password").then((user: any) => {
  console.log(user);
  cloud.entry.getEntryList("user").then((entries: any) => {
    console.log(entries);
  });
})





// ########################## (STATE & TRIGGERS) ##########################

export interface Entry {
  id: number;
  name: string;
}

// ==================== PATTERN 1: (EXPLICIT) ====================
type ExplicitStateType = { count: number; message: string };

export const counterStateExplicit = createState<ExplicitStateType>({
  id: "counter-explicit",
  initialState: {
    count: 0,
    message: "Config pattern works!"
  },
  trigger: (signals: { count: Signal<number>; message: Signal<string> }) => ({
    increment: (amount = 1) => signals.count.set(signals.count.get() + amount),
    decrement: (amount = 1) => signals.count.set(signals.count.get() - amount),
    setMessage: (msg: string) => signals.message.set(msg),
    reset: () => {
      signals.count.set(0);
      signals.message.set("Config pattern works!");
    }
  }),
  storage: {
    key: 'inspatial-counter-explicit-builtin',
    backend: 'local',
    debounce: 300
  }
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
  (entries: Entry[], text: string) => [...entries, { id: Date.now(), name: text }],
  { name: "direct-add-entry", debounce: 200 }
);

// Pattern 2: State Property Tuple (type-safe property targeting)
export const tupleDouble = createTrigger(
  [counterState, 'count'],
  (current: number) => current * 2,
  { name: "tuple-double" }
);

export const tupleSetMultiplier = createTrigger(
  [counterState, 'multiplier'],
  (_: number, newValue: number) => newValue,
  { name: "tuple-set-multiplier" }
);

// Pattern 3: Batch Triggers (organized multi-property operations)
export const batchOperations = createTrigger(counterState, {
  multiplyByFactor: {
    key: 'count',
    action: (count: number) => count * counterState.multiplier.peek(),
    options: { name: "multiply-by-factor" }
  },
  addBonusEntry: {
    key: 'entries',
    action: (entries: Entry[]) => [
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
    action: (count: number) => {
      const multiplier = counterState.multiplier.peek();
      return count + multiplier;
    },
    options: { name: "smart-increment", throttle: 50 }
  },
  celebrationEntry: {
    key: 'entries',
    action: (entries: Entry[]) => {
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
counterState.count.on("change", (newVal: number, oldVal: number, context?: string) => {
  console.log(
    `🌍 Global counter changed from ${oldVal} to ${newVal} via: ${
      context || "unknown"
    }`
  );
});

// ==================== PERSISTENCE SETUP ====================
// 🎯 SEPARATION PATTERN: External persistence setup
// Persist the main counter state to localStorage  
// This will save: count, multiplier, entries
createStorage(counterState, {
  key: 'inspatial-counter-state',
  backend: 'local',
  debounce: 500, // Save after 500ms of inactivity
  // All fields persisted: count, multiplier, entries
});

console.log('🔄 State persistence enabled for both counter states');
console.log('📦 Separation pattern: External createStorage() call');
console.log('✨ Explicit pattern: Built-in persist option');
console.log('🔄 Reload the page to see state restoration in action!');
