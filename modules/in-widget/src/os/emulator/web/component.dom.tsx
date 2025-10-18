import { iss } from "@in/style";
import type { EmulatorWebProps } from "./type.ts";
import { EmulatorWebStyle } from "./style.ts";

/*#########################(Emulator Web)#############################*/
export function EmulatorWeb(props: EmulatorWebProps) {
  const { className, src, ...rest } = props;
  return (
    <iframe
      className={iss(EmulatorWebStyle.getStyle({ className }))}
      src={src}
      {...rest}
    />
  );
}
