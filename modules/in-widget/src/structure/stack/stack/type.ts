import type { StyleProps } from "@in/style";
import type { StackStyle } from "./style.ts";
import type { JSX } from "@in/runtime/types";

//##############################################(TYPES)##############################################//

export type StackProps = StyleProps<typeof StackStyle> &
  JSX.SharedProps & {
    wrap?: JSX.ISSProps["flexWrap"];
    justify?: JSX.ISSProps["justifyContent"];
    align?: JSX.ISSProps["alignItems"];
    gap?: JSX.ISSProps["gap"];
  };

// export const StackPropsClass = StackStyle.getStyle({
//   variant: "xStack",
//   disabled: false,
// });
