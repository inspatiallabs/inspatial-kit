import type { StyleProps } from "@in/style";
import type { SwitchStyle } from "./style.ts";
import type { ChoiceInputProps } from "../type.ts";

/*#################################(SWITCH)#################################*/

export type SwitchWrapperProps = StyleProps<typeof SwitchStyle.wrapper>;
export type SwitchInputProps = StyleProps<typeof SwitchStyle.input>;
export type SwitchTrackProps = StyleProps<typeof SwitchStyle.track>;
export type SwitchHandleProps = StyleProps<typeof SwitchStyle.handle>;

export type SwitchProps = StyleProps<typeof SwitchStyle.wrapper> &
  JSX.SharedProps & {
    checked?: boolean;
    defaultChecked?: boolean;
    size?: SwitchTrackProps["size"];
    radius?: SwitchTrackProps["radius"];
    icon?: ChoiceInputProps["icon"];
  };
