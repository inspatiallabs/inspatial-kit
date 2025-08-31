import { iss } from "@in/style";

/**
 * Slot
 *
 * Minimal placeholder that prefers `content` over `children`, while
 * passing through shared component props for universal rendering.
 */

type SlotProps = JSX.SharedProps & { content?: any; className?: string };

export function Slot({ content, children, ...rest }: SlotProps) {
  return (
    <>
      <div className={iss("", rest.className)} {...rest}>
        {content !== undefined ? content : children}
      </div>
    </>
  );
}
