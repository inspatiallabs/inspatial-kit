import type { StyleProps } from "@in/style";
import type { ThemeStyle, ThemeFormat } from "./style.ts";

/*##############################################(THEME SPEC)##############################################*/

export interface ThemeSpec {
  root: Record<string, string>;
  [variant: string]: any;
  attr?: string;
}

/*##############################################(THEME VARIANT)##############################################*/

export interface ThemeVariant {
  name: typeof ThemeFormat | string;
  light?: {
    brand?: string;
    background?: string;
    surface?: string;
    primary?: string;
    secondary?: string;
    muted?: string;
    window?: string;
  };
  dark?: {
    brand?: string;
    background?: string;
    surface?: string;
    primary?: string;
    secondary?: string;
    muted?: string;
    window?: string;
  };
}

//##############################################(THEME PROPS)##############################################//

export type ThemeProps = StyleProps<typeof ThemeStyle> & ThemeVariant;
