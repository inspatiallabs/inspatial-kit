import { Counter } from "@inspatial/app/(application)/(window)/counter.tsx";
import { themeState } from "./theme/state.ts";
import { $ } from "@inspatial/state";

export function App() {
  return (
    <>
      <div className="fixed top-4 right-4 flex items-center gap-2 z-50">
        <button
          type="button"
          className="px-3 py-1 rounded bg-gray-800 text-white text-sm hover:bg-gray-700"
          on:click={() => themeState.trigger.toggle()}
        >
          {$(() =>
            themeState.mode.get() === "dark"
              ? "Switch to Light"
              : "Switch to Dark"
          )}
        </button>
      </div>
      <Counter />
    </>
  );
}
