import type {
  InComputeInput,
  InComputeResult,
  InDirection,
  InAlign,
} from "./type.ts";

/*#######################(Clamp)#######################*/
export function clamp(n: number, min: number, max: number): number {
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(n, max));
}

/*#######################(Base Coords)#######################*/
export function baseCoords(inp: InComputeInput): { x: number; y: number } {
  const { anchorRect: r, direction, align } = inp;
  let x = r.left;
  let y = r.top;
  if (direction === "bottom") y = r.top + r.height;
  if (direction === "top") y = r.top;
  if (direction === "right") x = r.left + r.width;
  if (direction === "left") x = r.left;

  if (direction === "top" || direction === "bottom") {
    if (align === "center") x = r.left + r.width / 2;
    if (align === "end") x = r.left + r.width;
  } else {
    if (align === "center") y = r.top + r.height / 2;
    if (align === "end") y = r.top + r.height;
  }
  return { x, y };
}

/*#######################(Flip Pass)#######################*/
export function flipPass(
  inp: InComputeInput,
  coords: { x: number; y: number }
): { direction: InDirection; x: number; y: number } {
  const { boundaryRect: b, floatingSize: f, anchorRect: r, direction } = inp;
  let dir = direction;
  let { x, y } = coords;

  const overBottom = y + f.height > b.bottom;
  const overTop = y - f.height < b.top;
  const overRight = x + f.width > b.right;
  const overLeft = x - f.width < b.left;

  if (dir === "bottom" && overBottom && !overTop) {
    dir = "top";
    y = r.top;
  } else if (dir === "top" && overTop && !overBottom) {
    dir = "bottom";
    y = r.top + r.height;
  } else if (dir === "right" && overRight && !overLeft) {
    dir = "left";
    x = r.left;
  } else if (dir === "left" && overLeft && !overRight) {
    dir = "right";
    x = r.left + r.width;
  }

  return { direction: dir, x, y };
}

/*#######################(Shift Pass)#######################*/
export function shiftPass(
  inp: InComputeInput,
  coords: { x: number; y: number },
  placement: { direction: InDirection; align: InAlign }
): { x: number; y: number } {
  const { boundaryRect: b, floatingSize: f } = inp;
  let { x, y } = coords;

  if (placement.direction === "top" || placement.direction === "bottom") {
    // horizontal clamp
    const cross =
      x -
      (placement.align === "center"
        ? f.width / 2
        : placement.align === "end"
        ? f.width
        : 0);
    const minL = b.left;
    const maxL = b.right - f.width;
    x =
      clamp(cross, minL, maxL) +
      (placement.align === "center"
        ? f.width / 2
        : placement.align === "end"
        ? f.width
        : 0);
  } else {
    // vertical clamp
    const cross =
      y -
      (placement.align === "center"
        ? f.height / 2
        : placement.align === "end"
        ? f.height
        : 0);
    const minT = b.top;
    const maxT = b.bottom - f.height;
    y =
      clamp(cross, minT, maxT) +
      (placement.align === "center"
        ? f.height / 2
        : placement.align === "end"
        ? f.height
        : 0);
  }
  return { x, y };
}

/*#######################(Score Overflow)#######################*/
export function scoreOverflow(
  inp: InComputeInput,
  dir: InDirection,
  align: InAlign
): number {
  const { anchorRect: r, floatingSize: f, boundaryRect: b } = inp;
  // compute base
  let x = r.left;
  let y = r.top;
  if (dir === "bottom") y = r.top + r.height;
  if (dir === "top") y = r.top;
  if (dir === "right") x = r.left + r.width;
  if (dir === "left") x = r.left;
  if (dir === "top" || dir === "bottom") {
    if (align === "center") x = r.left + r.width / 2;
    if (align === "end") x = r.left + r.width;
  } else {
    if (align === "center") y = r.top + r.height / 2;
    if (align === "end") y = r.top + r.height;
  }
  // measure overflow area sum (positive pixels outside boundary)
  const right =
    dir === "top" || dir === "bottom"
      ? x + (align === "center" ? f.width / 2 : align === "end" ? f.width : 0)
      : x + f.width;
  const left =
    dir === "top" || dir === "bottom"
      ? x - (align === "center" ? f.width / 2 : align === "end" ? f.width : 0)
      : x;
  const bottom =
    dir === "left" || dir === "right"
      ? y + (align === "center" ? f.height / 2 : align === "end" ? f.height : 0)
      : y + f.height;
  const top =
    dir === "left" || dir === "right"
      ? y - (align === "center" ? f.height / 2 : align === "end" ? f.height : 0)
      : y;

  const overX = Math.max(0, b.left - left) + Math.max(0, right - b.right);
  const overY = Math.max(0, b.top - top) + Math.max(0, bottom - b.bottom);
  return overX + overY;
}

/*#######################(Auto Placement Pass)#######################*/
export function autoPlacementPass(
  inp: InComputeInput,
  current: { direction: InDirection; align: InAlign }
): { direction: InDirection; align: InAlign } {
  const dirs: InDirection[] = ["bottom", "top", "right", "left"];
  // prioritize keeping current align; if poor, try center
  const aligns: InAlign[] = [current.align, "center", "start", "end"];
  let best = { direction: current.direction, align: current.align };
  let bestScore = Number.POSITIVE_INFINITY;
  for (const d of dirs) {
    for (const a of aligns) {
      const s = scoreOverflow(inp, d, a);
      if (s < bestScore) {
        bestScore = s;
        best = { direction: d, align: a };
      }
      if (bestScore === 0) return best;
    }
  }
  return best;
}

/*#######################(Size Pass)#######################*/
export function sizePass(inp: InComputeInput): {
  availableWidth: number;
  availableHeight: number;
} {
  const { boundaryRect: b } = inp;
  return {
    availableWidth: Math.max(0, b.width),
    availableHeight: Math.max(0, b.height),
  };
}

/*#######################(Arrow Pass)#######################*/
export function arrowPass(
  inp: InComputeInput,
  placement: { direction: InDirection; align: InAlign }
): { axis: "x" | "y"; offset: number } {
  const { anchorRect: r, floatingSize: f } = inp;
  if (placement.direction === "top" || placement.direction === "bottom") {
    // horizontal axis
    const base =
      placement.align === "center"
        ? 0
        : placement.align === "end"
        ? f.width / 2
        : -(f.width / 2);
    return { axis: "x", offset: base };
  } else {
    // vertical axis
    const base =
      placement.align === "center"
        ? 0
        : placement.align === "end"
        ? f.height / 2
        : -(f.height / 2);
    return { axis: "y", offset: base };
  }
}
