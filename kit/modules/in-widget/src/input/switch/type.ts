import type { StyleProps } from "@in/style";
import type { SwitchStyle } from "./style.ts";

/*#################################(SWITCH)#################################*/

export type SwitchProps = StyleProps<typeof SwitchStyle.wrapper> &
  JSX.SharedProps & {
    checked?: boolean;
    disabled?: boolean;
    defaultChecked?: boolean;
    onChange?: (checked: boolean) => void;
    "on:change"?: (event: any) => void;
    "on:input"?: (event: any) => void;
  };
