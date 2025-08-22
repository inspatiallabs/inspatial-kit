import { Slot } from "../../structure/slot/index.tsx";
import { $ } from "../../../../state/src/core/index.ts";
import { PresentationRegistry } from "../registry.ts";
import { presentationStyle } from "../style.ts";

/*#################################(TYPES)#################################*/
export interface ModalProps extends JSX.SharedProps {
  id: string;
  open?: boolean | any;
  defaultOpen?: boolean;
  closeOnEsc?: boolean;
  closeOnScrim?: boolean;
  className?: string;
}

/*#################################(MODAL COMPONENT)#################################*/
export function Modal(props: ModalProps) {
  /*********************************(Props)*********************************/
  const {
    id,
    open,
    defaultOpen,
    closeOnEsc = true,
    closeOnScrim = true,
    className,
    children,
    ...rest
  } = props as any;

  /*********************************(State)*********************************/

  const sig = PresentationRegistry.getSignal(id);

  /*********************************(Lifecycle)*********************************/
  // Only set initial value if explicitly provided
  if (open !== undefined) {
    if (typeof open === "boolean") {
      sig.value = open;
    } else if (open && typeof open.get === "function") {
      sig.value = !!open.get();
    }
  } else if (defaultOpen === true) {
    // Only set if explicitly true
    sig.value = true;
  }

  let modalRef: HTMLElement | null = null;

  function onKeydown(e: any) {
    if (closeOnEsc && e?.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      PresentationRegistry.setOpen(id, false);
    }
  }

  // Create a computed that returns the modal content or null
  const modalContent = $(() => {
    const isOpen = sig.get();
    if (!isOpen) return null;

    /*********************************(Render)*********************************/
    return (
      <>
        <Slot
          className="fixed inset-0 bg-black/40 pointer-events-auto"
          style:z-index="2147483646"
          on:tap={() => closeOnScrim && PresentationRegistry.setOpen(id, false)}
          on:escape={(_e: any) =>
            closeOnEsc && PresentationRegistry.setOpen(id, false)
          }
        />
        {/* Centering wrapper */}
        <Slot
          className="fixed inset-0 flex items-center justify-center pointer-events-none"
          style:z-index="2147483647"
          on:keydown={onKeydown}
          on:escape={(_e: any) =>
            closeOnEsc && PresentationRegistry.setOpen(id, false)
          }
        >
          {/* Modal panel */}
          <Slot
            role="dialog"
            aria-modal
            className={`${presentationStyle.getStyle({
              className,
            })} pointer-events-auto`}
            $ref={(el: any) => (modalRef = el)}
            on:mount={() => setTimeout(() => modalRef?.focus(), 10)}
            on:keydown={onKeydown}
            tabIndex={0}
            {...rest}
          >
            {children}
          </Slot>
        </Slot>
      </>
    );
  });

  return modalContent;
}
