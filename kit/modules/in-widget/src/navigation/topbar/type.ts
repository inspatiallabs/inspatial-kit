import type { StyleProps } from "@in/style/index.ts";
import type { TopbarStyle } from "./style.ts";

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
export type TopbarProps = StyleProps<typeof TopbarStyle.wrapper> &
  JSX.SharedProps & {
    border: TopbarBorderProps;
    children: {
      left: TopbarLeftProps;
      right: TopbarRightProps;
      center: TopbarCenterProps;
    };
  };
