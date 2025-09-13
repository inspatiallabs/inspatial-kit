import type { ISSProps, StyleProps } from "@in/style/index.ts";
import type { TopbarStyle } from "./style.ts";
import type { NotchProps } from "@in/widget/ornament/notch/index.ts";
import type { ButtonProps } from "@in/widget/ornament/button/type.ts";
import type { InputFieldProps } from "@in/widget/input/type.ts";
import type { TabProps } from "@in/widget/ornament/tab/type.ts";
import type { LinkProps } from "@in/widget/navigation/link/type.ts";
import type { AvatarProps } from "@in/widget/ornament/avatar/type.ts";

/***************(Topbar Internals)***************/
type TopbarFormatBarProps = "bar";
type TopbarFormatNotchProps = NotchProps["variant"];
type TopbarChildrenAnatomyProps =
  | JSX.Element
  | LinkProps[]
  | ButtonProps[]
  | InputFieldProps["variant"][]
  | TabProps
  | AvatarProps;

/*##################################(TOPBAR LEFT)##################################*/
export type TopbarLeftProps = StyleProps<typeof TopbarStyle.left> & {
  children?: TopbarChildrenAnatomyProps;
};

/*##################################(TOPBAR RIGHT)##################################*/
export type TopbarRightProps = StyleProps<typeof TopbarStyle.right> & {
  children?: TopbarChildrenAnatomyProps;
};

/*##################################(TOPBAR CENTER)##################################*/
export type TopbarCenterProps = StyleProps<typeof TopbarStyle.center> & {
  children?: TopbarChildrenAnatomyProps;
};

/*##################################(TOPBAR BORDER)##################################*/
export type TopbarBorderProps = StyleProps<typeof TopbarStyle.border> & {
  children?: TopbarChildrenAnatomyProps;
};

/*##################################(TOPBAR)##################################*/

/***************(Topbar Props)***************/
export type TopbarProps = StyleProps<typeof TopbarStyle.wrapper> &
  JSX.SharedProps & {
    format?: TopbarFormatBarProps | TopbarFormatNotchProps;
    border?: TopbarBorderProps;
    layout?: ISSProps["justify-content"]
    children?: {
      left: TopbarLeftProps;
      right: TopbarRightProps;
      center: TopbarCenterProps;
    };
  };
