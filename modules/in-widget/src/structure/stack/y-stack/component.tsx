import { iss } from "@in/style"
import { Stack } from "../stack/component.tsx";
import type { StackProps } from "../stack/type.ts";

/*#####################################(Render)#####################################*/

export function YStack({ className, ...rest }: StackProps) {
  return (
    <>
      <Stack variant="yStack" className={iss(className)} {...rest} />
    </>
  );
}
