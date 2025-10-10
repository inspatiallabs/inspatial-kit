import { createSignal, type Signal } from "@in/teract/signal";

const idToOpenSignal = new Map<string, Signal<boolean>>();
type AnchorPoint = { x: number; y: number };
type AnchorData = { node?: Element | null; point?: AnchorPoint | null } | null;
const idToAnchor = new Map<string, AnchorData>();

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
  setAnchor(id: string, anchor: AnchorData): void {
    idToAnchor.set(id, anchor ?? null);
  },
  getAnchor(id: string): AnchorData {
    return idToAnchor.get(id) ?? null;
  },
};
