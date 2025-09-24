import type { ITypographyProps, StyleProps } from "@in/style";
import type { TypographyStyle } from "./style.ts";
import type { JSX } from "@in/runtime/types";

//##############################################(TYPES)##############################################//

type AnimationStyleType =
  | "none"
  | "fadeUp"
  | "fadeIn"
  | "reveal"
  | "typing"
  | "fadeInContainer"
  | "fadeUpContainer";

export type TypographyProps = StyleProps<typeof TypographyStyle.getStyle> &
  JSX.SharedProps &
  ITypographyProps & {
    words?: string | string[];
    duration?: number;
    delay?: number;
    animate?: AnimationStyleType;
  };
