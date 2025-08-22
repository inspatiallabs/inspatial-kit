import type { StyleProps } from "@in/style";
import { ButtonStyle } from "./style.ts";

//##############################################(TYPES)##############################################//

export type ButtonProps = StyleProps<typeof ButtonStyle> &
  JSX.SharedProps & {
    isLoading?: boolean;
    loadingText?: string;
    label?: string; // text label to display
  };

export const ButtonStyleClass = ButtonStyle.getStyle({
  format: "base",
  variant: "base",
  size: "base",
});
