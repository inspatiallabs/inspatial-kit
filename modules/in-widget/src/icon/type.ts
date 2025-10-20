import type { StyleProps } from "@in/style";
import type { IconStyle } from "./style.ts";
import type { JSX } from "@in/runtime/types";
import type { IconVariant } from "./icon-variants.generated.d.ts";

//##############################################(TYPES)##############################################//
export type IconProps = StyleProps<typeof IconStyle> &
  JSX.SharedProps & {
    variant: IconVariant;
  };
