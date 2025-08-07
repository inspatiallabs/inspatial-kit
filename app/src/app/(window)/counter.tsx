// deno-lint-ignore-file
import { $ } from "@inspatial/state";
import { Show, List } from "@inspatial/run/kit";
import {
  counterState,
  counterStateExplicit,
  builtInTrigger,
  directIncrement,
  tupleDouble,
  batchOperations,
  type Entry,
} from "./state.ts";

export function Counter() {
  /*******************************(Render)*************************************/

  return (
    <>
      <div className="flex flex-col h-screen justify-center items-center gap-10 bg-black">
        <h1 className="text-yellow-500 text-8xl">🚀 InSpatial!</h1>
        <div className="max-w-2xl">
          <List each={counterState.entries} track="id">
            {(entry: Entry) => (
              <p className="flex flex-col text-xl text-white mb-2 bg-gray-800 p-3 rounded">
                {entry.name}
              </p>
            )}
          </List>
        </div>
        {/* Current Count Display */}
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <h2 className="text-white text-2xl mb-2">Current </h2>
          <div className="text-6xl font-bold text-yellow-400">
            {$(() => counterState.count.get())}
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
      </div>
    </>
  );
}
