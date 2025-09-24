import { iss } from "@in/style";
import type {
  DividerBaseProps,
  DividerMiddleProps,
  DividerProps,
} from "./type.ts";
import { DividerStyle } from "./style.ts";

/*####################################(DIVIDER LEFT)####################################*/
function DividerLeft({
  className,
  class: classname,
  ...rest
}: DividerBaseProps) {
  return (
    <div
      className={iss(
        DividerStyle.left.getStyle({ className, class: classname })
      )}
      {...rest}
    />
  );
}

/*####################################(DIVIDER RIGHT)####################################*/
function DividerRight({
  className,
  class: classname,
  ...rest
}: DividerBaseProps) {
  return (
    <div
      className={iss(
        DividerStyle.right.getStyle({ className, class: classname })
      )}
      {...rest}
    />
  );
}

/*####################################(DIVIDER MIDDLE)####################################*/

function DividerMiddle({
  className,
  class: classname,
  children,
  icon,
  ...rest
}: DividerMiddleProps) {
  return (
    <section
      className={iss(
        // @ts-ignore
        DividerStyle.middle.getStyle({ className, class: classname }),
        className
      )}
      {...rest}
    >
      {children || icon}
    </section>
  );
}

/*####################################(DIVIDER)####################################*/

export function Divider({
  className,
  class: classname,
  children,
  ...rest
}: DividerProps) {
  return (
    <main
      className={iss(
        DividerStyle.wrapper.getStyle({ className, class: classname })
      )}
      {...rest}
    >
      {children}
    </main>
  );
}
