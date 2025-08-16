import { $, createState } from "@inspatial/kit/state";

interface FPSProps {
  className?: string;
  sample?: number; // update every N frames (default: 10)
}

export function FPS({ className, sample = 10 }: FPSProps) {
  const ui = createState({ fps: 0 });

  return (
    <div
      on:frameChange={({ delta, frame }: { delta: number; frame: number }) => {
        if (frame % sample === 0) {
          const d = delta || 16;
          ui.fps.value = Math.max(1, Math.round(1000 / d));
        }
      }}
      className={
        className ||
        "fixed top-2 right-3 z-50 rounded px-2 py-1 text-xs bg-black/60 text-green-400"
      }
    >
      {$(() => `${ui.fps} FPS`)}
    </div>
  );
}
