import type { StyleProps } from "@in/style";
import type { CarouselStyle } from "./style.ts";
import type { JSX } from "@in/runtime/types";

/*#################################(TYPES)#################################*/
export type CarouselProps = StyleProps<typeof CarouselStyle> &
  JSX.SharedProps & {
    empty?: {
      isEmpty: boolean;
      slot: string | JSX.SharedProps["children"];
    };
  };
