import { Stack } from "../stack/index.native.tsx";
import type { StackProps } from "../stack/style.ts";

/*#####################################(Render)#####################################*/

export function XStack(props: XStackProps) {
  return <Stack variant="xStack" {...props} />;
}
