import type { StyleProps } from "@in/style";
import type { DockStyle } from "./style.ts";
import type { PresentationProps } from "../type.ts";
import type { IconProps } from "../../icon/type.ts";
import type { TypographyProps } from "../../typography/text/type.ts";

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

export type DockProps = StyleProps<typeof DockStyle> &
  PresentationProps & {
    id: string;
    axis?: "x" | "y";
    minimized?: boolean;
    toggle?: {
      type?: "Minimize" | "Close";
      display?: boolean;
    };
    children?: DockChildrenTree;
  };

/*#################################(TYPES)#################################*/

export type DockItemsProps = JSX.SharedProps & {
  axis?: "x" | "y";
};

export type DockItemProps = JSX.SharedProps & {
  "on:tap"?: () => void;
};

export type DockIconProps = JSX.SharedProps;

export type DockLabelProps = JSX.SharedProps & {
  showOnHover?: boolean;
};
