import { Choose } from "@in/widget/control-flow";
import type { EmulatorProps } from "./type.ts";
import { EmulatorNone } from "./none/component.tsx";
import { EmulatorWeb } from "./web/component.dom.tsx";
import type { EmulatorWebProps } from "./index.ts";

/*#########################(Emulator)#############################*/
export function Emulator(props: EmulatorProps) {
  const { variant, ...rest } = props;

  return (
    <Choose
      cases={[
        {
          when: variant === "web",
          children: <EmulatorWeb {...(rest as EmulatorWebProps)} />,
        },
        {
          when: variant === "none",
          children: <EmulatorNone {...rest} />,
        },
      ]}
      otherwise={<EmulatorNone {...rest} />}
    />
  );
}
