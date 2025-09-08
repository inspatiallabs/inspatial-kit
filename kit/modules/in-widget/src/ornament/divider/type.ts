import type { StyleProps } from "@in/style";
import type { DividerStyle } from "./style.ts";

/*####################################(DIVIDER BASE)####################################*/

export type DividerBaseProps = StyleProps<typeof DividerStyle> &
  JSX.SharedProps;

/*####################################(DIVIDER MIDDLE)####################################*/

export type DividerMiddleProps = StyleProps<typeof DividerStyle.middle> &
  JSX.SharedProps & {
    icon?: JSX.Element;
  };

/*####################################(DIVIDER PROPS WITH CHILDREN)####################################*/

type DividerPropsWithChildren = DividerBaseProps & {
  icon?: JSX.Element;
};

/*####################################(DIVIDER PROPS WITH ICON)####################################*/

type DividerPropsWithIcon = DividerBaseProps & {
  icon: JSX.Element;
};

/*####################################(DIVIDER PROPS)####################################*/

export type DividerProps = DividerPropsWithChildren | DividerPropsWithIcon;
