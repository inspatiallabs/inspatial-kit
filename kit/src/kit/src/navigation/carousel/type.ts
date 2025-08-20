import type { StyleProps } from "@in/style";
import type { CarouselStyle } from "./style.ts";

/*#################################(TYPES)#################################*/
export type CarouselProps = StyleProps<typeof CarouselStyle> &
  JSX.SharedProps & {
    empty?: {
      isEmpty: boolean;
      slot: string | JSX.SharedProps["children"];
    };
  };
