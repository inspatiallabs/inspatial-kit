import type { StyleProps } from "@in/style";
import type { BlockIIIStyle } from "./style.ts";
import type { SwitchProps } from "@in/widget/input/choice-input/switch/type.ts";
import type { ButtonProps } from "@in/widget/ornament/button/type.ts";
import type { CheckboxProps } from "@in/widget/input/choice-input/checkbox/type.ts";

//##############################################(TYPES)##############################################//
export type BlockIIIProps = StyleProps<typeof BlockIIIStyle> & {
  children?: {
    switch: SwitchProps | SwitchProps[];
    button: ButtonProps | ButtonProps[];
    checkbox: CheckboxProps | CheckboxProps[];
  };
};
