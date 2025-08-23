import { Slot } from "../../structure/slot/index.tsx";
import { $ } from "@in/teract/state";
import { PresentationRegistry } from "../registry.ts";
import { ModalStyle, PresentationStyle } from "../style.ts";
import type {
  ModalOverlayProps,
  ModalWrapperProps,
  ModalProps,
  ModalContentProps,
} from "../type.ts";

/*#################################(MODAL OVERLAY)#################################*/

function ModalOverlay(props: ModalOverlayProps) {
  const { className, ...rest } = props;

  return (
    <>
      <Slot className={ModalStyle.overlay.getStyle({ className })} {...rest} />
    </>
  );
}

/*#################################(MODAL WRAPPER)#################################*/

function ModalWrapper(props: ModalWrapperProps) {
  const { className, ...rest } = props;
  return (
    <Slot className={ModalStyle.wrapper.getStyle({ className })} {...rest} />
  );
}

/*#################################(MODAL WINDOW)#################################*/

function ModalContent(props: ModalContentProps) {
  const { className, children, ...rest } = props;
  return (
    <Slot
      role="dialog"
      aria-modal
      className={ModalStyle.content.getStyle({ className })}
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
    open,
    defaultOpen,
    closeOnEsc = true,
    closeOnScrim = true,
    className,
    overlay = {
      display: true,
    },
    children,
  } = props;

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
  const ModalNode = $(() => {
    const isOpen = sig.get();
    if (!isOpen) return null;

    /*********************************(Render)*********************************/
    const hasOverlay = overlay.display;

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
            {...overlay}
          />
        )}
        <ModalWrapper
          on:escape={() =>
            closeOnEsc && PresentationRegistry.setOpen(id, false)
          }
        >
          <ModalContent
            $ref={(el: any) => (modalRef = el)}
            on:mount={() => setTimeout(() => modalRef?.focus(), 10)}
            className={className}
          >
            {children}
          </ModalContent>
        </ModalWrapper>
      </>
    );
  });

  return ModalNode;
}
