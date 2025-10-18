import { Slot } from "@in/widget/structure";
import type { JSX } from "@in/runtime/types";

/*#########################(Emulator None)#############################*/
export function EmulatorNone(props: JSX.SharedProps) {
  const { className, children, ...rest } = props;
  return (
    <Slot
      // className={iss(EmulatorNoneStyle.getStyle({ className }))}
      {...rest}
    >
      {children}
    </Slot>
  );
}
