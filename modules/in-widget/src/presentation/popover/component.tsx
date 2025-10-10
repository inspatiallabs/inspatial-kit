import { Slot } from "@in/widget/structure/slot/component.tsx";
import { $ } from "@in/teract/state";
import { createSignal, onDispose } from "@in/teract/signal";
import { iss } from "@in/style";
import { ensureArray } from "@in/vader";
import { PresentationRegistry } from "../registry.ts";
import { PopoverStyle } from "./style.ts";
import type {
  PopoverOverlayProps,
  PopoverWrapperProps,
  PopoverViewProps,
  PopoverProps,
} from "./type.ts";

/*##################################(POPOVER OVERLAY)##################################*/
export function PopoverOverlay(props: PopoverOverlayProps) {
  const { className, class: classProp, backdrop, ...rest } = props;

  return (
    <>
      <Slot
        className={PopoverStyle.overlay.getStyle({
          class: classProp,
          className,
          backdrop,
          ...rest,
        })}
        {...rest}
      />
    </>
  );
}

/*##################################(POPOVER WRAPPER)##################################*/

export function PopoverWrapper(props: PopoverWrapperProps) {
  const { className, class: classProp, ...rest } = props;
  return (
    <>
      <Slot
        // @ts-ignore
        className={PopoverStyle.wrapper.getStyle({
          class: classProp,
          className,
          ...rest,
        })}
        {...rest}
      />
    </>
  );
}

/*##################################(POPOVER VIEW)##################################*/
export function PopoverView(props: PopoverViewProps) {
  const {
    className,
    class: classProp,
    children,
    // format
    size,
    offset,
    radius,
    direction,
    align = "center",
    arrow = false,
    ...rest
  } = props;
  return (
    <Slot
      role="popover"
      aria-modal
      // @ts-ignore
      className={PopoverStyle.view.getStyle({
        class: classProp,
        className,
        direction,
        size,
        radius,
        offset,
        ...rest,
      })}
      data-align={align}
      data-arrow={arrow ? "true" : "false"}
      tabIndex={0}
      {...rest}
    >
      {children}
    </Slot>
  );
}

/*##################################(POPOVER)##################################*/
export function Popover(props: PopoverProps) {
  const {
    id,
    backdrop = "none",
    open,
    defaultOpen,
    closeOnEsc = true,
    closeOnScrim = true,
    className,
    children,
    direction,
    size,
    radius,
    offset,
    align = "start",
    ...rest
  } = props as any;

  const sig = PresentationRegistry.getSignal(id);
  const position = createSignal<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  if (open !== undefined) {
    if (typeof open === "boolean") sig.value = open;
    else if (open && typeof (open as any).get === "function")
      sig.value = !!(open as any).get();
  } else if (defaultOpen === true) {
    sig.value = true;
  }

  const PopoverPresentation = $(() => {
    const isOpen = sig.get();
    if (!isOpen) return null;

    const anchor = PresentationRegistry.getAnchor(id);

    // Continuously track anchor position while open (scroll/resize safe)
    let raf: any = 0;
    const updatePosition = () => {
      const viewportW = (globalThis as any)?.innerWidth ?? 0;
      const viewportH = (globalThis as any)?.innerHeight ?? 0;

      let rect = { top: 0, left: 0, width: 0, height: 0 } as any;
      if (anchor?.node && (anchor.node as any).getBoundingClientRect) {
        const r = (anchor.node as any).getBoundingClientRect();
        rect = { top: r.top, left: r.left, width: r.width, height: r.height };
      } else if (anchor?.point) {
        const { x, y } = anchor.point;
        rect = { top: y, left: x, width: 1, height: 1 };
      }

      const clamp = (n: number, min: number, max: number): number =>
        Number.isNaN(n) ? min : Math.max(min, Math.min(n, max));

      let top = rect.top;
      let left = rect.left;
      // Base placement by direction (no JS gap; spacing via style offset)
      if (direction === "bottom") top = rect.top + rect.height;
      if (direction === "top") top = rect.top;
      if (direction === "right") left = rect.left + rect.width;
      if (direction === "left") left = rect.left;

      // Align along cross-axis
      if (direction === "top" || direction === "bottom") {
        if (align === "center") left = rect.left + rect.width / 2;
        if (align === "end") left = rect.left + rect.width;
      } else {
        if (align === "center") top = rect.top + rect.height / 2;
        if (align === "end") top = rect.top + rect.height;
      }

      position.value = {
        left: clamp(left, 0, Math.max(viewportW - 1, 0)),
        top: clamp(top, 0, Math.max(viewportH - 1, 0)),
      };

      raf = (globalThis as any)?.requestAnimationFrame?.(updatePosition) || 0;
    };
    updatePosition();
    onDispose(() => {
      if (raf && (globalThis as any)?.cancelAnimationFrame) {
        (globalThis as any).cancelAnimationFrame(raf);
      }
    });

    const viewStyle: any = { web: {} };
    const pos = position.get();
    viewStyle.web.top = `${pos.top}px`;
    viewStyle.web.left = `${pos.left}px`;

    const hasOverlay = backdrop !== "none";

    // Normalize children shape
    let tree: any = {};
    let viewNode: any = null;
    if (
      children &&
      typeof children === "object" &&
      !Array.isArray(children) &&
      ("wrapper" in children || "overlay" in children || "view" in children)
    ) {
      const viewArr = ensureArray(children.view).filter(Boolean);
      tree = {
        wrapper: children.wrapper || {},
        overlay: {
          display: true,
          backdrop: backdrop,
          ...(children.overlay || {}),
        },
        view: viewArr.length ? viewArr : undefined,
      };
      viewNode = (viewArr.length ? null : children.view) ?? rest.children;
    } else {
      tree = {
        direction,
        size,
        radius,
        wrapper: {},
        overlay: { display: false, backdrop: backdrop },
        view: undefined,
        ...rest,
      };
      viewNode = children;
    }

    return (
      <>
        {hasOverlay && (
          <Slot
            data-state={isOpen ? "open" : "closed"}
            className={PopoverStyle.overlay.getStyle({ backdrop })}
            on:tap={() =>
              closeOnScrim && PresentationRegistry.setOpen(id, false)
            }
          />
        )}
        <Slot
          className={PopoverStyle.wrapper.getStyle()}
          on:escape={() =>
            closeOnEsc && PresentationRegistry.setOpen(id, false)
          }
        >
          {ensureArray(tree.view).length ? (
            ensureArray(tree.view).map((ct: any, idx: number) => (
              <PopoverView
                key={`view-${idx}`}
                className={iss(ct?.className, className)}
                direction={ct?.direction ?? direction}
                data-state={isOpen ? "open" : "closed"}
                style={{ web: viewStyle.web }}
                {...ct}
              >
                {ct?.children}
              </PopoverView>
            ))
          ) : (
            <PopoverView
              className={className}
              direction={direction}
              data-state={isOpen ? "open" : "closed"}
              style={{ web: viewStyle.web }}
              {...rest}
              {...(tree.view && typeof tree.view === "object" ? tree.view : {})}
            >
              {viewNode}
            </PopoverView>
          )}
        </Slot>
      </>
    );
  });

  return PopoverPresentation;
}
