import { Stack, XStack } from "@in/widget/structure/stack/index.ts";
import { iss } from "@in/style";
import { Tab } from "@in/widget/ornament/index.ts";
import type { BlockIIProps } from "./type.ts";

/*##################################(BLOCK II)##################################*/
export function BlockII(props: BlockIIProps) {
  const { className, class: cls, children, ...rest } = props;

  return (
    <Stack className={iss({ className, class: cls })} {...rest}>
      <XStack gap={10}>
        <Tab
          radius={children?.tab?.radius || "md"}
          {...(children?.tab ?? {})}
        />
      </XStack>
    </Stack>
  );
}
