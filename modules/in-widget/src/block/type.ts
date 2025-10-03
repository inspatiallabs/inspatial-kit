import type { JSX } from "@in/runtime/types";
import type { BlockIProps } from "./i/type.ts";
import type { BlockIIProps } from "./ii/type.ts";
import type { BlockIIIProps } from "./iii/type.ts";

//##############################################(TYPES)##############################################//
export type BlockProps = JSX.SharedProps & {
  format?: "i" | "ii" | "iii";
  variant: BlockIProps | BlockIIProps | BlockIIIProps;
};
