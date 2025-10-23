import type { StyleProps } from "@in/style";
import type { SwitchStyle } from "./style.ts";
import type { ChoiceInputProps } from "../type.ts";
import type { JSX } from "@in/runtime/types";
import type { IconProps } from "@in/widget/icon/type.ts";

/*#################################(SWITCH)#################################*/

export type SwitchWrapperProps = StyleProps<typeof SwitchStyle.wrapper>;
export type SwitchInputProps = StyleProps<typeof SwitchStyle.input>;
export type SwitchTrackProps = StyleProps<typeof SwitchStyle.track>;
export type SwitchHandleProps = StyleProps<typeof SwitchStyle.handle>;
export type SwitchIconProps = StyleProps<typeof SwitchStyle.icon> & IconProps;

export type SwitchProps = StyleProps<typeof SwitchStyle.wrapper> &
  Omit<JSX.SharedProps, "children"> & {
    selected?: boolean;
    defaultSelected?: boolean;
    size?: SwitchTrackProps["size"];
    radius?: SwitchTrackProps["radius"];
    /**
     * @default "brand"
     * Available icons: "ball", "tick", "cross", "brand", "dash"
     */
    icon?: ChoiceInputProps["icon"];
    children?: {
      /**
       * Track is the part that the handle moves on
       */
      track?: SwitchTrackProps;
      /**
       * Handle is the part that moves when the switch is toggled
       */
      handle?: SwitchHandleProps;
      icon?: SwitchIconProps;
    };
  };
