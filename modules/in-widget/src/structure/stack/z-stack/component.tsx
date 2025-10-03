import { iss } from "@in/style";
import { Stack } from "../stack/component.tsx";
import type { StackProps } from "../stack/type.ts";

/*#####################################(Render)#####################################*/

export function ZStack({ className, ...rest }: StackProps) {
  return (
    <>
      <Stack variant="zStack" className={iss(className)} {...rest} />
    </>
  );
}
