import { $, createState } from "@in/teract/state";
import { Slot } from "@in/widget/structure/slot/index.tsx";
import { iss } from "@in/style/variant";
import type { FPSProps } from "./type.ts";
import { FPSStyle } from "./style.ts";

/*###################################(COMPONENT)###################################*/
export function FPS({
  className,
  format,
  radius,
  size,
  updateEvery = 10,
}: FPSProps) {
  /***********(State)***********/

  const ui = createState({ fps: 0 });

  /***********(Render)***********/
  return (
    <>
      <Slot
        on:frameChange={({
          delta,
          frame,
        }: {
          delta: number;
          frame: number;
        }) => {
          if (frame % updateEvery === 0) {
            const d = delta || 16;
            ui.fps.value = Math.max(1, Math.round(1000 / d));
          }
        }}
        className={iss(FPSStyle.getStyle({ className, format, radius, size }))}
      >
        {$(() => `${ui.fps} FPS`)}
      </Slot>
    </>
  );
}
