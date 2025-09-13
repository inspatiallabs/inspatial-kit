import type { StyleProps } from "@in/style";
import type { CheckboxStyle } from "./style.ts";
import type { ChoiceInputProps } from "../type.ts";

/*#################################(CHECKBOX)#################################*/

export type CheckboxIndicatorProps = StyleProps<
  typeof CheckboxStyle.indicator.default
>;

export type CheckboxProps = StyleProps<typeof CheckboxStyle.wrapper> &
  JSX.SharedProps & {
    selected?: boolean | "indeterminate";
    format?: CheckboxIndicatorProps["format"];
    /**
     * @default "default"
     * Toggle shows an initial icon
     * Default shows the icon only when selected
     */
    type?: "default" | "toggle";
    size?: CheckboxIndicatorProps["size"];
    radius?: CheckboxIndicatorProps["radius"];
    icon?: ChoiceInputProps["icon"] | null;
    display?: boolean;
  };
