import { Link } from "@inspatial/kit/navigation";
import { useTheme } from "./(extensions)/in-theme/index.ts";
import { $ } from "@inspatial/kit/state";
import {Stack, XStack, YStack } from "@inspatial/kit/structure";

export function AppMenu() {
  return (
    <>
      <YStack className="p-10 bg-yellow-300">
        <Link className="bg-green-300" to="/">Kit</Link>
        <Link to="/counter">Cloud</Link>
        <Link to="/projects">App</Link>
        <Link to="/route-test">Store</Link>
      </YStack>
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
          on:tap={() => useTheme.action.setToggle()}
        >
          {$(() =>
            String(useTheme.mode) === "dark"
              ? "Switch to Light"
              : "Switch to Dark"
          )}
        </button>
      </div>
    </>
  );
}
