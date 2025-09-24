import type { JSX } from "@in/runtime/types";

/*################################(LINK TYPES)################################*/

export interface LinkProps extends JSX.SharedProps {
  to: string;
  params?: Record<string, string>;
  query?: Record<string, string>;
  replace?: boolean;
  prefetch?: boolean;
  modeOverride?: "spa" | "mpa";
  protect?: () => boolean | string | Promise<boolean | string>;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: "external" | "noopener" | "noreferrer";
  download?: string | boolean;
}
