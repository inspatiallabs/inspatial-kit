import type { SignalValueType } from "@in/teract/signal";
import type { JSX } from "@in/runtime/types";

export interface ListProps<T = any> {
  name?: string;
  each: SignalValueType<T[]> | T[]; // Accept both signals and static arrays
  track?: SignalValueType<keyof T>;
  indexed?: boolean;
  unkeyed?: boolean;
  children?: JSX.SharedProps["children"]
}
