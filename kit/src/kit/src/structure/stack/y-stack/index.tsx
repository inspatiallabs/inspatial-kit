import { Stack } from "../stack/index.native.tsx";
import type { StackProps } from "../stack/style.ts";

/*#####################################(Render)#####################################*/

export function YStack(props: StackProps) {
  return (
    <Stack
      variant="yStack"
      style={{
        web: {
          display: "flex",
          flexDirection: "column",
          ...props.style,
        },
      }}
      {...props}
    />
  );
}
