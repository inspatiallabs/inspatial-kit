import { Link } from "@inspatial/kit/navigation";
import { XStack, Slot } from "@inspatial/kit/structure";
import { Notch } from "@inspatial/kit/ornament";
import { FPS } from "./fps.tsx";
import { route } from "./routes.tsx";
import { InSpatialIcon } from "@inspatial/kit/icon";
import { ThemeController } from "@inspatial/kit/theme";

export function AppMenu() {
  return (
    <>
      <Slot
        style={{
          position: "fixed",
          width: "100%",
          border: "2px solid var(--brand)",
          borderTopColor: "var(--brand)",
          pointerEvents: "none",
          zIndex: 1000,
        }}
      />
      <Notch className="pointer-events-none absolute w-full top-0 z-50 max-h-[56px] m-auto pr-8" />

      <XStack className="pointer-events-auto absolute inset-x-0 top-0 h-[56px] z-[51] flex justify-center items-center space-x-10">
        {/* <Link to="https://www.inspatial.dev/kit" className="min-w-[48px]">
          Kit
        </Link>
        <Link to="https://www.inspatial.cloud" className="min-w-[48px]">
          Cloud
        </Link> */}

        <InSpatialIcon
          on:tap={() => route.to("/")}
          format="regular"
          className="cursor-pointer"
        />

        {/* <Link
          to="/"
          className={`rounded-full py-[4px] px-[14px] min-w-[48px] ${
            route.get().startsWith("/") && "bg-(--brand)/20 text-(--brand)"
          }`}
        >
          App
        </Link>
        <Link to="https://www.inspatial.store" className="min-w-[48px]">
          Store
        </Link> */}
      </XStack>
      <FPS />
      <ThemeController className="absolute bottom-4 left-4 z-100" />
    </>
  );
}
