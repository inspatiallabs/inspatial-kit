import { Slot } from "../../structure/slot/index.tsx";
import { $ } from "@in/teract/signal/signal.ts";
import { PresentationRegistry } from "../registry.ts";
import { iss } from "@in/style/index.ts";

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
  console.log(
    "[Modal] Rendering with id:",
    id,
    "open:",
    open,
    "defaultOpen:",
    defaultOpen
  );
  const sig = PresentationRegistry.getSignal(id);
  console.log(
    "[Modal] Got signal:",
    sig,
    "is it a Signal?",
    sig && typeof sig.get === "function"
  );

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

  function onKeydown(e: any) {
    if (closeOnEsc && e?.key === "Escape")
      PresentationRegistry.setOpen(id, false);
  }

  const classes = iss(
    "fixed inset-0 m-auto max-w-[min(90vw,640px)] max-h-[80vh] rounded-lg bg-red-500 text-(--primary) shadow-(--shadow-effect)",
    className
  );

  // Create a computed that returns the modal content or null
  const modalContent = $(() => {
    const isOpen = sig.get();
    console.log("[Modal] Computing modal content, isOpen:", isOpen);

    if (!isOpen) return null;

    return (
      <>
        {/* Scrim */}
        <Slot
          className="fixed inset-0 bg-black/40 z-[9999]"
          on:tap={() => closeOnScrim && PresentationRegistry.setOpen(id, false)}
          style={{ web: { pointerEvents: "auto" } }}
        />
        {/* Modal content */}
        <Slot
          role="dialog"
          aria-modal
          className={iss(classes, "z-[10000]")}
          on:keydown={onKeydown}
          style={{ web: { pointerEvents: "auto" } }}
          {...rest}
        >
          {children}
        </Slot>
      </>
    );
  });

  return modalContent;
}
