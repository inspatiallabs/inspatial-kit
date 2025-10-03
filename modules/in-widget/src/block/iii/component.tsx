import { Stack, XStack } from "@in/widget/structure/stack/index.tsx";
import { iss } from "@in/style";
import { Button } from "@in/widget/ornament/index.ts";
import { Checkbox, Switch } from "@in/widget/input/index.ts";
import { CodeIcon, ClockIcon, PlayIcon } from "@in/widget/icon/index.ts";
import type { BlockIIIProps } from "./type.ts";

/*##################################(BLOCK III)##################################*/
export function BlockIII(props: BlockIIIProps) {
  const { className, class: cls, children, ...rest } = props;

  return (
    <Stack className={iss({ className, class: cls })} {...rest}>
      <XStack gap={10}>
        <Switch
          size={children?.switch?.size || "md"}
          icon={children?.switch?.icon || <CodeIcon size="3xs" />}
          {...(children?.switch ?? {})}
        />

        <Button
          format={children?.button?.format || "background"}
          size={children?.button?.size || "md"}
          radius={children?.button?.radius || "md"}
          {...(children?.button ?? {})}
        >
          <ClockIcon size={children?.button?.icon?.size || "3xs"} />
        </Button>

        <Checkbox
          id={children?.checkbox?.id || "interlever-left"}
          selected={children?.checkbox?.selected || false}
          format={children?.checkbox?.format || "flat"}
          size={children?.checkbox?.size || "md"}
          radius={children?.checkbox?.radius || "md"}
          type={children?.checkbox?.type || "toggle"}
          icon={children?.checkbox?.icon || <PlayIcon size="3xs" />}
          on:input={(e: any) => children?.checkbox?.onInput?.(e)}
          {...(children?.checkbox ?? {})}
        />

        <Button
          format={children?.button?.format || "base"}
          radius={children?.button?.radius || "md"}
          size={children?.button?.size || "none"}
          style={
            children?.button?.style || {
              web: {
                height: "40px",
                width: "100%",
                paddingLeft: "48px",
                paddingRight: "48px",
              },
            }
          }
          {...(children?.button ?? {})}
        >
          {children?.button?.label || "Publish"}
        </Button>
      </XStack>
    </Stack>
  );
}
