import { createSignal, type Signal } from "@in/teract/signal/signal.ts";

const idToOpenSignal = new Map<string, Signal<boolean>>();

export const PresentationRegistry = {
  ensureOpenSignal(id: string): Signal<boolean> {
    let sig = idToOpenSignal.get(id);
    if (!sig) {
      console.log('[Registry] Creating new signal for id:', id, 'with initial value: false');
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
    console.log('[Registry] getSignal for id:', id, 'returning signal with value:', sig.peek());
    return sig;
  },
};


