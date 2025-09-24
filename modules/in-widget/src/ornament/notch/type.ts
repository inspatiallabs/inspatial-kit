import type { StyleProps } from "@in/style";
import type { NotchStyle } from "./style.ts";
import type { JSX } from "@in/runtime/types";

/*########################################(TYPE)########################################*/
export type NotchProps = StyleProps<typeof NotchStyle> &
  JSX.SharedProps & {
    variant?: "sharp" | "island";
    direction?: "left" | "right" | "down" | "up";
  };
