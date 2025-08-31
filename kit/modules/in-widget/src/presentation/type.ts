import type { StyleProps } from "@in/style";
import type { DrawerStyle, ModalStyle, PresentationStyle } from "./style.ts";

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

/*#################################(MODAL TYPES)#################################*/

/******************************(Overlay)******************************/

export type ModalOverlayProps = PresentationOverlayProps;

/******************************(Wrapper)******************************/

export type ModalWrapperProps = StyleProps<typeof ModalStyle.wrapper> &
  JSX.SharedProps &
  Record<PropertyKey, never>;

/******************************(View)******************************/

export type ModalViewProps = StyleProps<typeof ModalStyle.view> &
  JSX.SharedProps & {
    format?:
      | "base"
      | "share"
      | "delete-confimation"
      | "project-creator"
      | "account-switcher";
  };

/******************************(Modal)******************************/
type ModalChildrenTree = {
  wrapper?: ModalWrapperProps;
  overlay?: ModalOverlayProps;
  view?: ModalViewProps | ModalViewProps[];
};

type ModalPropsTree = StyleProps<typeof ModalStyle.wrapper> &
  PresentationProps & {
    id: string;
    children?: ModalChildrenTree;
  };

type ModalPropsDirect = StyleProps<typeof ModalStyle.wrapper> &
  ModalViewProps & {
    id: string;
    children?: ModalChildrenTree;
    format?: ModalViewProps["format"];
    overlayFormat?: ModalOverlayProps["overlayFormat"];
  };

export type ModalProps = ModalPropsTree | ModalPropsDirect;

/*#################################(DRAWER TYPES)#################################*/

/******************************(Overlay)******************************/

export type DrawerOverlayProps = PresentationOverlayProps;

/******************************(Drawer)******************************/

export type DrawerProps = StyleProps<typeof DrawerStyle.view> &
  JSX.SharedProps &
  PresentationProps & {
    id: string;
    overlayFormat?: StyleProps<
      typeof PresentationStyle.overlay
    >["overlayFormat"];
  };
