import type { JSX } from "@in/runtime/types";
import type { StyleProps } from "@in/style";
import type { PresentationOverlayProps, PresentationProps } from "../type.ts";
import type { PopoverStyle } from "./style.ts";

/*#################################(Popover TYPES)#################################*/

/******************************(Overlay)******************************/

export type PopoverOverlayProps = PresentationOverlayProps;

/******************************(Wrapper)******************************/

export type PopoverWrapperProps = StyleProps<typeof PopoverStyle.wrapper> &
  JSX.SharedProps &
  Record<PropertyKey, never>;

/******************************(View)******************************/

export type PopoverViewProps = StyleProps<typeof PopoverStyle.view> &
  JSX.SharedProps & {
    align?: "start" | "center" | "end";
    arrow?: boolean;
  };

/******************************(Popover)******************************/
type PopoverChildrenTree = {
  wrapper?: PopoverWrapperProps;
  overlay?: PopoverOverlayProps;
  view?: PopoverViewProps | PopoverViewProps[];
};

type PopoverPropsTree = StyleProps<typeof PopoverStyle.wrapper> &
  PresentationProps & {
    id: string;
    children?: PopoverChildrenTree;
  };

type PopoverPropsDirect = StyleProps<typeof PopoverStyle.wrapper> &
  PopoverViewProps & {
    id: string;
    children?: PopoverChildrenTree;
    format?: PopoverViewProps["format"];
    backdrop?: PopoverOverlayProps["backdrop"];
    offset?: PopoverViewProps["offset"];
  };

export type PopoverProps = PopoverPropsTree | PopoverPropsDirect;
