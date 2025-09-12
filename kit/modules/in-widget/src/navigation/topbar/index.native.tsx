import { iss } from "@in/style/variant/index.ts";
import { Slot, XStack } from "@in/widget/structure/index.ts";
import type {
  TopbarProps,
  TopbarBorderProps,
  TopbarCenterProps,
  TopbarLeftProps,
  TopbarRightProps,
} from "./type.ts";
import { TopbarStyle } from "./style.ts";

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
      {/****************** LEFT ANCHOR *****************/}
      <Slot
        className={TopbarStyle.left.anchor.getStyle({ className, class: cls })}
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
      {/****************** RIGHT ANCHOR *****************/}
      <Slot
        className={TopbarStyle.right.anchor.getStyle({ className, class: cls })}
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
      {/****************** CENTER ANCHOR *****************/}
      <Slot
        className={TopbarStyle.center.anchor.getStyle({
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
  const { className, class: cls, children, ...rest } = props;

  return (
    <XStack
      className={iss(TopbarStyle.wrapper.getStyle({ className, class: cls }))}
      {...rest}
    >
      {children}
    </XStack>
  );
}
