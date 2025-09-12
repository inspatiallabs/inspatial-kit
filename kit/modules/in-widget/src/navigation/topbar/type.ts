import type { StyleProps } from "@in/style/index.ts";
import type { TopbarStyle } from "./style.ts";
import type { NotchProps } from "@in/widget/ornament/notch/index.ts";

/*##################################(TOPBAR LEFT)##################################*/
export type TopbarLeftProps = StyleProps<typeof TopbarStyle.left> &
  JSX.SharedProps & {};

/*##################################(TOPBAR RIGHT)##################################*/
export type TopbarRightProps = StyleProps<typeof TopbarStyle.right> &
  JSX.SharedProps & {};

/*##################################(TOPBAR CENTER)##################################*/
export type TopbarCenterProps = StyleProps<typeof TopbarStyle.center> &
  JSX.SharedProps & {};

/*##################################(TOPBAR BORDER)##################################*/
export type TopbarBorderProps = StyleProps<typeof TopbarStyle.border> &
  JSX.SharedProps & {};

/*##################################(TOPBAR)##################################*/

/***************(Topbar Internals)***************/
type TopbarFormatBarProps = "bar";
type TopbarFormatNotchProps = NotchProps["variant"];

/***************(Topbar Props)***************/
export type TopbarProps = StyleProps<typeof TopbarStyle.wrapper> &
  JSX.SharedProps & {
    format: TopbarFormatBarProps | TopbarFormatNotchProps;
    border: TopbarBorderProps;
    children: {
      left: TopbarLeftProps;
      right: TopbarRightProps;
      center: TopbarCenterProps;
    };
  };
