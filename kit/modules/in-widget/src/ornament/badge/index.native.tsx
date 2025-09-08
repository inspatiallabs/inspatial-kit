import { Slot } from "@in/widget/structure/index.ts";
import { BadgeStyle } from "./style.ts";
import { iss } from "@in/style/index.ts";
import type { BadgeProps } from "./type.ts";

//##############################################(BADGE COMPONENT)##############################################//

export function Badge({
  className,
  class: classname,
  $ref,
  asChild,
  format,
  ...props
}: BadgeProps) {
  //*************************************(asChild/slot)*************************************//

  // if asChild is true or the parent is a slot, then the component is a slot, else it is a badge
  const Component = asChild ? Slot : Badge;

  //*************************************(Render)*************************************//

  return (
    <Component
      $ref={$ref}
      className={iss(
        BadgeStyle.getStyle({ format, className, class: classname, ...props })
      )}
      {...props}
      
    />
  );
}
