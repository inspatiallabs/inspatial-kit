import { iss } from "@in/style"
import { Stack } from "../stack/index.native.tsx";
import type { StackProps } from "../stack/style.ts";

/*#####################################(Render)#####################################*/

export function YStack({ className, ...rest }: StackProps) {
  return (
    <>
      <Stack variant="yStack" className={iss(className)} {...rest} />
    </>
  );
}
