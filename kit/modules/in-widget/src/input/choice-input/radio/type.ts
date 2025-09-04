import type { StyleProps } from "@in/style";
import type { RadioStyle } from "./style.ts";

/*#################################(RADIO)#################################*/

type RadioIndicatorProps = StyleProps<typeof RadioStyle.indicator>;

export type RadioProps = StyleProps<typeof RadioStyle.wrapper> &
  JSX.SharedProps & {
    checked?: boolean;
    defaultChecked?: boolean;
    name?: string;
    value?: string | number;
    format?: RadioIndicatorProps["format"];
    size?: RadioIndicatorProps["size"];
    radius?: RadioIndicatorProps["radius"];
  };
