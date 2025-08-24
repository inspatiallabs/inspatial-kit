import type { StyleProps } from "@in/style";
import type { ModalStyle, PresentationStyle } from "./style.ts";

/*#################################(PRESENTATION TYPES)#################################*/

export type PresentationProps = StyleProps<typeof PresentationStyle> &
  JSX.SharedProps & {
    open?: boolean;
    defaultOpen?: boolean;
    closeOnEsc?: boolean;
    closeOnScrim?: boolean;
  };

/*#################################(MODAL TYPES)#################################*/

/******************************(Overlay)******************************/

export type ModalOverlayProps = StyleProps<typeof ModalStyle.overlay> &
  JSX.SharedProps & {
    display?: boolean;
  };

/******************************(Wrapper)******************************/

export type ModalWrapperProps = StyleProps<typeof ModalStyle.wrapper> &
  JSX.SharedProps & {};

/******************************(View)******************************/

export type ModalViewProps = StyleProps<typeof ModalStyle.view> &
  JSX.SharedProps & {
    format?: "base" | "delete-confimation" | "project-creator" | "account-switcher";
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
  PresentationProps & {
    id: string;
    children?: ModalChildrenTree;
    format?: ModalViewProps["format"];
  };

export type ModalProps = ModalPropsTree | ModalPropsDirect;
