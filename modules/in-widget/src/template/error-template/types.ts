import type { StyleProps } from "@in/style";
import type { ErrorTemplateStyle } from "./style.ts";
import type { JSX } from "@in/runtime";

/*########################(ERROR TEMPLATE PROPS)########################*/
export type ErrorTemplateProps = StyleProps<typeof ErrorTemplateStyle.root> &
  JSX.SharedProps & {
    header?: string | JSX.Element;
    message?: string | JSX.Element;
    description?: string | JSX.Element;
    actionText?: string;
    onAction?: () => void;
    showIcon?: boolean;
  };
