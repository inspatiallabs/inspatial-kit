import { $, createState } from "@inspatial/kit/state";
import { Slot } from "@inspatial/kit";
import { iss } from "@inspatial/kit/style";

/*###################################(PROPS)###################################*/
interface FPSProps {
  className?: string;
  sample?: number; // update every N frames (default: 10)
}

/*###################################(COMPONENT)###################################*/
export function FPS({ className, sample = 10 }: FPSProps) {
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
          if (frame % sample === 0) {
            const d = delta || 16;
            ui.fps.value = Math.max(1, Math.round(1000 / d));
          }
        }}
        className={iss(
          "fixed max-h-[24px] bottom-2 right-2 z-50 rounded-sm px-2 py-1 text-xs bg-(--surface) text-(--primary)",
          className
        )}
      >
        {$(() => `${ui.fps} FPS`)}
      </Slot>
    </>
  );
}
