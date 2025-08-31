import { Slot } from "../../structure/slot/index.tsx";
import { KitBorderStyle } from "./style.ts";

/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                                KitBorder.tsx                               ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║  KitBorder is a component that renders a border at the top of the page.    ║
 * ║  It is used to create a border around the page.                            ║
 * ║                                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 */

/**
 * @returns a border at the top of the page
 */
export function KitBorder({ className }: { className?: string }) {
  return <Slot className={KitBorderStyle.getStyle({ className })} />;
}
