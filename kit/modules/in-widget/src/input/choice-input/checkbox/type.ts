import type { StyleProps } from "@in/style";
import type { CheckboxStyle } from "./style.ts";

/*#################################(CHECKBOX)#################################*/

export type CheckboxProps = StyleProps<typeof CheckboxStyle.wrapper> &
  JSX.SharedProps & {
    checked?: boolean | "indeterminate";
    disabled?: boolean;
    icon?:
      | "ball"
      | "tick"
      | "cross"
      | "brand"
      | "dash"
      | JSX.SharedProps["children"]
      | ((state: { isSelected: boolean; isIndeterminate: boolean }) => any);
  };
