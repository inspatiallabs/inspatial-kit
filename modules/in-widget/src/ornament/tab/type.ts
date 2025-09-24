import type { StyleProps } from "@in/style";
import type { TabStyle } from "./style.ts";
import type { JSX } from "@in/runtime/types";

/*#################################(TAB ITEM PROPS)#################################*/

export type TabItemProps = JSX.SharedProps & {
  label: string;
  /**
   * Optional explicit value. If omitted, the component derives a deterministic value from label.
   * Use when you need to distinguish between tabs with the same label.
   * e.g when your tab item is an icon and you need to distinguish between tabs with the same icon.
   */
  value?: string;
  to?: string;
  icon?: JSX.Element;
};

/*#################################(TAB ROOT PROPS)#################################*/

type TabRootProps = StyleProps<typeof TabStyle.root>;

/*#################################(TAB ANCHOR PROPS)#################################*/

type TabAnchorProps = StyleProps<typeof TabStyle.anchor>;

/*#################################(TAB PROPS)#################################*/

export type TabProps = TabRootProps &
  JSX.SharedProps & {
    children?: TabItemProps[];

    selected?: string;
    defaultSelected?: string;

    // Commented out [Rationale]: The anatomy of a tab make this feel like cognitive load relative to a Radio Group which thrives on having these.
    // onChange?: (value: string) => void;
    // name?: string; // Optional name for the tab group

    format?: TabAnchorProps["format"];
    scale?: TabAnchorProps["scale"];
    size?: TabAnchorProps["size"];
    radius?: TabAnchorProps["radius"];
  };
