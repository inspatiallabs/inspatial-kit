import type { StyleProps } from "@in/style";
import type { DockStyle } from "./style.ts";
import type { PresentationProps, PresentationToggleConfig } from "../type.ts";
import type { PresentationStyle } from "../style.ts";
import type { IconProps } from "@in/widget/icon/type.ts";
import type { TypographyProps } from "@in/widget/typography/text/type.ts";

/*#################################(DOCK ITEM CONFIG)#################################*/

export type DockItemConfig = {
  icon: IconProps | JSX.SharedProps["children"];
  label?: TypographyProps;
  on?: Record<string, any> | JSX.TriggerPropKey;
  className?: JSX.SharedProps["className"];
  key?: string | number;
};

/*#################################(DOCK CHILDREN TREE)#################################*/

export type DockChildrenTree = {
  items?: DockItemConfig[];
  customToggle?: JSX.SharedProps["children"];
};

/*#################################(DOCK PROPS)#################################*/

export type DockProps = StyleProps<typeof DockStyle.view> &
  PresentationProps & {
    id: string;
    direction?: "top" | "bottom" | "left" | "right";
    axis?: "x" | "y";
    overlayFormat?: StyleProps<
      typeof PresentationStyle.overlay
    >["overlayFormat"];
    minimized?: boolean;
    toggle?: PresentationToggleConfig;
    children?: DockChildrenTree;
  };

/*#################################(TYPES)#################################*/

export type DockItemsProps = JSX.SharedProps & {
  axis?: "x" | "y";
};

export type DockItemProps = JSX.SharedProps;

export type DockIconProps = JSX.SharedProps;

export type DockLabelProps = JSX.SharedProps;
