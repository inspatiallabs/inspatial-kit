import { isSignal } from "@in/teract/signal/index.ts";

export const motionStartHandler = (node: Element, val: any) => {
  if (!val) return;
  const cb = isSignal(val) ? val.peek() : val;
  if (typeof cb !== "function") return;
  const handler = (e: any) => cb(e?.detail ?? {});
  node.addEventListener("inmotion:start", handler as any);
  return () => node.removeEventListener("inmotion:start", handler as any);
};

export const motionEndHandler = (node: Element, val: any) => {
  if (!val) return;
  const cb = isSignal(val) ? val.peek() : val;
  if (typeof cb !== "function") return;
  const handler = (e: any) => cb(e?.detail ?? {});
  node.addEventListener("inmotion:end", handler as any);
  return () => node.removeEventListener("inmotion:end", handler as any);
};

export const motionProgressHandler = (node: Element, val: any) => {
  if (!val) return;
  const cb = isSignal(val) ? val.peek() : val;
  if (typeof cb !== "function") return;
  const handler = (e: any) => cb(e?.detail ?? {});
  node.addEventListener("inmotion:progress", handler as any);
  return () => node.removeEventListener("inmotion:progress", handler as any);
};


