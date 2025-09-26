import type { StyleProps } from "@in/style";
import type { PresentationStyle } from "./style.ts";
import type { JSX } from "@in/runtime/types";

/*#################################(PRESENTATION TYPES)#################################*/

export type PresentationToggleMode = "minimize" | "close";

export type PresentationToggleConfig = {
  modes: PresentationToggleMode[] | "none";
  placement?: "start" | "end";
  layout?: "inline" | "split";
  icon?: {
    minimize?: JSX.SharedProps["children"];
    close?: JSX.SharedProps["children"];
    maximize?: JSX.SharedProps["children"];
  };
  label?: "auto" | "always" | "never";
  on?: {
    minimize?: Record<string, any>;
    close?: Record<string, any>;
  };
};

export type PresentationProps = StyleProps<typeof PresentationStyle.base> &
  JSX.SharedProps & {
    open?: boolean;
    defaultOpen?: boolean;
    closeOnEsc?: boolean;
    closeOnScrim?: boolean;
    toggle?: PresentationToggleConfig;
  };

/******************************(Overlay)******************************/

export type PresentationOverlayProps = StyleProps<
  typeof PresentationStyle.overlay
> &
  JSX.SharedProps & {
    display?: boolean;
  };
