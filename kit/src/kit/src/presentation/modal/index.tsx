import { Slot } from "../../structure/slot/index.tsx";
import { $, createEffect } from "@in/teract/state";
import { PresentationRegistry } from "../registry.ts";
import { presentationStyle } from "../style.ts";

export interface ModalProps extends JSX.SharedProps {
  id: string;
  open?: boolean | any;
  defaultOpen?: boolean;
  closeOnEsc?: boolean;
  closeOnScrim?: boolean;
  className?: string;
}

export function Modal(props: ModalProps) {
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
  const sig = PresentationRegistry.getSignal(id);

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

  // Focus modal when it opens and add global escape listener
  createEffect(() => {
    const isOpen = sig.get();
    if (isOpen) {
      // Focus the modal
      if (modalRef) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          modalRef?.focus();
        }, 10);
      }

      // Add global escape listener as fallback
      const handleGlobalKeydown = (e: KeyboardEvent) => {
        if (closeOnEsc && e.key === "Escape") {
          e.preventDefault();
          PresentationRegistry.setOpen(id, false);
        }
      };

      document.addEventListener("keydown", handleGlobalKeydown);

      return () => {
        document.removeEventListener("keydown", handleGlobalKeydown);
      };
    }
  });

  // Create a computed that returns the modal content or null
  const modalContent = $(() => {
    const isOpen = sig.get();
    if (!isOpen) return null;

    return (
      <>
        <Slot
          className="fixed inset-0 bg-black/40 pointer-events-auto"
          style:z-index="2147483646"
          on:tap={() => closeOnScrim && PresentationRegistry.setOpen(id, false)}
        />
        {/* Centering wrapper */}
        <Slot
          className="fixed inset-0 flex items-center justify-center pointer-events-none"
          style:z-index="2147483647"
        >
          {/* Modal panel */}
          <Slot
            role="dialog"
            aria-modal
            className={`${presentationStyle.getStyle({
              className,
            })} pointer-events-auto`}
            $ref={(el: any) => (modalRef = el)}
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
