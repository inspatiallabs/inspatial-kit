import { iss } from "@in/style";
import { Slot, XStack, YStack } from "../../structure/index.ts";
import type {
  TopbarProps,
  TopbarCenterProps,
  TopbarLeftProps,
  TopbarRightProps,
} from "./type.ts";
import { TopbarStyle } from "./style.ts";
import { KitBorder } from "../../ornament/index.ts";
import { TopbarPresets } from "./preset.tsx";
import { Show } from "../../control-flow/index.ts";

/*##################################(TOPBAR LEFT)##################################*/
function TopbarLeft(props: TopbarLeftProps) {
  const { className, class: cls, children, preset, ...rest } = props;
  return (
    <XStack
      className={iss(
        TopbarStyle.left.container.getStyle({ className, class: cls })
      )}
      {...rest}
    >
      {/****************** LEFT item *****************/}
      <Slot
        className={TopbarStyle.left.item.getStyle({ className, class: cls })}
        {...rest}
      >
        <Show when={preset !== "none"} otherwise={children}>
          <TopbarPresets
            preset={preset}
            className={className}
            class={cls}
            {...rest}
          />
        </Show>
      </Slot>
    </XStack>
  );
}

/*##################################(TOPBAR CENTER)##################################*/
function TopbarCenter(props: TopbarCenterProps) {
  const { className, class: cls, children, preset, ...rest } = props;
  return (
    <XStack
      className={iss(
        TopbarStyle.center.container.getStyle({ className, class: cls })
      )}
      {...rest}
    >
      {/****************** CENTER item *****************/}
      <Slot
        className={TopbarStyle.center.item.getStyle({
          className,
          class: cls,
        })}
        {...rest}
      >
        <Show when={preset !== "none"} otherwise={children}>
          <TopbarPresets
            preset={preset}
            className={className}
            class={cls}
            {...rest}
          />
        </Show>
      </Slot>
    </XStack>
  );
}

/*##################################(TOPBAR RIGHT)##################################*/
function TopbarRight(props: TopbarRightProps) {
  const { className, class: cls, children, preset, ...rest } = props;
  return (
    <XStack
      className={iss(
        TopbarStyle.right.container.getStyle({ className, class: cls })
      )}
      {...rest}
    >
      {/****************** RIGHT item *****************/}
      <Slot
        className={TopbarStyle.right.item.getStyle({ className, class: cls })}
        {...rest}
      >
        <Show when={preset !== "none"} otherwise={children}>
          <TopbarPresets
            preset={preset}
            className={className}
            class={cls}
            {...rest}
          />
        </Show>
      </Slot>
    </XStack>
  );
}

/*##################################(TOPBAR)##################################*/
export function Topbar(props: TopbarProps) {
  const {
    className,
    class: cls,
    children = { left: {}, center: {}, right: {} },
    border = { position: "top" },
    ...rest
  } = props;

  return (
    <YStack>
      {/*================(Topbar Border Top)==================*/}
      {border && border.position === "top" && (
        <KitBorder
          className={TopbarStyle.border.getStyle({ className, class: cls })}
          style={{ web: { position: "absolute" } }}
        />
      )}
      {/*************************** (TOPBAR CHILDREN START) ***************************/}

      <XStack
        className={iss(TopbarStyle.wrapper.getStyle({ className, class: cls }))}
        {...rest}
      >
        {/* Left */}
        <Show when={children.left}>
          {/* @ts-ignore */}
          <TopbarLeft {...(children.left ?? {})} />
        </Show>

        {/* Center */}
        <Show when={children.center}>
          {/* @ts-ignore */}
          <TopbarCenter {...(children.center ?? {})} />
        </Show>

        {/* Right */}
        <Show when={children.right}>
          {/* @ts-ignore */}
          <TopbarRight {...(children.right ?? {})} />
        </Show>
      </XStack>

      {/*************************** (TOPBAR CHILDREN END) ***************************/}

      {/*================(Topbar Border Bottom)==================*/}
      {border && border.position === "bottom" && (
        <KitBorder
          className={TopbarStyle.border.getStyle({ className, class: cls })}
        />
      )}
    </YStack>
  );
}
