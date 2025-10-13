import { Slot } from "@in/widget/structure/slot/index.ts";
import { KitBorderStyle } from "./style.ts";
import { iss } from "@in/style";
import type { KitBorderProps } from "./type.ts";

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
export function KitBorder(props: KitBorderProps) {
  const { className, class: cls, ...rest } = props;
  return (
    <Slot
      // @ts-ignore
      className={iss(KitBorderStyle.getStyle({ className, class: cls }))}
      {...rest}
    />
  );
}
