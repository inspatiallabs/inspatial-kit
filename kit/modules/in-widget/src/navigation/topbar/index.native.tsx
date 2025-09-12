import { iss } from "@in/style/variant/index.ts";
import { Slot, XStack, YStack } from "@in/widget/structure/index.ts";
import type {
  TopbarProps,
  TopbarCenterProps,
  TopbarLeftProps,
  TopbarRightProps,
} from "./type.ts";
import { TopbarStyle } from "./style.ts";
import { KitBorder } from "@in/widget/ornament/index.ts";

/*##################################(TOPBAR LEFT)##################################*/
export function TopbarLeft(props: TopbarLeftProps) {
  const { classname, class: cls, children, ...rest } = props;
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
        {children}
      </Slot>
    </XStack>
  );
}

/*##################################(TOPBAR RIGHT)##################################*/
export function TopbarRight(props: TopbarRightProps) {
  const { classname, class: cls, children, ...rest } = props;
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
        {children}
      </Slot>
    </XStack>
  );
}

/*##################################(TOPBAR CENTER)##################################*/
export function TopbarCenter(props: TopbarCenterProps) {
  const { classname, class: cls, children, ...rest } = props;
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
        {children}
      </Slot>
    </XStack>
  );
}

/*##################################(TOPBAR)##################################*/
export function Topbar(props: TopbarProps) {
  const {
    className,
    class: cls,
    children,
    border = { position: "top" },
    ...rest
  } = props;

  return (
    <YStack>
      {border && border.position === "top" && (
        <KitBorder
          className={TopbarStyle.border.getStyle({ className, class: cls })}
          style:position="absolute"
        />
      )}
      <XStack
        className={iss(TopbarStyle.wrapper.getStyle({ className, class: cls }))}
        {...rest}
      >
        {children}
      </XStack>
      {border && border.position === "bottom" && (
        <KitBorder
          className={TopbarStyle.border.getStyle({ className, class: cls })}
        />
      )}
    </YStack>
  );
}
