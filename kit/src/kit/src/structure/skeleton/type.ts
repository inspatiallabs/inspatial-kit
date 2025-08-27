import type { StyleProps } from "@in/style";
import type { SkeletonStyle } from "./style.ts";

export type SkeletonProps = StyleProps<typeof SkeletonStyle> & JSX.SharedProps;
