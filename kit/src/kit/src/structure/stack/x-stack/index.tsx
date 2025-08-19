import { iss } from "@in/style";
import { Stack } from "../stack/index.native.tsx";
import type { StackProps } from "../stack/style.ts";

/*#####################################(Render)#####################################*/

export function XStack({ className, ...rest }: StackProps) {
  return (
    <>
      <Stack variant="xStack" className={iss(className)} {...rest} />
    </>
  );
}
