import type { StyleProps } from "@in/style";
import type { RadioStyle } from "./style.ts";
import type { JSX } from "@in/runtime/types";

/*#################################(RADIO)#################################*/

type RadioIndicatorProps = StyleProps<typeof RadioStyle.indicator>;

export type RadioProps = StyleProps<typeof RadioStyle.wrapper> &
  JSX.SharedProps & {
    selected?: boolean;
    defaultSelected?: boolean;
    name?: string;
    value?: string | number;
    format?: RadioIndicatorProps["format"];
    size?: RadioIndicatorProps["size"];
    radius?: RadioIndicatorProps["radius"];
  };
