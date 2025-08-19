import { iss } from "@in/style";
import { Stack } from "../stack/index.native.tsx";
import type { StackProps } from "../stack/style.ts";

/*#####################################(Render)#####################################*/

export function ZStack({ className, ...rest }: StackProps) {
  return (
    <>
      <Stack variant="zStack" className={iss(className)} {...rest} />
    </>
  );
}
