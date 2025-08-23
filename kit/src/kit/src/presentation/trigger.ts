import { createTrigger } from "@in/teract/trigger/trigger-props.ts";
import { isSignal } from "@in/teract/signal/signal.ts";
import { PresentationRegistry } from "./registry.ts";

type Action = "open" | "close" | "toggle";

interface TriggerPayload {
  id: string;
  action?: Action;
  open?: boolean;
}

function coercePayload(val: any): TriggerPayload | null {
  if (!val) return null;
  if (typeof val === "string") return { id: val, action: "toggle" };
  if (typeof val === "object" && typeof val.id === "string")
    return val as TriggerPayload;
  return null;
}

export function registerPresentationTrigger(): void {
  createTrigger("presentation", (node: Element, val: any) => {
    if (!val) return;

    let currentPayload: TriggerPayload | null = null;

    const clickHandler = (_event: Event) => {
      if (!currentPayload) return;

      const { id, action, open } = currentPayload;

      if (typeof open === "boolean") {
        PresentationRegistry.setOpen(id, open);
        return;
      }

      switch (action) {
        case "open":
          PresentationRegistry.setOpen(id, true);
          break;
        case "close":
          PresentationRegistry.setOpen(id, false);
          break;
        default:
          PresentationRegistry.setOpen(id, !PresentationRegistry.getOpen(id));
      }
    };

    // Handle signal or static value
    if (isSignal(val)) {
      // Update payload when signal changes
      const unsubscribe = val.connect(() => {
        currentPayload = coercePayload(val.peek());
      });
      // Initial value
      currentPayload = coercePayload(val.peek());

      // Add event listener
      node.addEventListener("click", clickHandler);

      // Return cleanup function
      return () => {
        node.removeEventListener("click", clickHandler);
        unsubscribe();
      };
    } else {
      // Static value
      currentPayload = coercePayload(val);

      if (!currentPayload) return;

      // Add event listener
      node.addEventListener("click", clickHandler);

      // Return cleanup function
      return () => {
        node.removeEventListener("click", clickHandler);
      };
    }
  });
}
