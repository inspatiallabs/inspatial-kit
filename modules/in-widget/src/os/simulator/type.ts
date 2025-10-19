import type { StyleProps } from "@in/style";
import type { SimulatorStyle } from "./style.ts";
import type { JSX } from "@in/runtime/types";
import type { EmulatorFormat } from "../emulator/type.ts";

/*#########################(Wrapper Props)#############################*/
export type SimulatorWrapperProps = StyleProps<typeof SimulatorStyle.wrapper> &
  JSX.SharedProps;

/*#########################(Frame Props)#############################*/
export type SimulatorInnerFrameProps = StyleProps<
  typeof SimulatorStyle.frame.inner
> &
  JSX.SharedProps;

export type SimulatorOuterFrameProps = StyleProps<
  typeof SimulatorStyle.frame.outer
> &
  JSX.SharedProps;

export type SimulatorFrameProps = {
  inner?: SimulatorInnerFrameProps;
  outer?: SimulatorOuterFrameProps;
} & JSX.SharedProps;

/*#########################(Status Bar Props)#############################*/
export type SimulatorStatusBarProps = StyleProps<
  typeof SimulatorStyle.statusBar
> &
  JSX.SharedProps;

/*#########################(Browser Bar Props)#############################*/
export type SimulatorBrowserBarProps = StyleProps<
  typeof SimulatorStyle.browserBar
> &
  JSX.SharedProps;

/*#########################(Simulator Props)#############################*/
export type SimulatorProps = StyleProps<typeof SimulatorStyle.wrapper> & {
  format: EmulatorFormat;
  radius?: SimulatorInnerFrameProps["radius"];
  children?: {
    inner?: SimulatorFrameProps["inner"];
    outer?: SimulatorFrameProps["outer"];
  };
};

/*#########################(Simulator Controls)#############################*/
export type SimulatorControls = {
  frame: "All" | "Inner" | "Outer" | "None";
  screenFill: boolean;
  screenSize: Exclude<SimulatorProps["size"], "fill">;
  os: "Android" | "AndroidXR" | "iOS" | "VisionOS" | "HorizonOS";
  isWeb: boolean;
};
