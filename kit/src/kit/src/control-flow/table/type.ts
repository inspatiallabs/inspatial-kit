import type { StyleProps } from "@in/style";
import type { TableStyle } from "./style.ts";

export type TableProps = StyleProps<typeof TableStyle> & JSX.SharedProps;
