import { createState, createStorage, createTrigger } from "@inspatial/state";
// import { cloud } from "@inspatial/app/api/inspatial-cloud.api.ts";

// ########################## (CLOUD) ##########################

// const systemAdmins = cloud.auth.login("admin@user.com", "password").then(
//   (user: unknown) => {
//     console.log(user);
//     return cloud.entry.getEntryList("user")
//   }
// );

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
    message: "Config pattern works!",
  },
  trigger: {
    increment: {
      key: "count",
      action: (current: number, amount = 1) => current + amount,
      options: { name: "explicit-increment", throttle: 50 },
    },
    decrement: {
      key: "count",
      action: (current: number, amount = 1) => current - amount,
      options: { name: "explicit-decrement", throttle: 50 },
    },
    setMessage: {
      key: "message",
      action: (_: string, msg: string) => msg,
      options: { name: "explicit-set-message", debounce: 200 },
    },
    reset: {
      key: "count",
      action: () => 0,
      options: { name: "explicit-reset", once: false },
    },
    resetMessage: {
      key: "message",
      action: () => "Config pattern works!",
      options: { name: "explicit-reset-message" },
    },
  },
  storage: {
    key: "inspatial-counter-explicit-builtin",
    backend: "local",
    debounce: 300,
  },
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
    key: "count",
    action: (current: number, amount = 1) => current + amount,
    options: { name: "built-in-increment" },
  },
  decrement: {
    key: "count",
    action: (current: number, amount = 1) => current - amount,
    options: { name: "built-in-decrement" },
  },
  setCount: {
    key: "count",
    action: (_: number, value: number) => value,
    options: { name: "built-in-set-count" },
  },
  addEntry: {
    key: "entries",
    action: (entries: Entry[], text: string) => [
      ...entries,
      { id: Date.now(), name: text },
    ],
    options: { name: "built-in-add-entry" },
  },
  reset: {
    key: "count",
    action: () => 0,
    options: { name: "built-in-reset" },
  },
  resetEntries: {
    key: "entries",
    action: (): Entry[] => [
      { id: 1, name: "🚀 Unified createTrigger API!" },
      { id: 2, name: "🧠 75% cognitive load reduction!" },
      { id: 3, name: "✨ One function, three patterns!" },
      { id: 4, name: "🔄 Reset complete!" },
    ],
    options: { name: "built-in-reset-entries" },
  },
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
  (entries: Entry[], text: string) => [
    ...entries,
    { id: Date.now(), name: text },
  ],
  { name: "direct-add-entry", debounce: 200 }
);

// Pattern 2: State Property Tuple (type-safe property targeting)
export const tupleDouble = createTrigger(
  [counterState, "count"],
  (current: number) => current * 2,
  { name: "tuple-double" }
);

export const tupleSetMultiplier = createTrigger(
  [counterState, "multiplier"],
  (_: number, newValue: number) => newValue,
  { name: "tuple-set-multiplier" }
);

// Pattern 3: Batch Triggers (organized multi-property operations)
export const batchOperations = createTrigger(counterState, {
  multiplyByFactor: {
    key: "count",
    action: (count: number) => count * counterState.multiplier.peek(),
    options: { name: "multiply-by-factor" },
  },
  addBonusEntry: {
    key: "entries",
    action: (entries: Entry[]) => [
      ...entries,
      {
        id: Date.now(),
        name: `🎁 Bonus entry! Count: ${counterState.count.peek()}`,
      },
    ],
    options: { name: "add-bonus-entry", debounce: 300 },
  },
  powerReset: {
    key: "count",
    action: () => 100,
    options: { name: "power-reset" },
  },
});

// 🚀 BONUS: Advanced combined operations
export const advancedOperations = createTrigger(counterState, {
  smartIncrement: {
    key: "count",
    action: (count: number) => {
      const multiplier = counterState.multiplier.peek();
      return count + multiplier;
    },
    options: { name: "smart-increment", throttle: 50 },
  },
  celebrationEntry: {
    key: "entries",
    action: (entries: Entry[]) => {
      const count = counterState.count.peek();
      if (count % 10 === 0) {
        return [
          ...entries,
          {
            id: Date.now(),
            name: `🎉 Milestone reached: ${count}!`,
          },
        ];
      }
      return entries;
    },
    options: { name: "celebration-entry" },
  },
});

// Enhanced subscription with change events
counterState.count.on(
  "change",
  (newVal: number, oldVal: number, context?: string) => {
    console.log(
      `🌍 Global counter changed from ${oldVal} to ${newVal} via: ${
        context || "unknown"
      }`
    );
  }
);

// ==================== STORAGE SETUP ====================
// 🎯 SEPARATION PATTERN: External persistence setup
// Persist the main counter state to localStorage
// This will save: count, multiplier, entries
createStorage(counterState, {
  key: "inspatial-counter-state",
  backend: "local",
  debounce: 500, // Save after 500ms of inactivity
  // All fields persisted: count, multiplier, entries
});

// ==================== ENHANCED EXPLICIT PATTERN DEMO ====================
// 🚀 Explicit pattern now has SAME POWER as separation pattern!

type EnhancedExplicitStateType = {
  advancedCount: number;
  status: string;
};

export const enhancedExplicitState = createState<EnhancedExplicitStateType>({
  id: "enhanced-explicit",
  initialState: {
    advancedCount: 0,
    status: "🚀 Enhanced explicit!",
  },
  trigger: {
    // 🔧 Traditional key-based
    increment: {
      key: "advancedCount",
      action: (current: number, amount = 1) => current + amount,
      options: { name: "enhanced-increment", throttle: 50 },
    },

    syncWithOtherStates: {
      key: "advancedCount",
      action: (current: number) => {
        // Access external states during mutation!
        const separationCount = counterState.count.get();
        counterState.multiplier.set(current); // Modify external state!
        return current + separationCount;
      },
      options: { name: "cross-state-operations" },
    },

    incrementExternalState: {
      target: [counterState, "count"],
      action: (current: number) => current + 10,
      options: { name: "external-state-increment", debounce: 200 },
    },

    updateStatus: {
      key: "status",
      action: (_: string, newStatus: string) => `🚀 ${newStatus}`,
      options: { name: "status-update", debounce: 300 },
    },
  },
  storage: {
    key: "enhanced-explicit-state",
    backend: "local",
  },
});

// 🔥 Dynamic trigger management demo
setTimeout(() => {
  enhancedExplicitState.addTrigger?.("runtimeTrigger", {
    key: "advancedCount",
    action: (current: number) => current + 100,
    options: { name: "dynamic-runtime-trigger" },
  });
  console.log("🎉 Runtime trigger added to enhanced explicit state!");
}, 1000);

// ==================== ENHANCED STORAGE PATTERN DEMO ====================
// 🚀 Explicit pattern now has SAME STORAGE POWER as separation pattern!

type StorageEnhancedStateType = {
  data: string;
  count: number;
  temp: string;
};

export const storageEnhancedState = createState<StorageEnhancedStateType>({
  id: "storage-enhanced",
  initialState: {
    data: "persistent data",
    count: 0,
    temp: "temporary data",
  },
  trigger: {
    updateData: {
      key: "data",
      action: (_: string, newData: string) => newData,
      options: { name: "update-data", debounce: 300 },
    },
    incrementCount: {
      key: "count",
      action: (current: number) => current + 1,
      options: { name: "increment-count" },
    },
    updateTemp: {
      key: "temp",
      action: (_: string, newTemp: string) => newTemp,
      options: { name: "update-temp" },
    },
  },
  storage: [
    {
      key: "storage-enhanced-main",
      backend: "local",
      exclude: ["temp"], // Don't persist temp data
      debounce: 500,
    },
    {
      key: "storage-enhanced-session",
      backend: "session",
      include: ["temp"], // Only persist temp to session
      debounce: 100,
    },
    {
      key: "storage-enhanced-memory",
      backend: "memory",
      include: ["count"], // Memory backup for count
      serialize: (data) => JSON.stringify(data),
      deserialize: (data) => JSON.parse(data),
    },
  ],
});

// 🔥 Dynamic storage management demo
setTimeout(() => {
  // Add more storage at runtime!
  const _cleanup = storageEnhancedState.addStorage?.({
    key: "runtime-storage",
    backend: "local",
    include: ["data"],
    debounce: 200,
  });

  console.log("💾 Runtime storage added!");
  console.log("📊 Storage info:", storageEnhancedState.getStorageInfo?.());

  // Test storage management
  setTimeout(() => {
    storageEnhancedState.pauseStorage?.();
    console.log("⏸️ Storage paused");

    setTimeout(() => {
      storageEnhancedState.resumeStorage?.();
      console.log("▶️ Storage resumed");
    }, 1000);
  }, 2000);
}, 1500);
