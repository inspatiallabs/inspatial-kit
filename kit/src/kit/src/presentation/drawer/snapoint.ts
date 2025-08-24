import { setPresentationDrawer, isVerticalDrawer } from "./helper.ts";
import { INMOTION, VELOCITY } from "./constant.ts";
import { drawerControl } from "./control.ts";
import type { DrawerDirection } from "./type.ts";

export function createSnapPoints({
  activeSnapPointProp,
  setActiveSnapPointProp,
  snapPoints,
  drawerRef,
  overlayRef,
  fadeFromIndex,
  onSnapPointChange,
  direction = "right",
  container,
  snapToSequentialPoint,
}: {
  activeSnapPointProp?: number | string | null;
  setActiveSnapPointProp?(snapPoint: number | null | string): void;
  snapPoints?: (number | string)[];
  fadeFromIndex?: number;
  drawerRef: { current: any };
  overlayRef: { current: any };
  onSnapPointChange(activeSnapPointIndex: number): void;
  direction?: DrawerDirection;
  container?: HTMLElement | null | undefined;
  snapToSequentialPoint?: boolean;
}) {
  const [activeSnapPoint, setActiveSnapPoint] = drawerControl<
    string | number | null
  >({
    prop: activeSnapPointProp,
    defaultProp: snapPoints?.[0],
    onChange: setActiveSnapPointProp,
  });

  const isLastSnapPoint = (activeSnapPoint ===
    snapPoints?.[snapPoints.length - 1] || null) as any;

  const activeSnapPointIndex = (snapPoints?.findIndex(
    (snapPoint) => snapPoint === activeSnapPoint
  ) ?? null) as any;

  const shouldFade =
    (snapPoints &&
      snapPoints.length > 0 &&
      (fadeFromIndex || fadeFromIndex === 0) &&
      !Number.isNaN(fadeFromIndex) &&
      snapPoints[fadeFromIndex] === activeSnapPoint) ||
    !snapPoints;

  const snapPointsOffset = (() => {
    const containerSize = container
      ? {
          width: container.getBoundingClientRect().width,
          height: container.getBoundingClientRect().height,
        }
      : typeof globalThis !== "undefined"
      ? {
          width: (globalThis as any).innerWidth || 0,
          height: (globalThis as any).innerHeight || 0,
        }
      : { width: 0, height: 0 };

    return (
      snapPoints?.map((snapPoint) => {
        const isPx = typeof snapPoint === "string";
        let snapPointAsNumber = 0;

        if (isPx) {
          snapPointAsNumber = parseInt(snapPoint, 10);
        }

        if (isVerticalDrawer(direction)) {
          const height = isPx
            ? snapPointAsNumber
            : snapPoint * containerSize.height;

          if (containerSize.height) {
            return direction === "bottom"
              ? containerSize.height - height
              : -containerSize.height + height;
          }

          return height;
        }
        const width = isPx
          ? snapPointAsNumber
          : snapPoint * containerSize.width;

        if (containerSize.width) {
          return direction === "right"
            ? containerSize.width - width
            : -containerSize.width + width;
        }

        return width;
      }) ?? []
    );
  })();

  const activeSnapPointOffset = (
    activeSnapPointIndex !== null
      ? (snapPointsOffset as any)?.[activeSnapPointIndex as any]
      : null
  ) as any;

  function snapToPoint(dimension: number) {
    const newSnapPointIndex =
      snapPointsOffset?.findIndex(
        (snapPointDim) => snapPointDim === dimension
      ) ?? null;
    onSnapPointChange(newSnapPointIndex);

    setPresentationDrawer(drawerRef.current, {
      transition: `transform ${
        INMOTION.DURATION
      }s cubic-bezier(${INMOTION.EASE.join(",")})`,
      transform: isVerticalDrawer(direction)
        ? `translate3d(0, ${dimension}px, 0)`
        : `translate3d(${dimension}px, 0, 0)`,
    });

    if (
      snapPointsOffset &&
      newSnapPointIndex !== snapPointsOffset.length - 1 &&
      fadeFromIndex !== undefined &&
      newSnapPointIndex !== fadeFromIndex &&
      newSnapPointIndex < fadeFromIndex
    ) {
      setPresentationDrawer(overlayRef.current, {
        transition: `opacity ${
          INMOTION.DURATION
        }s cubic-bezier(${INMOTION.EASE.join(",")})`,
        opacity: "0",
      });
    } else {
      setPresentationDrawer(overlayRef.current, {
        transition: `opacity ${
          INMOTION.DURATION
        }s cubic-bezier(${INMOTION.EASE.join(",")})`,
        opacity: "1",
      });
    }

    setActiveSnapPoint(snapPoints?.[Math.max(newSnapPointIndex, 0)]);
  }

  if (activeSnapPoint || activeSnapPointProp) {
    const newIndex =
      snapPoints?.findIndex(
        (snapPoint) =>
          snapPoint === activeSnapPointProp || snapPoint === activeSnapPoint
      ) ?? -1;
    if (
      snapPointsOffset &&
      newIndex !== -1 &&
      typeof (snapPointsOffset as any)[newIndex] === "number"
    ) {
      snapToPoint((snapPointsOffset as any)[newIndex] as number);
    }
  }

  function onRelease({
    draggedDistance,
    closeDrawer,
    velocity,
    closeOnScrim,
  }: {
    draggedDistance: number;
    closeDrawer: () => void;
    velocity: number;
    closeOnScrim: boolean;
  }) {
    if (fadeFromIndex === undefined) return;

    const currentPosition =
      direction === "bottom" || direction === "right"
        ? (activeSnapPointOffset ?? 0) - draggedDistance
        : (activeSnapPointOffset ?? 0) + draggedDistance;
    const isOverlaySnapPoint = activeSnapPointIndex === fadeFromIndex - 1;
    const isFirst = activeSnapPointIndex === 0;
    const hasDraggedUp = draggedDistance > 0;

    if (isOverlaySnapPoint) {
      setPresentationDrawer(overlayRef.current, {
        transition: `opacity ${
          INMOTION.DURATION
        }s cubic-bezier(${INMOTION.EASE.join(",")})`,
      });
    }

    if (!snapToSequentialPoint && velocity > 2 && !hasDraggedUp) {
      if (closeOnScrim) closeDrawer();
      else snapToPoint(snapPointsOffset[0]); // snap to initial point
      return;
    }

    if (
      !snapToSequentialPoint &&
      velocity > 2 &&
      hasDraggedUp &&
      snapPointsOffset &&
      snapPoints
    ) {
      snapToPoint(snapPointsOffset[snapPoints.length - 1] as number);
      return;
    }

    // Find the closest snap point to the current position
    const closestSnapPoint = snapPointsOffset?.reduce((prev, curr) => {
      if (typeof prev !== "number" || typeof curr !== "number") return prev;

      return Math.abs(curr - currentPosition) < Math.abs(prev - currentPosition)
        ? curr
        : prev;
    });

    const dim = isVerticalDrawer(direction)
      ? globalThis.innerHeight
      : globalThis.innerWidth;
    if (velocity > VELOCITY && Math.abs(draggedDistance) < dim * 0.4) {
      const dragDirection = hasDraggedUp ? 1 : -1; // 1 = up, -1 = down

      // Don't do anything if we swipe upwards while being on the last snap point
      if (dragDirection > 0 && isLastSnapPoint && snapPoints) {
        snapToPoint(snapPointsOffset[snapPoints.length - 1]);
        return;
      }

      if (isFirst && dragDirection < 0 && closeOnScrim) {
        closeDrawer();
      }

      if (activeSnapPointIndex === null) return;

      snapToPoint(snapPointsOffset[activeSnapPointIndex + dragDirection]);
      return;
    }

    snapToPoint(closestSnapPoint);
  }

  function onDrag({ draggedDistance }: { draggedDistance: number }) {
    if (activeSnapPointOffset === null) return;
    const newValue =
      direction === "bottom" || direction === "right"
        ? activeSnapPointOffset - draggedDistance
        : activeSnapPointOffset + draggedDistance;

    // Don't do anything if we exceed the last(biggest) snap point
    if (
      (direction === "bottom" || direction === "right") &&
      newValue < snapPointsOffset[snapPointsOffset.length - 1]
    ) {
      return;
    }
    if (
      (direction === "top" || direction === "left") &&
      newValue > snapPointsOffset[snapPointsOffset.length - 1]
    ) {
      return;
    }

    setPresentationDrawer(drawerRef.current, {
      transform: isVerticalDrawer(direction)
        ? `translate3d(0, ${newValue}px, 0)`
        : `translate3d(${newValue}px, 0, 0)`,
    });
  }

  function getPercentageDragged(
    absDraggedDistance: number,
    isDraggingDown: boolean
  ) {
    if (
      !snapPoints ||
      typeof activeSnapPointIndex !== "number" ||
      !snapPointsOffset ||
      fadeFromIndex === undefined
    )
      return null;

    // If this is true we are dragging to a snap point that is supposed to have an overlay
    const isOverlaySnapPoint = activeSnapPointIndex === fadeFromIndex - 1;
    const isOverlaySnapPointOrHigher = activeSnapPointIndex >= fadeFromIndex;

    if (isOverlaySnapPointOrHigher && isDraggingDown) {
      return 0;
    }

    // Don't animate, but still use this one if we are dragging away from the overlaySnapPoint
    if (isOverlaySnapPoint && !isDraggingDown) return 1;
    if (!shouldFade && !isOverlaySnapPoint) return null;

    // Either fadeFrom index or the one before
    const targetSnapPointIndex = isOverlaySnapPoint
      ? activeSnapPointIndex + 1
      : activeSnapPointIndex - 1;

    // Get the distance from overlaySnapPoint to the one before or vice-versa to calculate the opacity percentage accordingly
    const snapPointDistance = isOverlaySnapPoint
      ? snapPointsOffset[targetSnapPointIndex] -
        snapPointsOffset[targetSnapPointIndex - 1]
      : snapPointsOffset[targetSnapPointIndex + 1] -
        snapPointsOffset[targetSnapPointIndex];

    const percentageDragged = absDraggedDistance / Math.abs(snapPointDistance);

    if (isOverlaySnapPoint) {
      return 1 - percentageDragged;
    } else {
      return percentageDragged;
    }
  }

  return {
    isLastSnapPoint,
    activeSnapPoint,
    shouldFade,
    getPercentageDragged,
    setActiveSnapPoint,
    activeSnapPointIndex,
    onRelease,
    onDrag,
    snapPointsOffset,
    snapToPoint,
  };
}
