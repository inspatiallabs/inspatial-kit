import type { StyleProps } from "@in/style";
import type { AvatarStyle } from "./style.ts";
import type { JSX } from "@in/runtime/types";

/*#################################(AVATAR PROPS)#################################*/
export type AvatarProps = StyleProps<typeof AvatarStyle> &
  JSX.SharedProps & {
    colorCast?: string;
    format?: "initials" | "memoji" | "inmoji" | "photo";
    initials?: string;
    src?: string;
    hasAIBadge?: boolean;
    realtime?: boolean;
    position?: { x: number; y: number };
  };
