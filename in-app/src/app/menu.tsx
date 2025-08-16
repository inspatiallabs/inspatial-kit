import { Link } from "@inspatial/kit/navigation";
import { $, createState } from "@inspatial/kit/state";
import { XStack } from "@inspatial/kit/structure";
import { FPS } from "./fps.tsx";
import { route } from "./routes.tsx";

export function AppMenu() {
  return (
    <>
      <XStack className="justify-center items-center space-x-10 p-4 w-full">
        <Link
          to="/"
          className={`rounded-full py-[10px] px-[18px] ${
            route.get() === "/" && "bg-purple-500"
          }`}
        >
          Kit
        </Link>
        <Link to="/counter" className="rounded-full py-[10px] px-[18px]">
          Cloud
        </Link>
        <Link to="/projects" className="rounded-full py-[10px] px-[18px]">
          App
        </Link>
        <Link to="/route-test" className="rounded-full py-[10px] px-[18px]">
          Store
        </Link>
      </XStack>
      <FPS />
      {/* <div className="fixed top-4 right-4 flex items-center gap-2 z-50">
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
      </div> */}
    </>
  );
}
