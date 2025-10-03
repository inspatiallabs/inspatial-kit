import type { StyleProps } from "@in/style";
import type { BlockIIStyle } from "./style.ts";
import type { TabProps } from "@in/widget/ornament/tab/type.ts";

//##############################################(TYPES)##############################################//
export type BlockIIProps = StyleProps<typeof BlockIIStyle> & {
  children?: {
    tab?: TabProps;
  };
};
