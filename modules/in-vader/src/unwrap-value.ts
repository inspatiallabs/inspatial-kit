import type { Signal } from "@in/teract/signal";

/**
 * Unwraps the value from a number or a Signal<number>.
 *
 * If the provided value is a reactive Signal, the current number value
 * is extracted using `.get()`. Otherwise, the direct number is returned.
 *
 * @param val - The number or Signal<number> to unwrap.
 * @returns The numeric value either directly or via Signal#get().
 */
export function unwrapValue(val: number | Signal<number>): number {
  if (val && typeof val === "object" && "get" in val) {
    return (val as Signal<number>).get();
  }
  return val as number;
}
