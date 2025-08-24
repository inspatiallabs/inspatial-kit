import { Slot } from "../../structure/slot/index.tsx";
import { $ } from "@in/teract/state";
import { iss } from "@in/style";
import { PresentationRegistry } from "../registry.ts";
import { DrawerStyle } from "../style.ts";
import { createSnapPoints } from "./snapoint.ts";
import type { DrawerProps } from "../type.ts";

export function Drawer(props: DrawerProps) {
  const {
    id,
    direction = "right",
    snapPoints,
    fadeFromIndex,
    snapToSequentialPoint,
    overlayFormat = "rgb",
    open,
    defaultOpen,
    closeOnEsc = true,
    closeOnScrim = true,
    className,
    children,
    ...rest
  } = props as any;

  const sig = PresentationRegistry.getSignal(id);

  if (open !== undefined) {
    if (typeof open === "boolean") sig.value = open;
    else if (open && typeof (open as any).get === "function")
      sig.value = !!(open as any).get();
  } else if (defaultOpen === true) {
    sig.value = true;
  }

  let overlayRef: any = null;
  let drawerRef: any = null;

  const DrawerPresentation = $(() => {
    const isOpen = sig.get();
    if (!isOpen) return null;

    const hasOverlay = overlayFormat !== "none";

    const snap = createSnapPoints({
      activeSnapPointProp: undefined,
      setActiveSnapPointProp: undefined,
      snapPoints,
      drawerRef: { current: drawerRef },
      overlayRef: { current: overlayRef },
      fadeFromIndex,
      onSnapPointChange: (_idx: number) => {},
      direction,
      container: null,
      snapToSequentialPoint,
    });

    return (
      <>
        {hasOverlay && (
          <Slot
            // overlay
            data-in-presentation-drawer-overlay
            data-state={isOpen ? "open" : "closed"}
            className={DrawerStyle.overlay.getStyle({ overlayFormat })}
            on:tap={() =>
              closeOnScrim && PresentationRegistry.setOpen(id, false)
            }
            $ref={(el: any) => (overlayRef = el)}
          />
        )}
        <Slot
          // wrapper container (non-moving)
          className={DrawerStyle.wrapper.getStyle()}
          on:escape={() => closeOnEsc && PresentationRegistry.setOpen(id, false)}
        >
          <Slot
            role="dialog"
            aria-modal
            data-in-presentation-drawer
            data-in-presentation-drawer-direction={direction}
            data-in-presentation-drawer-snap-points={
              snapPoints && snapPoints.length ? "true" : "false"
            }
            data-state={isOpen ? "open" : "closed"}
            className={iss(DrawerStyle.view.getStyle({ direction, className }))}
            $ref={(el: any) => (drawerRef = el)}
            on:mount={() => {
              // For snap points, let createSnapPoints handle positioning
              // For non-snap points, CSS animations will handle it
              if (snapPoints && snapPoints.length) {
                // Snap points handle their own positioning
                snap.snapToPoint(snap.snapPointsOffset[0]);
              }
              setTimeout(() => drawerRef?.focus?.(), 10);
            }}
            {...rest}
          >
            {children}
          </Slot>
        </Slot>
      </>
    );
  });

  return DrawerPresentation;
}
