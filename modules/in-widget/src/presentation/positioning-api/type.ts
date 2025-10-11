/*#######################(InDirection)#######################*/
export type InDirection = "top" | "bottom" | "left" | "right";

/*#######################(InAlign)#######################*/
export type InAlign = "start" | "center" | "end";

/*#######################(InBoundary)#######################*/
export type InBoundary = "scrollRoot" | "viewport" | Element;

/*#######################(InPositioning Options)#######################*/
export type InPositioningOptions = {
  autoPlacement?: boolean;
  flip?: boolean;
  shift?: boolean;
  collisionPadding?: number;
  boundary?: InBoundary;
};

/*#######################(InCompute Input)#######################*/
export type InComputeInput = {
  anchorRect: { top: number; left: number; width: number; height: number };
  floatingSize: { width: number; height: number };
  direction: InDirection;
  align: InAlign;
  rtl?: boolean;
  boundaryRect: {
    top: number;
    left: number;
    width: number;
    height: number;
    right: number;
    bottom: number;
  };
  options?: InPositioningOptions;
};

/*#######################(InCompute Result)#######################*/
export type InComputeResult = {
  x: number; // boundary-relative left
  y: number; // boundary-relative top
  placement: { direction: InDirection; align: InAlign };
};
