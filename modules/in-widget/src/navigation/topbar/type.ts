import type { StyleProps } from "@in/style/index.ts";
import type { TopbarStyle } from "./style.ts";
import type { NotchProps } from "@in/widget/ornament/notch/index.ts";
import type { ButtonProps } from "@in/widget/ornament/button/type.ts";
import type { BadgeProps } from "@in/widget/ornament/badge/type.ts";
import type { InputFieldProps } from "@in/widget/input/type.ts";
import type { TabProps } from "@in/widget/ornament/tab/type.ts";
import type { LinkProps } from "@in/widget/navigation/link/type.ts";
import type { AvatarProps } from "@in/widget/ornament/avatar/type.ts";
import type { CheckboxProps, SwitchProps } from "@in/widget/input/index.ts";
import type { JSX } from "@in/runtime/types";
import type { BlockProps } from "@in/widget";

/***************(Topbar Internals)***************/
type TopbarTypeBarProps = "bar";
type TopbarTypeNotchProps = NotchProps["variant"];
type TopbarChildrenAnatomyProps =
  | LinkProps[]
  | ButtonProps[]
  | BadgeProps[]
  | CheckboxProps[]
  | SwitchProps
  | InputFieldProps
  | TabProps
  | AvatarProps;

// | DropdownProps

/*##################################(TOPBAR LEFT)##################################*/
export type TopbarLeftProps = StyleProps<typeof TopbarStyle.left> & {
  children?: TopbarChildrenAnatomyProps | BlockProps["variant"];
};

/*##################################(TOPBAR RIGHT)##################################*/
export type TopbarRightProps = StyleProps<typeof TopbarStyle.right> & {
  children?: TopbarChildrenAnatomyProps | BlockProps["variant"];
};

/*##################################(TOPBAR CENTER)##################################*/
export type TopbarCenterProps = StyleProps<typeof TopbarStyle.center> & {
  children?: TopbarChildrenAnatomyProps | BlockProps["variant"];
};

/*##################################(TOPBAR BORDER)##################################*/
export type TopbarBorderProps = StyleProps<typeof TopbarStyle.border> & {
  children?: TopbarChildrenAnatomyProps;
};

/*##################################(TOPBAR)##################################*/

/***************(Topbar Props)***************/
export type TopbarProps = StyleProps<typeof TopbarStyle.wrapper> &
  JSX.SharedProps & {
    format?:
      | "bare" // bare format is a simple topbar structure with no formatting i.e items
      | "interlever"
      | "rhodes"
      | "dfcreative"
      | "collective"
      | "worker"
      | "the-beer";
    type?: TopbarTypeBarProps | TopbarTypeNotchProps;
    border?: TopbarBorderProps;

    children?: {
      left?: TopbarLeftProps;
      right?: TopbarRightProps;
      center?: TopbarCenterProps;
    };
  };
