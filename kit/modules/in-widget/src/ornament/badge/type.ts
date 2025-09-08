import type { StyleProps } from "@in/style/index.ts";
import type { BadgeStyle } from "./style.ts";

//##############################################(BADGE TYPE)##############################################//

export type BadgeProps = StyleProps<typeof BadgeStyle> & JSX.SharedProps;
