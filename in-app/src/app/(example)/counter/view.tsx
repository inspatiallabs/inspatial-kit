// deno-lint-ignore-file
import { $, createState } from "@inspatial/kit/state";
import {
  List,
  TableWrapper,
  TableHeader,
  TableRow,
  TableHeaderColumn,
  TableList,
  TableCell,
} from "@inspatial/kit/data-flow";
import { Show } from "@inspatial/kit/control-flow";
import { View, Slot, XStack, YStack } from "@inspatial/kit/structure";
import { Button, TabWrapper, TabTrigger } from "@inspatial/kit/ornament";
import { Modal, Drawer, Dock } from "@inspatial/kit/presentation";
import { Switch, Checkbox, Radio } from "@inspatial/kit/input";
import { SecurityKeyIcon, ArrowSwapIcon } from "@inspatial/kit/icon";
import {
  useCounter,
  useCounterExplicit,
  useEnhancedExplicit,
  useStorageEnhanced,
  handleCounter,
  handleDirectIncrement,
  handleTupleDouble,
  handleBatch,
  type EntryProps,
} from "./state.ts";
import { Text } from "@inspatial/kit/typography";

// ########################## (TRIGGER PROPS TEST SIGNALS) ##########################

export function CounterView() {
  // Test signals for trigger props
  const testSignals = {
    // Dynamic colors based on count
    backgroundColor: $(() => {
      const count = useCounter.count.get();
      if (count > 20) return "rgb(34, 197, 94)"; // green
      if (count > 10) return "rgb(59, 130, 246)"; // blue
      if (count > 5) return "rgb(245, 158, 11)"; // yellow
      return "rgb(239, 68, 68)"; // red
    }),

    // Dynamic text color
    textColor: $(() => {
      const count = useCounter.count;
      return count > 15 ? "white" : "black";
    }),

    // Dynamic class Names
    isHighCount: $(() => useCounter.count > 10),
    isPulseActive: $(
      () => useCounter.count % 5 === 0 && useCounter.count.get() > 0
    ),

    // Dynamic styles
    borderWidth: $(() => Math.max(1, Math.floor(useCounter.count / 3))),
    fontSize: $(() => Math.max(16, 16 + useCounter.count)),
  };

  // Local view state for unified section toggle (trigger | action)
  const unifiedState = createState({
    unifiedSection: "trigger" as "trigger" | "action",
  });

  // Explicit pattern demo state
  const explicitDemoState = createState({
    activeDemo: "config" as "config" | "enhanced" | "storage",
  });

  /*******************************(Render)*************************************/

  return (
    <>
      {/* Dock Presentation */}
      <Dock
        id="app-dock"
        axis="x"
        direction="bottom"
        toggle={{
          modes: ["minimize", "close"],
          placement: "start",
          layout: "split",
        }}
        children={{
          items: [
            {
              icon: <Slot className="text-2xl">➕</Slot>,
              label: "Increment",
              on: {
                "on:tap": () => handleCounter.setIncrement(),
                "on:longpress": () => handleCounter.setIncrement(10),
              },
            },
            {
              icon: <Slot className="text-2xl">🔄</Slot>,
              label: "Reset",
              on: {
                "on:tap": () => {
                  handleCounter.setReset();
                  handleCounter.setResetEntries();
                },
              },
            },
            {
              icon: <Slot className="text-2xl">➖</Slot>,
              label: "Decrement",
              on: {
                "on:tap": () => handleCounter.setDecrement(),
                "on:longpress": () => handleCounter.setDecrement(10),
              },
            },
          ],
        }}
      />

      {/* Simple modal with direct children */}
      <Modal
        id="simple-modal"
        className="p-8"
        size="base"
        radius="4xl"
        backdrop="tilted"
      >
        <Text className="text-2xl mb-4">Simple Modal</Text>
        <Text>This modal uses direct children without widget tree.</Text>
        <Button
          className="mt-4"
          on:presentation={{ id: "simple-modal", action: "close" }}
        >
          Close
        </Button>
      </Modal>

      {/* Modal with widget tree customization */}
      <Modal
        id="counter-modal"
        children={{
          // 1. Custom Overlay
          overlay: {
            className: "!bg-(--brand)/10",
            backdrop: "transparent",
          },

          // 2. Custom View
          view: [
            {
              className: "p-12 !bg-yellow-100 text-black",
              size: "base",
              radius: "none",
              children: (
                <YStack className="p-6 gap-3">
                  <Text className="text-xl font-semibold">Counter Help</Text>
                  <Text>
                    Use the buttons to adjust the counter and explore trigger
                    props. This modal is controlled via on:presentation.
                  </Text>
                  <Slot className="flex justify-end">
                    <Button
                      format="outline"
                      on:presentation={{ id: "counter-modal", action: "close" }}
                    >
                      Close
                    </Button>
                  </Slot>
                </YStack>
              ),
            },
          ],

          // 3. Optional Wrapper Customization (99% of the time you don't need this)
          // wrapper: {},
        }}
      />

      {/* Multi Modal View */}
      <Modal
        id="multi-modal"
        backdrop="rgb"
        children={{
          view: [
            {
              children: <Text>First View</Text>,
              className: "!bg-red-500 !w-9/12",
            },
            { children: <Text>Second View</Text>, className: "!bg-blue-500" },
            { children: <Text>Third View</Text>, className: "!bg-green-500" },
          ],
        }}
      />

      {/* Drawer Base */}
      <Drawer id="base-drawer">
        <Text>Drawer Base</Text>
      </Drawer>

      <View scrollable>
        <Slot className="flex flex-col justify-center items-center gap-10">
          <h1 className="text-yellow-500 text-8xl">🚀 Counter</h1>

          {/* Switch & Checkbox Controls */}
          <Slot className="bg-(--surface) p-6 rounded-lg text-center max-w-md">
            <h3 className="text-white text-lg mb-4">🎛️ UI Controls</h3>

            <YStack className="gap-4">
              {/* Switch with custom icon */}
              <XStack className="items-center justify-between gap-2">
                <Text id="show-table" className="text-white">
                  Show Table
                </Text>
                <Switch
                  id="show-table"
                  selected={useCounter.showTableBox.get()}
                  icon={<ArrowSwapIcon size="4xs" />}
                  size="md"
                  radius="squared"
                  on:input={(e: any) =>
                    useCounter.showTableBox.set(!!(e?.target?.checked ?? e))
                  }
                />
              </XStack>

              {/* Checkbox with custom styles */}
              <XStack className="items-center justify-between">
                <Text id="show-trigger-props" className="text-white">
                  Show Trigger Props
                </Text>
                <Checkbox
                  id="show-trigger-props"
                  selected={useCounter.showTriggerPropsBox.get()}
                  format="flat"
                  size="sm"
                  radius="sm"
                  className="peer-checked:ring-white-500 peer-checked:ring-4"
                  icon="tick"
                  on:input={(e: any) =>
                    useCounter.showTriggerPropsBox.set(
                      !!(e?.target?.checked ?? e)
                    )
                  }
                />
              </XStack>

              {/* Radio with custom styles */}
              <XStack className="items-center justify-between">
                <Text className="text-white">Show Unified Trigger/Action</Text>
                <Radio
                  name="unified-section"
                  value="trigger"
                  selected={unifiedState.unifiedSection.get() === "trigger"}
                  on:input={() => unifiedState.unifiedSection.set("trigger")}
                  icon="ball"
                />
                <Radio
                  name="unified-section"
                  value="action"
                  selected={unifiedState.unifiedSection.get() === "action"}
                  on:input={() => unifiedState.unifiedSection.set("action")}
                  icon="ball"
                />
              </XStack>

              {/* Tab Demo controlling Explicit Pattern Demo */}
              <YStack className="gap-2">
                <Text className="text-white text-sm">
                  Explicit Pattern Demo Control
                </Text>
                <TabWrapper>
                  <TabTrigger
                    value="config"
                    selected={explicitDemoState.activeDemo.get() === "config"}
                    on:input={() => explicitDemoState.activeDemo.set("config")}
                  >
                    Config
                  </TabTrigger>
                  <TabTrigger
                    value="enhanced"
                    selected={explicitDemoState.activeDemo.get() === "enhanced"}
                    on:input={() => explicitDemoState.activeDemo.set("enhanced")}
                  >
                    Enhanced
                  </TabTrigger>
                  <TabTrigger
                    value="storage"
                    selected={explicitDemoState.activeDemo.get() === "storage"}
                    on:input={() => explicitDemoState.activeDemo.set("storage")}
                  >
                    Storage
                  </TabTrigger>
                </TabWrapper>
              </YStack>
            </YStack>
          </Slot>

          {/* Conditionally show table */}
          <Show when={useCounter.showTableBox}>
            <Slot className="max-w-2xl w-full">
              <TableWrapper>
                <TableHeader>
                  <TableRow>
                    <TableHeaderColumn>ID</TableHeaderColumn>
                    <TableHeaderColumn>Name</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableList each={useCounter.entries} track="id">
                  {(entry: EntryProps) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.id}</TableCell>
                      <TableCell>{entry.name}</TableCell>
                    </TableRow>
                  )}
                </TableList>
              </TableWrapper>
            </Slot>
          </Show>

          {/* Simple Input */}
          <input
            type="number"
            className="bg-(--muted) shadow-hollow p-3 rounded-lg outline-none text-white text-2xl"
            value={useCounter.count}
            on:input={(event: any) => {
              useCounter.count.set(Number(event.target.value));
            }}
            placeholder="Enter a number..."
          />

          {/* Current Count Display */}
          <Slot className="bg-(--brand) p-6 rounded-lg text-center">
            <Text className="text-white text-2xl mb-2">Current </Text>
            <Slot className="text-6xl font-bold text-white">
              {useCounter.count}
            </Slot>
          </Slot>

          {/* ✅ TRIGGER PROPS TEST SECTION */}
          <Show when={useCounter.showTriggerPropsBox}>
            <Slot className="bg-(--muted) p-6 rounded-lg text-center border-2 border-green-500">
              <h2 className="text-green-400 text-xl mb-4">
                🎯 Trigger Props Test
              </h2>

              {/* Test style: trigger props */}
              <Slot
                className="p-4 rounded-lg mb-4 transition-all duration-300"
                style={{
                  web: {
                    backgroundColor: testSignals.backgroundColor,
                    color: testSignals.textColor,
                    borderWidth: testSignals.borderWidth,
                    fontSize: testSignals.fontSize,
                  },
                }}
              >
                Dynamic Styles! Count: {useCounter.count}
              </Slot>

              {/* Test className: trigger props */}
              <Slot
                className={{
                  "p-4": true,
                  "rounded-lg": true,
                  "mb-4": true,
                  "transition-all": true,
                  "duration-300": true,
                  "animate-pulse": testSignals.isPulseActive,
                  "scale-110 bg-gradient-to-r from-purple-500 to-pink-500":
                    testSignals.isHighCount,
                }}
              />
            </Slot>
          </Show>

          {/* Dynamic Explicit Pattern Demo controlled by tabs */}
          <Show when={explicitDemoState.activeDemo.get() === "config"}>
            <Slot className="bg-blue-900 p-4 rounded-lg text-center max-w-md">
              <h3 className="text-white text-lg mb-2">
                📋 Config Pattern Demo
              </h3>
              <Slot className="text-2xl font-bold text-blue-300 mb-2">
                {useCounterExplicit.count}
              </Slot>
              <Slot className="text-sm text-blue-200 mb-3">
                {useCounterExplicit.message}
              </Slot>
              <Slot className="flex gap-2 justify-center">
                <Button
                  className="bg-blue-600 px-3 py-1 rounded text-white text-sm hover:bg-blue-700"
                  on:tap={() => useCounterExplicit.action.setIncrement()}
                >
                  +1 Config
                </Button>
                <Button
                  className="bg-blue-600 px-3 py-1 rounded text-white text-sm hover:bg-blue-700"
                  on:tap={() =>
                    useCounterExplicit.action.setMessage(
                      "Config pattern works!"
                    )
                  }
                >
                  Update Msg
                </Button>
                <Button
                  className="bg-red-600 px-3 py-1 rounded text-white text-sm hover:bg-red-700"
                  on:tap={() => {
                    useCounterExplicit.action.setReset();
                    useCounterExplicit.action.setResetMessage();
                  }}
                >
                  Reset
                </Button>
              </Slot>
            </Slot>
          </Show>

          <Show
            when={$(() => useCounter.count >= 10)}
            otherwise={() => (
              <p className="text-white">Count is less than 10</p>
            )}
          >
            <p className="text-white text-4xl">Count is 10 or greater! 🎉</p>
          </Show>
          {/* Action Buttons */}
          <Slot className="flex gap-4 flex-wrap justify-center">
            {/* Dock presentation test */}
            <Button
              className="bg-brand p-4 rounded-full text-white font-bold text-lg hover:brightness-110 transition-colors"
              on:presentation={{ id: "app-dock", action: "toggle" }}
            >
              Open Dock
            </Button>
            {/* Modal demo trigger */}
            <Button
              className="bg-teal-600 p-4 rounded-full text-white font-bold text-lg hover:bg-teal-700 transition-colors"
              on:presentation={{ id: "simple-modal", action: "toggle" }}
            >
              Simple Modal
            </Button>
            <Button
              className="bg-(--window) p-4 rounded-full text-white font-bold text-lg hover:bg-zinc-800 transition-colors"
              on:presentation={{ id: "counter-modal", action: "toggle" }}
            >
              Open Modal
            </Button>
            <Button
              className="bg-orange-500"
              on:presentation={{ id: "multi-modal", action: "toggle" }}
            >
              Multi-Modal
            </Button>
            <Button
              className="bg-indigo-600 p-4 rounded-full text-white font-bold text-lg hover:bg-indigo-700 transition-colors"
              on:presentation={{ id: "base-drawer", action: "toggle" }}
            >
              Drawer
            </Button>
            <Button
              className="bg-purple-600 p-4 rounded-full text-white font-bold text-lg shadow-lg hover:bg-purple-700 transition-colors"
              on:tap={() => handleTupleDouble()}
            >
              ×2 Tuple
            </Button>
            <Button
              className="bg-indigo-600 p-4 rounded-full text-white font-bold text-lg shadow-lg hover:bg-indigo-700 transition-colors"
              on:tap={() => handleBatch.setMultiplyByFactor()}
            >
              ×Factor Batch
            </Button>
            <Button
              className="bg-green-500 p-4 rounded-full text-white font-bold text-lg shadow-lg hover:bg-green-600 transition-colors"
              on:tap={() => handleCounter.setIncrement()}
            >
              + Trigger
            </Button>
            <Button
              className="bg-teal-500 p-4 rounded-full text-white font-bold text-lg shadow-lg hover:bg-teal-600 transition-colors"
              on:tap={() => handleDirectIncrement()}
            >
              + External
            </Button>
            <Button
              className="bg-red-500 p-4 rounded-full text-white font-bold text-lg shadow-lg hover:bg-red-600 transition-colors"
              on:tap={() => handleCounter.setDecrement()}
            >
              - Decrement
            </Button>
            <Button
              className="bg-blue-500 p-4 rounded-full text-white font-bold text-lg shadow-lg hover:bg-blue-600 transition-colors"
              on:tap={() =>
                handleCounter.setAddEntry(
                  `Entry #${useCounter.entries.peek().length + 1} added!`
                )
              }
            >
              Add Entry
            </Button>
            <Button
              className="bg-purple-500 p-4 rounded-full text-white font-bold text-lg shadow-lg hover:bg-purple-600 transition-colors"
              on:tap={() => {
                console.log("🔄 Manual set with context");
                useCounter.count.set(
                  useCounter.count.peek() + 10,
                  "manual-boost"
                );
              }}
            >
              +10 Boost
            </Button>
            <Button
              className="bg-orange-500 p-4 rounded-full text-white font-bold text-lg shadow-lg hover:bg-orange-600 transition-colors"
              on:tap={() => {
                handleCounter.setReset();
                handleCounter.setResetEntries();
              }}
            >
              🔄 Reset All
            </Button>
            <Button
              className="!bg-yellow-500 p-4 rounded-full text-black font-bold text-lg shadow-lg hover:bg-yellow-600 transition-colors"
              on:tap={() => {
                // Force a re-render without changing count to show the difference
                console.log("🔄 Forcing re-render (no count change)");
                useCounter.entries.set([...useCounter.entries.peek()]);
              }}
            >
              Force Re-render
            </Button>
          </Slot>

          {/* API Showcase (shown when unifiedSection === 'action') */}
          <Show when={$(() => unifiedState.unifiedSection.get() === "action")}>
            <Slot className="bg-(--window) p-4 rounded-lg text-white max-w-2xl">
              <h3 className="text-lg font-bold mb-2">
                🚀 Unified createAction API
              </h3>
              <Slot className="grid grid-cols-2 gap-4 text-sm">
                <Slot className="bg-green-900 p-3 rounded">
                  <h4 className="font-bold text-green-300">Batch Trigger</h4>
                  <code className="text-xs text-green-200 block mt-1">
                    handleCounter.setIncrement()
                  </code>
                  <p className="text-xs mt-1">
                    Organized, type-safe, convenient
                  </p>
                </Slot>
                <Slot className="bg-teal-900 p-3 rounded">
                  <h4 className="font-bold text-teal-300">Direct Signal</h4>
                  <code className="text-xs text-teal-200 block mt-1">
                    handleDirectIncrement() // throttled
                  </code>
                  <p className="text-xs mt-1">Simple, powerful, optimized</p>
                </Slot>
              </Slot>
              <Slot className="mt-3 text-xs text-(--primary)">
                🎯 <strong>ONE FUNCTION</strong> - Three patterns with{" "}
                <code>createAction()</code>
                <br />✅ Direct:{" "}
                <code>createAction(signal, action, options)</code>
                <br />✅ Tuple:{" "}
                <code>createAction([state, 'key'], action)</code>
                <br />✅ Batch: <code>createAction(state, definition)</code>
              </Slot>
            </Slot>
          </Show>

          {/* ✅ COMPREHENSIVE UNIFIED TRIGGER TEST (shown when unifiedSection === 'trigger') */}
          <Show when={$(() => unifiedState.unifiedSection.get() === "trigger")}>
            <Slot className="bg-gradient-to-r from-emerald-900 to-teal-900 p-6 rounded-lg text-center max-w-4xl">
              <h2 className="text-emerald-300 text-2xl mb-4">
                🚀 Unified Trigger System Demo
              </h2>

              <Slot className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Built-in Trigger Props */}
                <Slot className="bg-emerald-800 p-4 rounded">
                  <h3 className="text-emerald-200 font-bold mb-2">
                    Built-in Props
                  </h3>
                  <Slot
                    className={{
                      "p-2": true,
                      rounded: true,
                      "mb-2": true,
                      "transition-all": true,
                      "duration-300": true,
                      "animate-bounce": $(() => useCounter.count % 10 === 0),
                    }}
                    style={{
                      web: {
                        backgroundColor: testSignals.backgroundColor,
                        transform: $(
                          () => `scale(${1 + useCounter.count * 0.01})`
                        ),
                      },
                    }}
                  >
                    Count: {useCounter.count}
                  </Slot>
                  <Slot className="text-xs text-emerald-300">
                    ✅ structured style prop
                    <br />✅ className via computed string
                    <br />✅ Dynamic reactivity
                  </Slot>
                </Slot>

                {/* Standard Event Triggers */}
                <Slot className="bg-teal-800 p-4 rounded">
                  <h3 className="text-teal-200 font-bold mb-2">
                    Standard Events
                  </h3>
                  <Button
                    size="auto"
                    className="bg-teal-600 px-3 py-1 rounded mb-1 text-white w-full"
                    on:tap={() => {
                      console.log("✅ Standard on:tap working!");
                      handleCounter.setIncrement();
                    }}
                  >
                    on:tap
                  </Button>
                  <input
                    className="bg-teal-700 px-2 py-1 rounded text-white w-full text-sm"
                    placeholder="on:input test"
                    on:input={(e: any) => {
                      console.log(
                        "✅ Standard on:input working!",
                        e.target.value
                      );
                    }}
                  />
                  <Slot className="text-xs text-teal-300 mt-1">
                    ✅ on:tap events
                    <br />
                    ✅ on:input events
                    <br />✅ DOM integration
                  </Slot>
                </Slot>

                {/* Extensible Registry */}
                <Slot className="bg-cyan-800 p-4 rounded">
                  <h3 className="text-cyan-200 font-bold mb-2">
                    Extensible Registry
                  </h3>
                  <Slot className="bg-cyan-700 px-3 py-2 rounded mb-2 text-white text-sm">
                    <code>createTrigger()</code>
                  </Slot>
                  <Slot className="text-xs text-cyan-300">
                    ✅ Custom trigger registration
                    <br />
                    ✅ Platform-specific handlers
                    <br />
                    ✅ Automatic fallbacks
                    <br />✅ See JSDoc for examples
                  </Slot>
                </Slot>
              </Slot>
            </Slot>
          </Show>

          {/* Enhanced Explicit Pattern - shown when enhanced tab is selected */}
          <Show when={explicitDemoState.activeDemo.get() === "enhanced"}>
            <Slot className="bg-purple-900 p-6 rounded-lg text-center max-w-md">
              <h3 className="text-white text-lg mb-4">
                🚀 Enhanced Explicit Pattern
              </h3>

              <Slot className="bg-purple-800 p-3 rounded mb-4">
                <Slot className="text-2xl font-bold text-purple-200 mb-2">
                  {useEnhancedExplicit.advancedCount}
                </Slot>
                <Slot className="text-sm text-purple-300">
                  {useEnhancedExplicit.status}
                </Slot>
              </Slot>

              <Slot className="grid grid-cols-2 gap-2 text-xs">
                {/* Traditional trigger */}
                <Button
                  className="bg-purple-600 px-2 py-2 rounded text-white hover:bg-purple-700"
                  on:tap={() => useEnhancedExplicit.action.setIncrement(1)}
                >
                  +1 Traditional
                </Button>

                {/* Cross-state sync */}
                <Button
                  className="bg-indigo-600 px-2 py-2 rounded text-white hover:bg-indigo-700"
                  on:tap={() =>
                    useEnhancedExplicit.action.setSyncWithOtherStates()
                  }
                >
                  🌐 Sync States
                </Button>

                {/* External state targeting */}
                <Button
                  className="bg-pink-600 px-2 py-2 rounded text-white hover:bg-pink-700"
                  on:tap={() =>
                    useEnhancedExplicit.action.setIncrementExternalState()
                  }
                >
                  📍 +10 External
                </Button>

                {/* Update status */}
                <Button
                  className="bg-cyan-600 px-2 py-2 rounded text-white hover:bg-cyan-700"
                  on:tap={() =>
                    useEnhancedExplicit.action.setUpdateStatus(
                      "Enhanced works!"
                    )
                  }
                >
                  💬 Update Status
                </Button>

                {/* Dynamic trigger test */}
                <Button
                  className="bg-yellow-600 px-2 py-2 rounded text-white hover:bg-yellow-700 col-span-2"
                  on:tap={() => {
                    useEnhancedExplicit.addAction?.("testTrigger", {
                      key: "advancedCount",
                      fn: (current: number) => current + 50,
                      options: { name: "test-runtime-trigger" },
                    });
                    // Use the newly added trigger
                    (useEnhancedExplicit.action as any).testTrigger?.();
                  }}
                >
                  🔥 Add & Use Dynamic Trigger (+50)
                </Button>
              </Slot>

              <Slot className="mt-4 text-xs text-purple-300 border-t border-purple-700 pt-3">
                <strong>Enhanced Features:</strong>
                <br />✅ Cross-state operations
                <br />✅ External state targeting
                <br />✅ Dynamic trigger management
                <br />✅ Same power as separation pattern!
              </Slot>
            </Slot>
          </Show>

          {/* Storage Pattern Demo - shown when storage tab is selected */}
          <Show when={explicitDemoState.activeDemo.get() === "storage"}>
            <Slot className="bg-green-900 p-6 rounded-lg text-center max-w-md">
              <h3 className="text-white text-lg mb-4">
                💾 Storage Enhanced Pattern
              </h3>

              <Slot className="bg-green-800 p-3 rounded mb-4">
                <Slot className="text-2xl font-bold text-green-200 mb-2">
                  {useStorageEnhanced.count}
                </Slot>
                <Slot className="text-sm text-green-300 mb-1">
                  Data: {useStorageEnhanced.data}
                </Slot>
                <Slot className="text-xs text-green-400">
                  Temp: {useStorageEnhanced.temp}
                </Slot>
              </Slot>

              <Slot className="grid grid-cols-2 gap-2 text-xs">
                <Button
                  className="bg-green-600 px-2 py-2 rounded text-white hover:bg-green-700"
                  on:tap={() => useStorageEnhanced.action.setIncrementCount()}
                >
                  +1 Count
                </Button>
                <Button
                  className="bg-teal-600 px-2 py-2 rounded text-white hover:bg-teal-700"
                  on:tap={() =>
                    useStorageEnhanced.action.setUpdateData("Updated!")
                  }
                >
                  Update Data
                </Button>
                <Button
                  className="bg-cyan-600 px-2 py-2 rounded text-white hover:bg-cyan-700 col-span-2"
                  on:tap={() =>
                    useStorageEnhanced.action.setUpdateTemp("Session temp!")
                  }
                >
                  Update Temp (Session Only)
                </Button>
              </Slot>

              <Slot className="mt-4 text-xs text-green-300 border-t border-green-700 pt-3">
                <strong>Storage Features:</strong>
                <br />
                💾 Multiple storage backends
                <br />
                🎯 Selective persistence
                <br />⚡ Runtime storage management
                <br />
                🔄 Automatic serialization
              </Slot>
            </Slot>
          </Show>
        </Slot>
      </View>
    </>
  );
}
