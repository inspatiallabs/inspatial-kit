import type { StyleProps } from "@in/style";
import type { TabStyle } from "./style.ts";

/*#################################(TAB ITEM PROPS)#################################*/

export type TabItemProps = JSX.SharedProps & {
  label: string;
  /**
   * Optional explicit value. If omitted, the component derives a deterministic value from label.
   */
  value?: string;
  to?: string;
  icon?: JSX.Element;
};

/*#################################(TAB ROOT PROPS)#################################*/

type TabRootProps = StyleProps<typeof TabStyle.root>;

/*#################################(TAB TRIGGER PROPS)#################################*/

type TabTriggerProps = StyleProps<typeof TabStyle.trigger>;

/*#################################(TAB PROPS)#################################*/

export type TabProps = TabRootProps &
  JSX.SharedProps & {
    children?: TabItemProps[];

    selected?: string;
    defaultSelected?: string;

    // Commented out [Rationale]: The anatomy of a tab make this feel like cognitive load relative to a Radio Group which thrives on having these.
    // onChange?: (value: string) => void;
    // name?: string; // Optional name for the tab group

    format?: TabTriggerProps["format"];
    scale?: TabTriggerProps["scale"];
    size?: TabTriggerProps["size"];
    radius?: TabTriggerProps["radius"];
  };
