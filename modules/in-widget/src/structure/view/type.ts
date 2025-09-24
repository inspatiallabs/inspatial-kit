import type { StyleProps } from "@in/style";
import type { ViewStyle } from "./style.ts";

/*###################################(TYPES)###################################*/
type ViewAnimation = "none" | "fade" | "fadeUp" | "scale";

export type ViewProps = StyleProps<typeof ViewStyle> &
  JSX.SharedProps & {
    animate?: ViewAnimation;
    duration?: number;
    delay?: number;
    preserveChildren?: boolean;
    axis?: "x" | "y" | "both";
  };
