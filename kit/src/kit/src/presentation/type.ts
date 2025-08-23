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

export type ModalOverlayProps = StyleProps<typeof ModalStyle.overlay> &
  JSX.SharedProps & {
    display?: boolean;
  };

export type ModalWrapperProps = StyleProps<typeof ModalStyle.wrapper> &
  JSX.SharedProps & {};

export type ModalContentProps = StyleProps<typeof ModalStyle.content> &
  JSX.SharedProps & {
    format?: "base" | "delete" | "project";
  };

export type ModalProps = StyleProps<typeof ModalStyle> &
  PresentationProps &
  JSX.SharedProps & {
    overlay?: ModalOverlayProps;
    wrapper?: ModalWrapperProps;
    content?: ModalContentProps;
  };
