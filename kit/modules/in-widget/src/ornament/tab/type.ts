import type { StyleProps } from "@in/style";
import type { TabStyle } from "./style.ts";

/*#################################(TAB ITEM PROPS)#################################*/

export type TabItemProps = JSX.SharedProps & {
  label: string;
  value: string;
  to?: string;
  icon?: JSX.Element;
};

/*#################################(TAB PROPS)#################################*/

type TabWrapperProps = StyleProps<typeof TabStyle.wrapper>;
type TabTriggerProps = StyleProps<typeof TabStyle.trigger>;

export type TabProps = TabWrapperProps &
  JSX.SharedProps & {
    children?: TabItemProps[];
    selected?: string;

    format?: TabTriggerProps["format"];
    size?: TabTriggerProps["size"];
    radius?: TabTriggerProps["radius"];
  };
