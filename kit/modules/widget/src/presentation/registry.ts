import { createSignal, type Signal } from "@in/teract/signal/signal.ts";

const idToOpenSignal = new Map<string, Signal<boolean>>();

export const PresentationRegistry = {
  ensureOpenSignal(id: string): Signal<boolean> {
    let sig = idToOpenSignal.get(id);
    if (!sig) {
      sig = createSignal(false);
      idToOpenSignal.set(id, sig);
    }
    return sig;
  },
  setOpen(id: string, value: boolean): void {
    this.ensureOpenSignal(id).value = value;
  },
  getOpen(id: string): boolean {
    return !!this.ensureOpenSignal(id).peek();
  },
  getSignal(id: string): Signal<boolean> {
    const sig = this.ensureOpenSignal(id);

    return sig;
  },
};
