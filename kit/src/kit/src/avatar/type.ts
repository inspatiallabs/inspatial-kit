import type { StyleProps } from "@in/style";
import type { AvatarStyle } from "./style.ts";

export interface AvatarProps
  extends StyleProps<typeof AvatarStyle>,
    JSX.SharedProps {
  colorCast?: string;
  format?: "initials" | "memoji" | "inmoji" | "photo";
  initials?: string;
  src?: string;
  hasAIBadge?: boolean;
  realtime?: boolean;
  position?: { x: number; y: number };
}
