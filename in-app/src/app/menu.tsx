import { Link } from "@inspatial/kit/navigation";
import { $ } from "@inspatial/kit/state";
import { XStack } from "@inspatial/kit/structure";
import { Text } from "@inspatial/kit/typography";
import { FPS } from "./fps.tsx";
import { route } from "./routes.tsx";
import { InSpatialIcon } from "@inspatial/kit/icon";

export function AppMenu() {
  return (
    <>
      <XStack className="justify-center items-center space-x-10 p-4 w-full">
        <Link
          to="https://www.inspatial.dev/kit"
          className="rounded-full py-[10px] px-[18px]"
        >
          Kit
        </Link>
        <Link
          to="https://www.inspatial.cloud"
          className="rounded-full py-[10px] px-[18px]"
        >
          Cloud
        </Link>

        <InSpatialIcon
          on:tap={() => route.navigate("/")}
          format="regular"
          size="sm"
          className="cursor-pointer"
        />

        <Link
          to="/"
          className={`rounded-full py-[10px] px-[18px] ${
            route.get().startsWith("/") && "bg-purple-500/20 text-purple-500"
          }`}
        >
          App
        </Link>
        <Link
          to="https://www.inspatial.store"
          className="rounded-full py-[10px] px-[18px]"
        >
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
