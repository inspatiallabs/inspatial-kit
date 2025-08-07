// deno-lint-ignore-file
import { $ } from "@inspatial/state";
import { Show, List } from "@inspatial/kit";
import {
  counterState,
  counterStateExplicit,
  enhancedExplicitState,
  builtInTrigger,
  directIncrement,
  tupleDouble,
  batchOperations,
  type Entry,
} from "./state.ts";


// ########################## (TRIGGER PROPS TEST SIGNALS) ##########################


export function Counter() {


// Test signals for trigger props
const testSignals = {
  // Dynamic colors based on count
  backgroundColor: $(() => {
    const count = counterState.count.get();
    if (count > 20) return "rgb(34, 197, 94)"; // green
    if (count > 10) return "rgb(59, 130, 246)"; // blue
    if (count > 5) return "rgb(245, 158, 11)"; // yellow
    return "rgb(239, 68, 68)"; // red
  }),
  
  // Dynamic text color
  textColor: $(() => {
    const count = counterState.count.get();
    return count > 15 ? "white" : "black";
  }),
  
  // Dynamic classes
  isHighCount: $(() => counterState.count.get() > 10),
  isPulseActive: $(() => counterState.count.get() % 5 === 0 && counterState.count.get() > 0),
  
  // Dynamic styles
  borderWidth: $(() => Math.max(1, Math.floor(counterState.count.get() / 3))),
  fontSize: $(() => Math.max(16, 16 + counterState.count.get())),
};

/*******************************(Render)*************************************/

  return (
    <>
      <div className="flex flex-col h-screen justify-center items-center gap-10 bg-black">
        <h1 className="text-yellow-500 text-8xl">🚀 InSpatial App</h1>
        <div className="max-w-2xl">
          <List each={counterState.entries} track="id">
            {(entry: Entry) => (
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
          value={counterState.count.get()}
          on:input={(event: any) => {
            counterState.count.set(Number(event.target.value));
          }}
          placeholder="Enter a number..."
        />

        {/* Current Count Display */}
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <h2 className="text-white text-2xl mb-2">Current </h2>
          <div className="text-6xl font-bold text-yellow-400">
            {$(() => counterState.count.get())}
          </div>
        </div>

        {/* ✅ TRIGGER PROPS TEST SECTION */}
        <div className="bg-gray-900 p-6 rounded-lg text-center border-2 border-green-500">
          <h2 className="text-green-400 text-xl mb-4">🎯 Trigger Props Test</h2>
          
          {/* Test style: trigger props */}
          <div 
            className="p-4 rounded-lg mb-4 transition-all duration-300"
            style:background-color={testSignals.backgroundColor}
            style:color={testSignals.textColor}
            style:border-width={testSignals.borderWidth}
            style:font-size={testSignals.fontSize}
          >
            Dynamic Styles! Count: {$(() => counterState.count.get())}
          </div>

          {/* Test class: trigger props */}
          <div 
            className="p-4 rounded-lg mb-4 transition-all duration-300"
            class:animate-pulse={testSignals.isPulseActive}
            class:scale-110={testSignals.isHighCount}
            class:bg-gradient-to-r={testSignals.isHighCount}
            class:from-purple-500={testSignals.isHighCount}
            class:to-pink-500={testSignals.isHighCount}
          >
            Dynamic Classes! {testSignals.isHighCount.get() ? "HIGH COUNT!" : "Low count"}
          </div>

          <div className="text-sm text-green-300 mb-4">
            ✅ style:background-color, style:color, style:border-width, style:font-size<br/>
            ✅ class:animate-pulse, class:scale-110, class:bg-gradient-to-r<br/>
            Try clicking buttons to see dynamic trigger props in action!
          </div>

          <div className="text-sm text-green-300">
            📚 See <code>registerTriggerHandler()</code> JSDoc for examples of creating custom platform-specific triggers like:<br/>
            • <code>on:swipe</code> - Custom touch gesture detection<br/>
            • <code>on:iosOnlyInput</code> - iOS-enhanced input with fallback<br/>
            • <code>on:spatialTap</code> - XR spatial events with click fallback
          </div>
        </div>

        {/* Explicit Pattern Demo */}
        <div className="bg-blue-900 p-4 rounded-lg text-center max-w-md">
          <h3 className="text-white text-lg mb-2">Explicit Pattern Demo</h3>
          <div className="text-2xl font-bold text-blue-300 mb-2">
            {$(() => counterStateExplicit.count.get())}
          </div>
          <div className="text-sm text-blue-200 mb-3">
            {$(() => counterStateExplicit.message.get())}
          </div>
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              className="bg-blue-600 px-3 py-1 rounded text-white text-sm hover:bg-blue-700"
              on:click={() => counterStateExplicit.trigger.increment()}
            >
              +1 Config
            </button>
            <button
              type="button"
              className="bg-blue-600 px-3 py-1 rounded text-white text-sm hover:bg-blue-700"
              on:click={() =>
                counterStateExplicit.trigger.setMessage("Explicit works!")
              }
            >
              Update Msg
            </button>
          </div>
        </div>

        <Show
          when={$(() => counterState.count.get() >= 10)}
          otherwise={() => <p className="text-white">Count is less than 10</p>}
        >
          <p className="text-white text-4xl">Count is 10 or greater! 🎉</p>
        </Show>
        {/* Action Buttons */}
        <div className="flex gap-4 flex-wrap justify-center">
          <button
            type="button"
            className="bg-purple-600 p-4 rounded-full text-white font-bold text-lg shadow-lg hover:bg-purple-700 transition-colors"
            on:click={() => tupleDouble()}
          >
            ×2 Tuple
          </button>
          <button
            type="button"
            className="bg-indigo-600 p-4 rounded-full text-white font-bold text-lg shadow-lg hover:bg-indigo-700 transition-colors"
            on:click={() => batchOperations.multiplyByFactor()}
          >
            ×Factor Batch
          </button>
          <button
            type="button"
            className="bg-green-500 p-4 rounded-full text-white font-bold text-lg shadow-lg hover:bg-green-600 transition-colors"
            on:click={() => builtInTrigger.increment()}
          >
            + Trigger
          </button>
          <button
            type="button"
            className="bg-teal-500 p-4 rounded-full text-white font-bold text-lg shadow-lg hover:bg-teal-600 transition-colors"
            on:click={() => directIncrement()}
          >
            + External
          </button>
          <button
            type="button"
            className="bg-red-500 p-4 rounded-full text-white font-bold text-lg shadow-lg hover:bg-red-600 transition-colors"
            on:click={() => builtInTrigger.decrement()}
          >
            - Decrement
          </button>
          <button
            type="button"
            className="bg-blue-500 p-4 rounded-full text-white font-bold text-lg shadow-lg hover:bg-blue-600 transition-colors"
            on:click={() =>
              builtInTrigger.addEntry(
                `Entry #${counterState.entries.get().length + 1} added!`
              )
            }
          >
            Add Entry
          </button>
          <button
            type="button"
            className="bg-purple-500 p-4 rounded-full text-white font-bold text-lg shadow-lg hover:bg-purple-600 transition-colors"
            on:click={() => {
              console.log("🔄 Manual set with context");
              counterState.count.set(
                counterState.count.get() + 10,
                "manual-boost"
              );
            }}
          >
            +10 Boost
          </button>
          <button
            type="button"
            className="bg-orange-500 p-4 rounded-full text-white font-bold text-lg shadow-lg hover:bg-orange-600 transition-colors"
            on:click={() => {
              builtInTrigger.reset();
              builtInTrigger.resetEntries();
            }}
          >
            🔄 Reset All
          </button>
          <button
            type="button"
            className="bg-yellow-500 p-4 rounded-full text-black font-bold text-lg shadow-lg hover:bg-yellow-600 transition-colors"
            on:click={() => {
              // Force a re-render without changing count to show the difference
              console.log("🔄 Forcing re-render (no count change)");
              counterState.entries.set([...counterState.entries.get()]);
            }}
          >
            Force Re-render
          </button>
        </div>

        {/* API Showcase */}
        <div className="bg-gray-800 p-4 rounded-lg text-white max-w-2xl">
          <h3 className="text-lg font-bold mb-2">
            🚀 Unified createTrigger API
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-green-900 p-3 rounded">
              <h4 className="font-bold text-green-300">Batch Trigger</h4>
              <code className="text-xs text-green-200 block mt-1">
                builtInTrigger.increment()
              </code>
              <p className="text-xs mt-1">Organized, type-safe, convenient</p>
            </div>
            <div className="bg-teal-900 p-3 rounded">
              <h4 className="font-bold text-teal-300">Direct Signal</h4>
              <code className="text-xs text-teal-200 block mt-1">
                directIncrement() // throttled
              </code>
              <p className="text-xs mt-1">Simple, powerful, optimized</p>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-300">
            🎯 <strong>ONE FUNCTION</strong> - Three patterns with{" "}
            <code>createTrigger()</code>
            <br />✅ Direct: <code>createTrigger(signal, action, options)</code>
            <br />✅ Tuple: <code>createTrigger([state, 'key'], action)</code>
            <br />✅ Batch: <code>createTrigger(state, definition)</code>
          </div>
        </div>

        {/* ✅ COMPREHENSIVE UNIFIED TRIGGER TEST */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 p-6 rounded-lg text-center max-w-4xl">
          <h2 className="text-emerald-300 text-2xl mb-4">🚀 Unified Trigger System Demo</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Built-in Trigger Props */}
            <div className="bg-emerald-800 p-4 rounded">
              <h3 className="text-emerald-200 font-bold mb-2">Built-in Props</h3>
              <div 
                className="p-2 rounded mb-2 transition-all duration-300"
                style:background-color={testSignals.backgroundColor}
                style:transform={$(() => `scale(${1 + counterState.count.get() * 0.01})`)}
                class:animate-bounce={$(() => counterState.count.get() % 10 === 0)}
              >
                Count: {$(() => counterState.count.get())}
              </div>
              <div className="text-xs text-emerald-300">
                ✅ style: props<br/>
                ✅ class: props<br/>
                ✅ Dynamic reactivity
              </div>
            </div>
            
            {/* Standard Event Triggers */}
            <div className="bg-teal-800 p-4 rounded">
              <h3 className="text-teal-200 font-bold mb-2">Standard Events</h3>
              <button
                className="bg-teal-600 px-3 py-1 rounded mb-1 text-white w-full"
                on:click={() => {
                  console.log('✅ Standard on:click working!');
                  builtInTrigger.increment();
                }}
              >
                on:click
              </button>
              <input
                className="bg-teal-700 px-2 py-1 rounded text-white w-full text-sm"
                placeholder="on:input test"
                on:input={(e: any) => {
                  console.log('✅ Standard on:input working!', e.target.value);
                }}
              />
              <div className="text-xs text-teal-300 mt-1">
                ✅ on:click events<br/>
                ✅ on:input events<br/>
                ✅ DOM integration
              </div>
            </div>
            
            {/* Extensible Registry */}
            <div className="bg-cyan-800 p-4 rounded">
              <h3 className="text-cyan-200 font-bold mb-2">Extensible Registry</h3>
              <div className="bg-cyan-700 px-3 py-2 rounded mb-2 text-white text-sm">
                <code>registerTriggerHandler()</code>
              </div>
              <div className="text-xs text-cyan-300">
                ✅ Custom trigger registration<br/>
                ✅ Platform-specific handlers<br/>
                ✅ Automatic fallbacks<br/>
                ✅ See JSDoc for examples
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
              {$(() => enhancedExplicitState.advancedCount.get())}
            </div>
            <div className="text-sm text-purple-300">
              {$(() => enhancedExplicitState.status.get())}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Traditional trigger */}
            <button
              type="button"
              className="bg-purple-600 px-2 py-2 rounded text-white hover:bg-purple-700"
              on:click={() => enhancedExplicitState.trigger.increment(1)}
            >
              +1 Traditional
            </button>

            {/* Cross-state sync */}
            <button
              type="button"
              className="bg-indigo-600 px-2 py-2 rounded text-white hover:bg-indigo-700"
              on:click={() =>
                enhancedExplicitState.trigger.syncWithOtherStates()
              }
            >
              🌐 Sync States
            </button>

            {/* External state targeting */}
            <button
              type="button"
              className="bg-pink-600 px-2 py-2 rounded text-white hover:bg-pink-700"
              on:click={() =>
                enhancedExplicitState.trigger.incrementExternalState()
              }
            >
              📍 +10 External
            </button>

            {/* Update status */}
            <button
              type="button"
              className="bg-cyan-600 px-2 py-2 rounded text-white hover:bg-cyan-700"
              on:click={() =>
                enhancedExplicitState.trigger.updateStatus("Testing!")
              }
            >
              💬 Update Status
            </button>

            {/* Dynamic trigger test */}
            <button
              type="button"
              className="bg-yellow-600 px-2 py-2 rounded text-white hover:bg-yellow-700 col-span-2"
              on:click={() => {
                enhancedExplicitState.addTrigger?.("testTrigger", {
                  key: "advancedCount",
                  action: (current: number) => current + 50,
                  options: { name: "test-runtime-trigger" },
                });
                // Use the newly added trigger
                (enhancedExplicitState.trigger as any).testTrigger?.();
              }}
            >
              🔥 Add & Use Dynamic Trigger (+50)
            </button>
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
    </>
  );
}
