import type { InComputeInput, InComputeResult } from "./type.ts";
import {
  baseCoords,
  flipPass,
  shiftPass,
  autoPlacementPass,
} from "./passes.ts";

/*#######################(Compute Position)#######################*/
export function computePosition(inp: InComputeInput): InComputeResult {
  const opts = inp.options || {};
  let placement = { direction: inp.direction, align: inp.align };

  // Base coordinates (viewport space)
  let { x, y } = baseCoords(inp);

  // autoPlacement
  if (opts.autoPlacement) {
    placement = autoPlacementPass(inp, placement);
    ({ x, y } = baseCoords({
      ...inp,
      direction: placement.direction,
      align: placement.align,
    }));
  }

  // flip
  if (opts.flip !== false) {
    const flipped = flipPass(
      { ...inp, direction: placement.direction },
      { x, y }
    );
    placement.direction = flipped.direction;
    x = flipped.x;
    y = flipped.y;
  }

  // shift
  if (opts.shift !== false) {
    const shifted = shiftPass(inp, { x, y }, placement);
    x = shifted.x;
    y = shifted.y;
  }

  // Return viewport-relative coordinates (used with position: fixed)
  return { x, y, placement };
}
