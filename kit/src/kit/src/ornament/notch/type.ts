import type { StyleProps } from "@in/style";
import { NotchStyle } from "./style.ts";

/*########################################(TYPE)########################################*/
export type NotchProps = StyleProps<typeof NotchStyle> &
  JSX.SharedProps & {
    variant?: "sharp" | "island";
    direction?: "left" | "right" | "down" | "up";
  };
