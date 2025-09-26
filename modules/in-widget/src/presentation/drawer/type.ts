import type { JSX } from "@in/runtime/types";
import type { StyleProps } from "@in/style";
import type { PresentationStyle } from "../style.ts";
import type { PresentationOverlayProps, PresentationProps } from "../type.ts";
import type { DrawerStyle } from "./style.ts";

/*#################################(DRAWER TYPES)#################################*/

/******************************(Overlay)******************************/

export type DrawerOverlayProps = PresentationOverlayProps;

/******************************(Drawer)******************************/

export type DrawerProps = StyleProps<typeof DrawerStyle.view> &
  JSX.SharedProps &
  PresentationProps & {
    id: string;
    backdrop?: StyleProps<typeof PresentationStyle.overlay>["backdrop"];
  };
