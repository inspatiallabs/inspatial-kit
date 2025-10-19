import { Slot } from "@in/widget/structure/slot/index.ts";
import { $ } from "@in/teract/state";
import { createSignal, onDispose, nextTick } from "@in/teract/signal";
import { isSignal } from "@in/teract/signal";
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
import {
  computePosition,
  autoUpdate,
  getElementRect,
  getFloatingSize,
  getNearestScrollRoot,
  getRect,
  isRTL,
  getVirtualPointRect,
} from "../positioning-api/index.ts";
import { Controller } from "@in/widget/control-flow/controller/index.ts";

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
    positioning,
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
    as,
    backdrop = "transparent", // Prefer transparent over none as default because the anatomy of a popver almost always demand a close on backdrop tap regardless of the backdrop type.
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
    positioning,
    arrow,
    ...rest
  } = props as any;

  const sig = PresentationRegistry.getSignal(id);
  const pos = createSignal<{ top: number; left: number }>({ top: 0, left: 0 });
  const ready = createSignal(false);

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

    let viewRef: any = null;
    let stop: any = null;

    const update = () => {
      if (!viewRef) return;
      const scrollRoot = getNearestScrollRoot(anchor?.node || null);
      const boundaryRect = getRect(scrollRoot);

      const anchorRect = anchor?.node
        ? getElementRect(anchor.node)
        : anchor?.point
        ? getVirtualPointRect(anchor.point)
        : { top: 0, left: 0, width: 0, height: 0 };

      const measured = getFloatingSize(viewRef);
      const floatingSize =
        measured.width > 0 && measured.height > 0
          ? measured
          : { width: 350, height: 420 };

      const result = computePosition({
        anchorRect,
        floatingSize,
        direction,
        align,
        rtl: isRTL(viewRef),
        boundaryRect,
        options: positioning,
      });

      pos.value = { left: result.x, top: result.y } as any;
    };

    onDispose(() => {
      try {
        stop?.();
      } catch {}
    });

    // Compute an initial position before mount using default size (no hiding)
    const initialStyle: any = { web: {} };
    {
      const scrollRoot = getNearestScrollRoot(anchor?.node || null);
      const boundaryRect = getRect(scrollRoot);
      const anchorRect = anchor?.node
        ? getElementRect(anchor.node)
        : anchor?.point
        ? getVirtualPointRect(anchor.point)
        : { top: 0, left: 0, width: 0, height: 0 };
      const preferredSize = { width: 350, height: 420 };
      const initial = computePosition({
        anchorRect,
        floatingSize: preferredSize,
        direction,
        align,
        rtl: false,
        boundaryRect,
        options: positioning,
      });
      initialStyle.web.top = `${initial.y}px`;
      initialStyle.web.left = `${initial.x}px`;
    }

    const viewStyle: any = { web: {} };
    const { top, left } = pos.get();
    const useInitial = !ready.get();
    viewStyle.web.top = useInitial ? initialStyle.web.top : `${top}px`;
    viewStyle.web.left = useInitial ? initialStyle.web.left : `${left}px`;

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
                $ref={(el: any) => (viewRef = el)}
                on:mount={() => {
                  // First compute immediately, then after layout, then start updates
                  update();
                  nextTick(() => {
                    update();
                    stop = autoUpdate({
                      anchor: anchor?.node,
                      floating: () => viewRef,
                      onUpdate: update,
                    });
                    ready.value = true;
                  });
                }}
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
              $ref={(el: any) => (viewRef = el)}
              on:mount={() => {
                update();
                nextTick(() => {
                  update();
                  stop = autoUpdate({
                    anchor: anchor?.node,
                    floating: () => viewRef,
                    onUpdate: update,
                  });
                  ready.value = true;
                });
              }}
              {...rest}
              {...(tree.view && typeof tree.view === "object" ? tree.view : {})}
            >
              {viewNode ?? Controller(isSignal(as) ? (as as any).get() : as)}
            </PopoverView>
          )}
        </Slot>
      </>
    );
  });

  return PopoverPresentation;
}
