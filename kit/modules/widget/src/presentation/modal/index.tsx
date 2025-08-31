import { Slot } from "../../structure/slot/index.tsx";
import { $ } from "@in/teract/signal/signal.ts";
import { iss } from "@in/style/index.ts";
import { ensureArray } from "@in/vader/array.ts";
import { PresentationRegistry } from "../registry.ts";
import { ModalStyle } from "../style.ts";
import type {
  ModalOverlayProps,
  ModalWrapperProps,
  ModalProps,
  ModalViewProps,
} from "../type.ts";

/*#################################(MODAL OVERLAY)#################################*/

function ModalOverlay(props: ModalOverlayProps) {
  const { className, class: classProp, overlayFormat, ...rest } = props;

  return (
    <>
      <Slot
        className={ModalStyle.overlay.getStyle({
          class: classProp,
          className,
          overlayFormat,
          ...rest,
        })}
        {...rest}
      />
    </>
  );
}

/*#################################(MODAL WRAPPER)#################################*/

function ModalWrapper(props: ModalWrapperProps) {
  const { className, class: classProp, ...rest } = props;
  return (
    <>
      <Slot
        // @ts-ignore
        className={ModalStyle.wrapper.getStyle({
          class: classProp,
          className,
          ...rest,
        })}
        {...rest}
      />
    </>
  );
}

/*#################################(MODAL WINDOW)#################################*/

function ModalView(props: ModalViewProps) {
  const {
    className,
    class: classProp,
    children,
    format = "base",
    size,
    radius,
    direction,
    ...rest
  } = props;
  return (
    <Slot
      role="dialog"
      aria-modal
      // @ts-ignore
      className={ModalStyle.view.getStyle({
        class: classProp,
        className,
        format,
        direction,
        size,
        radius,
        ...rest,
      })}
      tabIndex={0}
      {...rest}
    >
      {children}
    </Slot>
  );
}

/*#################################(MODAL)#################################*/

export function Modal(props: ModalProps) {
  /*********************************(Props)*********************************/
  const {
    id,
    format,
    overlayFormat,
    direction,
    size,
    radius,
    open,
    defaultOpen,
    closeOnEsc = true,
    closeOnScrim = true,
    className,
    children,
    ...rest
  } = props;

  // Normalize widget tree props
  let modalChildren: any = {};
  let modalViewNode: any = null;

  if (
    children &&
    typeof children === "object" &&
    !Array.isArray(children) &&
    ("wrapper" in children || "overlay" in children || "view" in children)
  ) {
    // Allow only view to be an array
    const viewArr = ensureArray(children.view).filter(Boolean);

    modalChildren = {
      wrapper: children.wrapper || {},
      overlay: {
        display: true,
        overlayFormat: overlayFormat,
        ...(children.overlay || {}),
      },
      view: viewArr.length ? viewArr : undefined,
    };
    modalViewNode = (viewArr.length ? null : children.view) ?? rest.children;
  } else {
    // Direct children mode
    modalChildren = {
      format,
      size,
      radius,
      direction,
      wrapper: {},
      overlay: { display: true, overlayFormat: overlayFormat },
      view: undefined,
      ...rest,
    };
    modalViewNode = children;
  }

  /*********************************(State)*********************************/

  const sig = PresentationRegistry.getSignal(id);

  /*********************************(Lifecycle)*********************************/
  // Only set initial value if explicitly provided
  if (open !== undefined) {
    if (typeof open === "boolean") {
      sig.value = open;
    } else if (open && typeof (open as any).get === "function") {
      sig.value = !!(open as any).get();
    }
  } else if (defaultOpen === true) {
    // Only set if explicitly true
    sig.value = true;
  }

  let modalRef: any | null = null;

  // Create a computed that returns the modal view or null
  const ModalPresentation = $(() => {
    const isOpen = sig.get();
    if (!isOpen) return null;

    /*********************************(Render)*********************************/
    const hasOverlay =
      modalChildren.overlay &&
      modalChildren.overlay.display !== false &&
      modalChildren.overlay.overlayFormat !== "none";

    return (
      <>
        {hasOverlay && (
          <ModalOverlay
            on:tap={() =>
              closeOnScrim && PresentationRegistry.setOpen(id, false)
            }
            on:escape={() =>
              closeOnEsc && PresentationRegistry.setOpen(id, false)
            }
            {...modalChildren.overlay}
          />
        )}
        <ModalWrapper
          on:escape={() =>
            closeOnEsc && PresentationRegistry.setOpen(id, false)
          }
          {...modalChildren.wrapper}
        >
          {ensureArray(modalChildren.view).length ? (
            ensureArray(modalChildren.view).map((ct: any, idx: number) => (
              <ModalView
                key={`view-${idx}`}
                className={iss(ct?.className, className)}
                format={format}
                size={size}
                radius={radius}
                direction={ct?.direction ?? direction}
                data-in-presentation
                data-in-presentation-snap-points="false"
                data-state={isOpen ? "open" : "closed"}
                $ref={(el: any) => (modalRef = el)}
                on:mount={() => setTimeout(() => modalRef?.focus(), 10)}
                {...ct}
              >
                {ct?.children}
              </ModalView>
            ))
          ) : (
            <ModalView
              className={className}
              $ref={(el: any) => (modalRef = el)}
              format={format}
              size={size}
              radius={radius}
              direction={direction}
              data-in-presentation
              data-in-presentation-snap-points="false"
              data-state={isOpen ? "open" : "closed"}
              {...rest}
              on:mount={() => setTimeout(() => modalRef?.focus(), 10)}
              {...(modalChildren.view && typeof modalChildren.view === "object"
                ? modalChildren.view
                : {})}
            >
              {modalViewNode}
            </ModalView>
          )}
        </ModalWrapper>
      </>
    );
  });

  return ModalPresentation;
}
