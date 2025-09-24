import { iss } from "@in/style";
import { $ } from "@in/teract/state";
import { Show } from "../control-flow/show/index.ts";
import { DarkModeIcon } from "../icon/dark-mode-icon.tsx";
import { LightModeIcon } from "../icon/light-mode-icon.tsx";
import { Button } from "../ornament/index.ts";
import { useTheme } from "./state.ts";
import type { ThemeProps } from "./type.ts";

export function ThemeController({ className, ...rest }: ThemeProps) {
  return (
    <>
      <Button
        size="md"
        format="outlineSurface"
        material="tilted"
        iconOnly={true}
        on:tap={() => useTheme.action.setToggle()}
        className={
          (iss("fixed bottom-4 left-4 flex items-center gap-2 z-50"), className)
        }
        {...rest}
      >
        {/* @ts-ignore */}
        <Show
          when={$(() => String(useTheme.mode) === "dark")}
          otherwise={<DarkModeIcon scale="10xs" />}
        >
          <LightModeIcon scale="10xs" />
        </Show>
      </Button>
    </>
  );
}
