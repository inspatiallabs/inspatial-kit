import { iss } from "@in/style";
import type { SlotProps } from "./type.ts";

/**
 * Slot
 *
 * Minimal placeholder that prefers `content` over `children`, while
 * passing through shared component props for universal rendering.
 */

/*#####################################(Slot)#####################################*/

export function Slot({ content, children, ...rest }: SlotProps) {
  return (
    <>
      <div className={iss("", rest.className)} {...rest}>
        {content !== undefined ? content : children}
      </div>
    </>
  );
}
