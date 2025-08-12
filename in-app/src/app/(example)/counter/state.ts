import { createState, createStorage, createAction } from "@inspatial/state";
// import { cloud } from "@inspatial/app/api/inspatial-cloud.api.ts";

// ########################## (CLOUD) ##########################

// const systemAdmins = cloud.auth.login("admin@user.com", "password").then(
//   (user: unknown) => {
//     console.log(user);
//     return cloud.entry.getEntryList("user")
//   }
// );

// ########################## (STATE & TRIGGERS) ##########################
export interface EntryProps {
  id: number;
  name: string;
}

// ==================== PATTERN 1: (EXPLICIT) ====================
type CounterProps = { count: number; message: string };

export const useCounterExplicit = createState.in({
  id: "counter-explicit",
  initialState: <CounterProps>{
    count: 0,
    message: "Config pattern works!",
  },
  action: {
    setIncrement: {
      key: "count",
      fn: (current: number, amount = 1) => current + amount,
      options: { name: "explicit-increment", throttle: 50 },
    },
    setDecrement: {
      key: "count",
      fn: (current: number, amount = 1) => current - amount,
      options: { name: "explicit-decrement", throttle: 50 },
    },
    setMessage: {
      key: "message",
      fn: (_: string, msg: string) => msg,
      options: { name: "explicit-set-message", debounce: 200 },
    },
    setReset: {
      key: "count",
      fn: () => 0,
      options: { name: "explicit-reset", once: false },
    },
    setResetMessage: {
      key: "message",
      fn: () => "Config pattern works!",
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
export const useCounter = createState({
  count: 0,
  multiplier: 2,
  entries: [
    { id: 1, name: "🚀 Unified createAction API!" },
    { id: 2, name: "🧠 75% cognitive load reduction!" },
    { id: 3, name: "✨ One function, three patterns!" },
    { id: 4, name: "🎯 Simple mental model!" },
  ] as EntryProps[],
});

// Built-in convenience functions using unified createAction
export const handleCounter = createAction(useCounter, {
  setIncrement: {
    key: "count",
    fn: (current: number, amount = 1) => current + amount,
    options: { name: "built-in-increment" },
  },
  setDecrement: {
    key: "count",
    fn: (current: number, amount = 1) => current - amount,
    options: { name: "built-in-decrement" },
  },
  setCount: {
    key: "count",
    fn: (_: number, value: number) => value,
    options: { name: "built-in-set-count" },
  },
  setAddEntry: {
    key: "entries",
    fn: (entries: EntryProps[], text: string) => [
      ...entries,
      { id: Date.now(), name: text },
    ],
    options: { name: "built-in-add-entry" },
  },
  setReset: {
    key: "count",
    fn: () => 0,
    options: { name: "built-in-reset" },
  },
  setResetEntries: {
    key: "entries",
    fn: (): EntryProps[] => [
      { id: 1, name: "🚀 Unified createAction API!" },
      { id: 2, name: "🧠 75% cognitive load reduction!" },
      { id: 3, name: "✨ One function, three patterns!" },
      { id: 4, name: "🔄 Reset complete!" },
    ],
    options: { name: "built-in-reset-entries" },
  },
});

// ==================== UNIFIED createAction API SHOWCASE ====================
// Three Patterns, One Function!

// Pattern 1: Direct Signal (simplest - for single signal operations)
export const handleDirectIncrement = createAction(
  useCounter.count,
  (current: number) => current + 1,
  { name: "direct-increment", throttle: 100 }
);

export const handleDirectAddEntry = createAction(
  useCounter.entries,
  (entries: EntryProps[], text: string) => [
    ...entries,
    { id: Date.now(), name: text },
  ],
  { name: "direct-add-entry", debounce: 200 }
);

// Pattern 2: State Property Tuple (type-safe property targeting)
export const handleTupleDouble = createAction(
  [useCounter, "count"],
  (current: number) => current * 2,
  { name: "tuple-double" }
);

export const handleTupleSetMultiplier = createAction(
  [useCounter, "multiplier"],
  (_: number, newValue: number) => newValue,
  { name: "tuple-set-multiplier" }
);

// Pattern 3: Batch Triggers (organized multi-property operations)
export const handleBatch = createAction(useCounter, {
  setMultiplyByFactor: {
    key: "count",
    fn: (count: number) => {
      const factor = useCounter.multiplier.peek();
      // If count is 0, make the operation visible by setting to the factor
      // Otherwise multiply as expected
      return count === 0 ? factor : count * factor;
    },
    options: { name: "multiply-by-factor" },
  },
  setAddBonusEntry: {
    key: "entries",
    fn: (entries: EntryProps[]) => [
      ...entries,
      {
        id: Date.now(),
        name: `🎁 Bonus entry! Count: ${useCounter.count.peek()}`,
      },
    ],
    options: { name: "add-bonus-entry", debounce: 300 },
  },
  setPowerReset: {
    key: "count",
    fn: () => 100,
    options: { name: "power-reset" },
  },
});

// 🚀 BONUS: Advanced combined operations
export const handleAdvanced = createAction(useCounter, {
  setSmartIncrement: {
    key: "count",
    fn: (count: number) => {
      const multiplier = useCounter.multiplier.peek();
      return count + multiplier;
    },
    options: { name: "smart-increment", throttle: 50 },
  },
  setCelebrationEntry: {
    key: "entries",
    fn: (entries: EntryProps[]) => {
      const count = useCounter.count.peek();
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
useCounter.count.on(
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
createStorage(useCounter, {
  key: "inspatial-counter-state",
  backend: "local",
  debounce: 500, // Save after 500ms of inactivity
  // All fields persisted: count, multiplier, entries
});

// ==================== ENHANCED EXPLICIT PATTERN DEMO ====================
// 🚀 Explicit pattern now has SAME POWER as separation pattern!

type EnhancedCounterProps = {
  advancedCount: number;
  status: string;
};

export const useEnhancedExplicit = createState.in({
  id: "enhanced-explicit",
  initialState: <EnhancedCounterProps>{
    advancedCount: 0,
    status: "🚀 Enhanced explicit!",
  },
  action: {
    // 🔧 Traditional key-based
    setIncrement: {
      key: "advancedCount",
      fn: (current: number, amount = 1) => current + amount,
      options: { name: "enhanced-increment", throttle: 50 },
    },

    setSyncWithOtherStates: {
      key: "advancedCount",
      fn: (current: number) => {
        // Access external states during mutation!
        const separationCount = useCounter.count.get();
        useCounter.multiplier.set(current); // Modify external state!
        return current + separationCount;
      },
      options: { name: "cross-state-operations" },
    },

    setIncrementExternalState: {
      target: [useCounter, "count"],
      fn: (current: number) => current + 10,
      options: { name: "external-state-increment", debounce: 200 },
    },

    setUpdateStatus: {
      key: "status",
      fn: (_: string, newStatus: string) => `🚀 ${newStatus}`,
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
  useEnhancedExplicit.addAction?.("runtimeTrigger", {
    key: "advancedCount",
    fn: (current: number) => current + 100,
    options: { name: "dynamic-runtime-trigger" },
  });
  console.log("🎉 Runtime trigger added to enhanced explicit state!");
}, 1000);

// ==================== ENHANCED STORAGE PATTERN DEMO ====================
// 🚀 Explicit pattern now has SAME STORAGE POWER as separation pattern!

type StorageCounterProps = {
  data: string;
  count: number;
  temp: string;
};

export const useStorageEnhanced = createState.in({
  id: "storage-enhanced",
  initialState: <StorageCounterProps>{
    data: "persistent data",
    count: 0,
    temp: "temporary data",
  },
  action: {
    setUpdateData: {
      key: "data",
      fn: (_: string, newData: string) => newData,
      options: { name: "update-data", debounce: 300 },
    },
    setIncrementCount: {
      key: "count",
      fn: (current: number) => current + 1,
      options: { name: "increment-count" },
    },
    setUpdateTemp: {
      key: "temp",
      fn: (_: string, newTemp: string) => newTemp,
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
      serialize: ((data: unknown) => JSON.stringify(data)) as (
        state: any
      ) => string,
      deserialize: ((data: string) => JSON.parse(data)) as (
        data: string
      ) => any,
    },
  ],
});

// 🔥 Dynamic storage management demo
setTimeout(() => {
  // Add more storage at runtime!
  const _cleanup = useStorageEnhanced.addStorage?.({
    key: "runtime-storage",
    backend: "local",
    include: ["data"],
    debounce: 200,
  });

  console.log("💾 Runtime storage added!");
  console.log("📊 Storage info:", useStorageEnhanced.getStorageInfo?.());

  // Test storage management
  setTimeout(() => {
    useStorageEnhanced.pauseStorage?.();
    console.log("⏸️ Storage paused");

    setTimeout(() => {
      useStorageEnhanced.resumeStorage?.();
      console.log("▶️ Storage resumed");
    }, 1000);
  }, 2000);
}, 1500);
