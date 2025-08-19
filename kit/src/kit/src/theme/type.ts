import type { StyleProps } from "@in/style";
import type { ThemeStyle } from "./style.ts";

//##############################################(TYPES)##############################################//

export type ThemeProps = StyleProps<typeof ThemeStyle> & JSX.SharedProps & {};
