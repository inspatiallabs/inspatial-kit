import type { StyleProps } from "@in/style";
import type { TabStyle } from "./style.ts";

/*#################################(TAB WRAPPER)#################################*/

export type TabWrapperProps = StyleProps<typeof TabStyle.wrapper> &
  JSX.SharedProps & {};

export type TabWrapperStyleProps = StyleProps<typeof TabStyle.wrapper>;
export type TabTriggerStyleProps = StyleProps<typeof TabStyle.trigger>;
export type TabLabelStyleProps = StyleProps<typeof TabStyle.label>;
export type TabInputStyleProps = StyleProps<typeof TabStyle.input>;

/*#################################(TAB TRIGGER)#################################*/

export type TabTriggerProps = StyleProps<typeof TabStyle.trigger> &
  JSX.SharedProps & {
    value: string;
    selected?: boolean;
    defaultSelected?: boolean;
    onChange?: (selected: boolean) => void;
  };
