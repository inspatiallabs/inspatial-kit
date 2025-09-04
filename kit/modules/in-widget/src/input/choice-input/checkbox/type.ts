import type { StyleProps } from "@in/style";
import type { CheckboxStyle } from "./style.ts";

/*#################################(CHECKBOX)#################################*/

type CheckboxIndicatorProps = StyleProps<typeof CheckboxStyle.indicator>;

export type CheckboxProps = StyleProps<typeof CheckboxStyle.wrapper> &
  JSX.SharedProps & {
    checked?: boolean | "indeterminate";
    format?: CheckboxIndicatorProps["format"];
    size?: CheckboxIndicatorProps["size"];
    radius?: CheckboxIndicatorProps["radius"];
  };
