import type { ITypographyProps, StyleProps } from "@in/style";
import type { TypographyStyle } from "./style.ts";

//##############################################(TYPES)##############################################//

type AnimationStyleType =
  | "none"
  | "fadeUp"
  | "fadeIn"
  | "reveal"
  | "typing"
  | "fadeInContainer"
  | "fadeUpContainer";

export type TypographyProps = StyleProps<typeof TypographyStyle.variant> &
  JSX.SharedProps &
  ITypographyProps & {
    words?: string | string[];
    duration?: number;
    delay?: number;
    animate?: AnimationStyleType;
  };
