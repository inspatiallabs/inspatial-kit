import { Choose } from "@in/widget/control-flow";
import type { EmulatorProps } from "./type.ts";
import { EmulatorNone } from "./none/component.tsx";
import { EmulatorWeb } from "./web/component.dom.tsx";

/*#########################(Emulator)#############################*/
export function Emulator(props: EmulatorProps) {
  const { format } = props;

  return (
    <Choose
      cases={[
        {
          when: (format as any)?.web,
          children: <EmulatorWeb {...(format as any).web} />,
        },
        {
          when: (format as any)?.none,
          children: <EmulatorNone />,
        },
      ]}
      otherwise={<EmulatorNone />}
    />
  );
}
