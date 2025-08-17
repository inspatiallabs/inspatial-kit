import { Stack } from "../stack/index.native.tsx";
import type { StackProps } from "../stack/style.ts";

/*#####################################(Render)#####################################*/

export function ZStack(props: StackProps) {
  return (
    <>
      <Stack variant="zStack" {...props} />
    </>
  );
}
