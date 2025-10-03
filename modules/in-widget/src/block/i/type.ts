import type { ButtonProps } from "@in/widget/ornament/button/type.ts";
import type { CheckboxProps } from "@in/widget/input/checkbox/type.ts";
import type { AvatarProps } from "@in/widget/ornament/avatar/type.ts";
import type { StyleProps } from "@in/style";
import type { BlockIStyle } from "./style.ts";

//##############################################(TYPES)##############################################//

export type BlockIProps = StyleProps<typeof BlockIStyle> & {
  children?: {
    button?: ButtonProps | ButtonProps[];
    checkbox?: CheckboxProps | CheckboxProps[];
    avatar?: AvatarProps | AvatarProps[];
  };
};
