import { Stack, XStack } from "@in/widget/structure/stack/index.ts";
import { iss } from "@in/style";
import { Avatar, Button } from "@in/widget/ornament/index.ts";
import { FlowVisualizerIcon } from "@in/widget/icon/flow-visualizer-icon.tsx";
import { Checkbox } from "@in/widget/input/index.ts";
import { BrandIcon } from "@in/widget/icon/index.ts";
import type { BlockIProps } from "./type.ts";
import { ensureArray } from "@in/vader";

/*##################################(BLOCK I)##################################*/
export function BlockI(props: BlockIProps) {
  /***************************(Props)****************************/
  const { className, class: cls, children, ...rest } = props;

  /***************************(Ensure Array)****************************/

  const buttons = ensureArray(children?.button);
  const checkboxes = ensureArray(children?.checkbox);
  const avatars = ensureArray(children?.avatar);

  const btn = buttons[0] ?? {};
  const cb = checkboxes[0] ?? {};
  const av = avatars[0] ?? {};

  /***************************(Render)****************************/
  return (
    <Stack className={iss({ children, className, class: cls })} {...rest}>
      <XStack gap={10}>
        <Button
          format={btn?.format || "background"}
          size={btn?.size || "md"}
          radius={btn?.radius || "md"}
          {...(btn ?? {})}
        >
          <BrandIcon size={btn?.icon?.size || "3xs"} />
        </Button>

        <Checkbox
          id="interlever-left"
          selected={false}
          format={cb?.format || "flat"}
          size={cb?.size || "md"}
          radius={cb?.radius || "md"}
          type={cb?.type || "toggle"}
          icon={<FlowVisualizerIcon size={cb?.icon?.size || "3xs"} />}
          on:input={(e: any) => cb?.onInput?.(e)}
          {...(cb ?? {})}
        />

        <Avatar {...(av ?? {})} />
      </XStack>
    </Stack>
  );
}
