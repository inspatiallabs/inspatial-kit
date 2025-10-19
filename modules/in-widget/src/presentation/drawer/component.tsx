import { Slot } from "@in/widget/structure/slot/index.ts";
import { $ } from "@in/teract/state";
import { iss } from "@in/style";
import { PresentationRegistry } from "../registry.ts";
import { DrawerStyle } from "./style.ts";
import type { DrawerProps } from "./type.ts";
import { Controller } from "@in/widget/control-flow/controller/index.ts";
import { isSignal } from "@in/teract/signal";

export function Drawer(props: DrawerProps) {
  const {
    id,
    as,
    direction,
    backdrop = "rgb",
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

    const hasOverlay = backdrop !== "none";

    return (
      <>
        {hasOverlay && (
          <Slot
            // overlay
            data-in-presentation-overlay
            data-state={isOpen ? "open" : "closed"}
            className={DrawerStyle.overlay.getStyle({ backdrop })}
            on:tap={() =>
              closeOnScrim && PresentationRegistry.setOpen(id, false)
            }
            $ref={(el: any) => (overlayRef = el)}
          />
        )}
        <Slot
          // wrapper container (non-moving)
          className={DrawerStyle.wrapper.getStyle()}
          on:escape={() =>
            closeOnEsc && PresentationRegistry.setOpen(id, false)
          }
        >
          <Slot
            role="dialog"
            aria-modal
            data-in-presentation
            data-in-presentation-direction={direction}
            data-in-presentation-snap-points="false"
            data-state={isOpen ? "open" : "closed"}
            className={iss(DrawerStyle.view.getStyle({ direction, className }))}
            $ref={(el: any) => (drawerRef = el)}
            on:mount={() => {
              setTimeout(() => drawerRef?.focus?.(), 10);
            }}
            {...rest}
          >
            {children ?? Controller(isSignal(as) ? (as as any).get() : as)}
          </Slot>
        </Slot>
      </>
    );
  });

  return DrawerPresentation;
}
