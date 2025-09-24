import type { StyleProps } from "@in/style/variant/index.ts";
import type { FPSStyle } from "./style.ts";

/*###################################(PROPS)###################################*/
export type FPSProps = StyleProps<typeof FPSStyle> &
  JSX.SharedProps & {
    /**
     * Update every N frames (default: 10)
     */
    updateEvery?: number;
  };
