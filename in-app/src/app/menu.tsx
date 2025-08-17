import { Link } from "@inspatial/kit/navigation";
import { $ } from "@inspatial/kit/state";
import { XStack } from "@inspatial/kit/structure";
import { Text } from "@inspatial/kit/typography";
import { Button, Notch } from "@inspatial/kit/ornament";
import { FPS } from "./fps.tsx";
import { route } from "./routes.tsx";
import {
  InSpatialIcon,
  LightModeIcon,
  DarkModeIcon,
} from "@inspatial/kit/icon";
import { useTheme } from "./(extensions)/in-theme/state.ts";
// @ts-types="@inspatial/kit"
import { Show } from "@inspatial/kit";

export function AppMenu() {
  return (
    <>
      <Notch className="w-full top-0 z-10" direction="down">
        <XStack className="justify-center items-center space-x-10 w-full top-0 z-50">
          <Link to="https://www.inspatial.dev/kit" className="min-w-[48px]">
            Kit
          </Link>
          <Link to="https://www.inspatial.cloud" className="min-w-[48px]">
            Cloud
          </Link>

          <InSpatialIcon
            on:tap={() => route.to("/")}
            format="regular"
            className="cursor-pointer"
          />

          <Link
            to="/"
            className={`rounded-full py-[4px] px-[14px] min-w-[48px] ${
              route.get().startsWith("/") && "bg-(--brand)/20 text-(--brand)"
            }`}
          >
            App
          </Link>
          <Link to="https://www.inspatial.store" className="min-w-[48px]">
            Store
          </Link>
        </XStack>
      </Notch>
      <FPS />
      <div className="fixed top-4 right-4 flex items-center gap-2 z-50">
        <Button
          format="outlineSurface"
          iconOnly={true}
          on:tap={() => useTheme.action.setToggle()}
        >
          <Show
            when={$(() => String(useTheme.mode) === "dark")}
            otherwise={<DarkModeIcon />}
          >
            <LightModeIcon />
          </Show>
        </Button>
      </div>
    </>
  );
}
