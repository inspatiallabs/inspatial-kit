// deno-lint-ignore-file
import { $ } from "@inspatial/kit/state";
import { Show, List } from "@inspatial/kit/control-flow";
import { ScrollView, Slot, XStack, YStack } from "@inspatial/kit/structure";
import { Button } from "@inspatial/kit/ornament";
import { Modal } from "@inspatial/kit/presentation";
import {
  useCounter,
  useCounterExplicit,
  useEnhancedExplicit,
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

  /*******************************(Render)*************************************/

  return (
    <>
      {/* Simple modal with direct children */}
      <Modal id="simple-modal" className="p-8" size="base" radius="4xl" overlayFormat="tilted" >
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
            className: "!bg-purple-500/10",
            overlayFormat: "transparent",
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
        overlayFormat="rgb"
        children={{
          view: [
            { children: <Text>First View</Text>, },
            { children: <Text>Second View</Text>,  },
            { children: <Text>Third View</Text>,  },
          ],
        }}
      />

      <ScrollView>
        <div className="flex flex-col justify-center items-center gap-10">
          <h1 className="text-yellow-500 text-8xl">🚀 Counter</h1>
          <div className="max-w-2xl">
            <List each={useCounter.entries} track="id">
              {(entry: EntryProps) => (
                <p className="flex flex-col text-xl text-white mb-2 bg-gray-800 p-3 rounded">
                  {entry.name}
                </p>
              )}
            </List>
          </div>

          {/* Simple Input */}
          <input
            type="number"
            className="bg-gray-800 p-3 rounded-lg outline-none text-white text-2xl"
            value={useCounter.count}
            on:input={(event: any) => {
              useCounter.count.set(Number(event.target.value));
            }}
            placeholder="Enter a number..."
          />

          {/* Current Count Display */}
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <Text className="text-white text-2xl mb-2">Current </Text>
            <div className="text-6xl font-bold text-yellow-400">
              {useCounter.count}
            </div>
          </div>

          {/* ✅ TRIGGER PROPS TEST SECTION */}
          <div className="bg-gray-900 p-6 rounded-lg text-center border-2 border-green-500">
            <h2 className="text-green-400 text-xl mb-4">
              🎯 Trigger Props Test
            </h2>

            {/* Test style: trigger props */}
            <div
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
            </div>

            {/* Test className: trigger props */}
            <div
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
          </div>

          {/* Explicit Pattern Demo */}
          <div className="bg-blue-900 p-4 rounded-lg text-center max-w-md">
            <h3 className="text-white text-lg mb-2">Explicit Pattern Demo</h3>
            <div className="text-2xl font-bold text-blue-300 mb-2">
              {useCounterExplicit.count}
            </div>
            <div className="text-sm text-blue-200 mb-3">
              {useCounterExplicit.message}
            </div>
            <div className="flex gap-2 justify-center">
              <Button
                className="bg-blue-600 px-3 py-1 rounded text-white text-sm hover:bg-blue-700"
                on:tap={() => useCounterExplicit.action.setIncrement()}
              >
                +1 Config
              </Button>
              <Button
                className="bg-blue-600 px-3 py-1 rounded text-white text-sm hover:bg-blue-700"
                on:tap={() =>
                  useCounterExplicit.action.setMessage("Explicit works!")
                }
              >
                Update Msg
              </Button>
            </div>
          </div>

          <Show
            when={$(() => useCounter.count >= 10)}
            otherwise={() => (
              <p className="text-white">Count is less than 10</p>
            )}
          >
            <p className="text-white text-4xl">Count is 10 or greater! 🎉</p>
          </Show>
          {/* Action Buttons */}
          <div className="flex gap-4 flex-wrap justify-center">
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
              className="bg-yellow-500 p-4 rounded-full text-black font-bold text-lg shadow-lg hover:bg-yellow-600 transition-colors"
              on:tap={() => {
                // Force a re-render without changing count to show the difference
                console.log("🔄 Forcing re-render (no count change)");
                useCounter.entries.set([...useCounter.entries.peek()]);
              }}
            >
              Force Re-render
            </Button>
          </div>

          {/* API Showcase */}
          <div className="bg-gray-800 p-4 rounded-lg text-white max-w-2xl">
            <h3 className="text-lg font-bold mb-2">
              🚀 Unified createAction API
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-green-900 p-3 rounded">
                <h4 className="font-bold text-green-300">Batch Trigger</h4>
                <code className="text-xs text-green-200 block mt-1">
                  handleCounter.setIncrement()
                </code>
                <p className="text-xs mt-1">Organized, type-safe, convenient</p>
              </div>
              <div className="bg-teal-900 p-3 rounded">
                <h4 className="font-bold text-teal-300">Direct Signal</h4>
                <code className="text-xs text-teal-200 block mt-1">
                  handleDirectIncrement() // throttled
                </code>
                <p className="text-xs mt-1">Simple, powerful, optimized</p>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-300">
              🎯 <strong>ONE FUNCTION</strong> - Three patterns with{" "}
              <code>createAction()</code>
              <br />✅ Direct:{" "}
              <code>createAction(signal, action, options)</code>
              <br />✅ Tuple: <code>createAction([state, 'key'], action)</code>
              <br />✅ Batch: <code>createAction(state, definition)</code>
            </div>
          </div>

          {/* ✅ COMPREHENSIVE UNIFIED TRIGGER TEST */}
          <div className="bg-gradient-to-r from-emerald-900 to-teal-900 p-6 rounded-lg text-center max-w-4xl">
            <h2 className="text-emerald-300 text-2xl mb-4">
              🚀 Unified Trigger System Demo
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Built-in Trigger Props */}
              <div className="bg-emerald-800 p-4 rounded">
                <h3 className="text-emerald-200 font-bold mb-2">
                  Built-in Props
                </h3>
                <div
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
                </div>
                <div className="text-xs text-emerald-300">
                  ✅ structured style prop
                  <br />✅ className via computed string
                  <br />✅ Dynamic reactivity
                </div>
              </div>

              {/* Standard Event Triggers */}
              <div className="bg-teal-800 p-4 rounded">
                <h3 className="text-teal-200 font-bold mb-2">
                  Standard Events
                </h3>
                <Button
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
                <div className="text-xs text-teal-300 mt-1">
                  ✅ on:tap events
                  <br />
                  ✅ on:input events
                  <br />✅ DOM integration
                </div>
              </div>

              {/* Extensible Registry */}
              <div className="bg-cyan-800 p-4 rounded">
                <h3 className="text-cyan-200 font-bold mb-2">
                  Extensible Registry
                </h3>
                <div className="bg-cyan-700 px-3 py-2 rounded mb-2 text-white text-sm">
                  <code>createTrigger()</code>
                </div>
                <div className="text-xs text-cyan-300">
                  ✅ Custom trigger registration
                  <br />
                  ✅ Platform-specific handlers
                  <br />
                  ✅ Automatic fallbacks
                  <br />✅ See JSDoc for examples
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Explicit Pattern Test */}
          <div className="bg-purple-900 p-6 rounded-lg text-center max-w-md">
            <h3 className="text-white text-lg mb-4">
              🚀 Enhanced Explicit Pattern
            </h3>

            <div className="bg-purple-800 p-3 rounded mb-4">
              <div className="text-2xl font-bold text-purple-200 mb-2">
                {useEnhancedExplicit.advancedCount}
              </div>
              <div className="text-sm text-purple-300">
                {useEnhancedExplicit.status}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
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
                  useEnhancedExplicit.action.setUpdateStatus("Testing!")
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
            </div>

            <div className="mt-4 text-xs text-purple-300 border-t border-purple-700 pt-3">
              <strong>Enhanced Features:</strong>
              <br />✅ Cross-state operations
              <br />✅ External state targeting
              <br />✅ Dynamic trigger management
              <br />✅ Same power as separation pattern!
            </div>
          </div>
        </div>
      </ScrollView>
    </>
  );
}
