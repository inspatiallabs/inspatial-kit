import type { JSX } from "@in/runtime/types";
import type { StyleProps } from "@in/style";
import type { PresentationOverlayProps, PresentationProps } from "../type.ts";
import type { ModalStyle } from "./style.ts";

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
    backdrop?: ModalOverlayProps["backdrop"];
  };

export type ModalProps = ModalPropsTree | ModalPropsDirect;
