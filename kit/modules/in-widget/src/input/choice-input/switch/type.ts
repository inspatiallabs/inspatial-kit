import type { StyleProps } from "@in/style";
import type { SwitchStyle } from "./style.ts";
import type { ChoiceInputProps } from "../type.ts";

/*#################################(SWITCH)#################################*/

export type SwitchWrapperProps = StyleProps<typeof SwitchStyle.wrapper>;
export type SwitchInputProps = StyleProps<typeof SwitchStyle.input>;
export type SwitchTrackProps = StyleProps<typeof SwitchStyle.track>;
export type SwitchHandleProps = StyleProps<typeof SwitchStyle.handle>;
export type SwitchIconProps = StyleProps<typeof SwitchStyle.icon>;

export type SwitchProps = StyleProps<typeof SwitchStyle.wrapper> &
  // NOTE: Omiting children from JSX.SharedProps to prevent icon type inaccessibility
  Omit<JSX.SharedProps, "children"> & {
    checked?: boolean;
    defaultChecked?: boolean;
    size?: SwitchTrackProps["size"];
    radius?: SwitchTrackProps["radius"];
    /**
     * @default "brand"
     * Available icons: "ball", "tick", "cross", "brand", "dash"
     */
    icon?: ChoiceInputProps["icon"];
    children?: JSX.SharedProps["children"]; // Do not remove manual passing of children
  };
