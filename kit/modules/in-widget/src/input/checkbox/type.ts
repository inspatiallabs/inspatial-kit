import type { StyleProps } from "@in/style";
import type { CheckboxStyle } from "./style.ts";

//##############################################(ROOT)##############################################//
export type CheckboxRootProps = StyleProps<typeof CheckboxStyle.root> &
  JSX.SharedProps & {
    checked?: boolean | "indeterminate";
  };

//##############################################(INDICATOR)##############################################//
export type CheckboxIndicatorProps = StyleProps<
  typeof CheckboxStyle.indicator
> &
  JSX.SharedProps;

//##############################################(CHECKBOX)##############################################//
export type CheckboxProps = StyleProps<typeof CheckboxStyle.wrapper> &
  JSX.SharedProps & {
    checked?: boolean | "indeterminate";
  };
