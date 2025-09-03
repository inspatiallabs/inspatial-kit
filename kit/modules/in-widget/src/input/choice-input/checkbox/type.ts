import type { StyleProps } from "@in/style";
import type { CheckboxStyle } from "./style.ts";

/*#################################(CHECKBOX)#################################*/

export type CheckboxProps = StyleProps<typeof CheckboxStyle.wrapper> &
  JSX.SharedProps & {
    checked?: boolean | "indeterminate";
    disabled?: boolean;
  };
