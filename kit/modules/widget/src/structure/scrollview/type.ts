import type { StyleProps } from "@in/style";
import type { ScrollViewStyle } from "./style.ts";

/*###################################(TYPES)###################################*/
type ScrollAnimation = "none" | "fade" | "fadeUp" | "scale";

export type ScrollViewProps = StyleProps<typeof ScrollViewStyle> &
  JSX.SharedProps & {
    animate?: ScrollAnimation;
    duration?: number;
    delay?: number;
    preserveChildren?: boolean;
    axis?: "x" | "y" | "both";
  };
