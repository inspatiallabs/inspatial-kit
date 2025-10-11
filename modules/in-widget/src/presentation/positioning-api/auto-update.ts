import { createSignal, watch } from "@in/teract/signal";

/*#######################(Auto Update)#######################*/
export function autoUpdate(opts: {
  anchor: any;
  floating: any;
  onUpdate: () => void;
}): () => void {
  const { anchor, onUpdate } = opts;
  const getFloating = () =>
    typeof opts.floating === "function" ? opts.floating() : opts.floating;

  // Measurement signal used to trigger updates
  const measure = createSignal(0);

  // Observe size changes on both anchor and floating
  const ro = (
    typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => {
          measure.value = measure.peek() + 1;
        })
      : null
  ) as any;

  try {
    if (anchor) ro?.observe?.(anchor as any);
  } catch {}
  try {
    const f = getFloating();
    if (f) ro?.observe?.(f as any);
  } catch {}

  // Watcher: run update whenever measurement changes
  const dispose = watch(() => {
    // create dependency
    measure.value;
    try {
      onUpdate();
    } catch {}
  });

  // Initial run
  try {
    onUpdate();
  } catch {}

  return () => {
    try {
      ro?.disconnect?.();
    } catch {}
    try {
      dispose?.();
    } catch {}
  };
}
