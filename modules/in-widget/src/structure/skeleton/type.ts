import type { StyleProps } from "@in/style";
import type { SkeletonStyle } from "./style.ts";
import type { JSX } from "@in/runtime/types";

export type SkeletonProps = StyleProps<typeof SkeletonStyle> & JSX.SharedProps;
