import type { StyleProps } from "@in/style";
import type { ButtonStyle } from "./style.ts";

//##############################################(TYPES)##############################################//

export type ButtonProps = StyleProps<typeof ButtonStyle> &
  JSX.SharedProps & {
    isLoading?: boolean;
    loadingText?: string;
    label?: string; // text label to display
  };
