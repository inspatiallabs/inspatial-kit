import { Stack, XStack } from "@in/widget/structure/stack/index.tsx";
import type { TopbarPresetsProps } from "./type.ts";
import { iss } from "@in/style";
import { Show } from "@in/widget/control-flow/index.ts";
import { Avatar, Button, Tab } from "@in/widget/ornament/index.ts";
import { FlowVisualizerIcon } from "@in/widget/icon/flow-visualizer-icon.tsx";
import { Checkbox, Switch } from "@in/widget/input/index.ts";
import { Icon, CodeIcon, ClockIcon, PlayIcon } from "@in/widget/icon/index.ts";

/*##################################(TOPBAR PRESETS)##################################*/
// A collection of topbar action blocks for any topbar composition
/*#####################################################################################*/
export function TopbarPresets(props: TopbarPresetsProps) {
  const { className, class: cls, children, preset, ...rest } = props;

  return (
    <Stack className={iss({ className, class: cls, preset })} {...rest}>
      {/******************(Preset 1)******************/}
      <Show when={preset === "1"}>
        <XStack gap={10}>
          <Button format="background" size="md" radius="md">
            <Icon size="3xs" />
          </Button>

          <Checkbox
            id="interlever-left"
            selected={false}
            format="flat"
            size="md"
            radius="md"
            type="toggle"
            icon={<FlowVisualizerIcon size="3xs" />}
            on:input={(e: any) => console.log(e)}
          />

          <Avatar />
        </XStack>
      </Show>

      {/******************(Preset 2)******************/}
      <Show when={preset === "2"}>
        <XStack gap={10}>
          <Tab
            radius="md"
            defaultSelected="Data"
            on:input={(label: string) => {
              console.log("Main tab onChange:", label);
            }}
            children={[
              { label: "Spec", style: { web: { width: "160px" } } },
              { label: "Window", style: { web: { width: "160px" } } },
              { label: "Scene", style: { web: { width: "160px" } } },
              { label: "Data", style: { web: { width: "160px" } } },
            ]}
          />
        </XStack>
      </Show>

      {/******************(Preset 3)******************/}
      <Show when={preset === "3"}>
        <XStack gap={10}>
          <Switch size="md" icon={<CodeIcon size="3xs" />} />

          <Button format="background" size="md" radius="md">
            <ClockIcon size="3xs" />
          </Button>

          <Checkbox
            id="interlever-left"
            selected={false}
            format="flat"
            size="md"
            radius="md"
            type="toggle"
            icon={<PlayIcon size="3xs" />}
            on:input={(e: any) => console.log(e)}
          />

          <Button
            format="base"
            radius="md"
            size="none"
            style={{
              web: {
                height: "40px",
                width: "100%",
                paddingLeft: "48px",
                paddingRight: "48px",
              },
            }}
          >
            Publish
          </Button>
        </XStack>
      </Show>
    </Stack>
  );
}
