import { iss } from "@in/style";
import { Stack } from "../stack/component.tsx";
import type { StackProps } from "../stack/type.ts";

/*#####################################(Render)#####################################*/

export function XStack({ className, ...rest }: StackProps) {
  return (
    <>
      <Stack variant="xStack" className={iss(className)} {...rest} />
    </>
  );
}
