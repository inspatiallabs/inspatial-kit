import type { StyleProps } from "@in/style";
import type { IconStyle } from "./style.ts";
import type { JSX } from "@in/runtime/types";

//##############################################(TYPES)##############################################//
export type IconProps = StyleProps<typeof IconStyle> & JSX.SharedProps;
