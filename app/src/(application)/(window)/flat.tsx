import { Counter } from "@inspatial/app/(application)/(window)/counter.tsx";
import { themeState } from "./theme/state.ts";
import { $ } from "@inspatial/state";

export function App() {
  return (
    <>
      <div className="fixed top-4 right-4 flex items-center gap-2 z-50">
        <button
          type="button"
          style={{
            web: {
              backgroundColor: "yellow",
              color: "black",
              fontSize: "16px",
              fontWeight: "900",
              padding: "10px",
            },
          }}
          on:tap={() => themeState.trigger.toggle()}
        >
          {$(() =>
            String(themeState.mode) === "dark"
              ? "Switch to Light"
              : "Switch to Dark"
          )}
        </button>
      </div>
      <Counter />
    </>
  );
}
