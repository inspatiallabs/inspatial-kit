import type { StyleProps } from "@in/style";
import type { SidebarStyle } from "./style.ts";
import type { RadioProps } from "@in/widget/input/choice-input/radio/type.ts";
import type { LinkProps } from "@in/widget/navigation/link/index.ts";

/*################################(Base Types)################################*/

export interface SidebarMenuItem {
  id: string;
  title: string;
  icon?: JSX.Element;
  route?: string;
  disabled?: boolean;
  group?: string;
  isParent?: boolean;
}

/*################################(Component Props)################################*/

type SidebarSizeProps = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

// Main Sidebar Props
export type SidebarProps = JSX.SharedProps &
  StyleProps<typeof SidebarStyle.wrapper> & {
    minimized?: boolean;
    defaultMinimized?: boolean;
    onMinimizeChange?: (minimized: boolean) => void;
    children?: JSX.Element | JSX.Element[];
    showToggle?: boolean;

    // Size configuration for different states
    minimizedSize?: SidebarSizeProps;
    expandedSize?: SidebarSizeProps;
  };

// Sidebar Group Props (collapsible parent items)
export type SidebarGroupProps = JSX.SharedProps &
  StyleProps<typeof SidebarStyle.group> & {
    id: string;
    title: string;
    icon?: JSX.Element;
    defaultExpanded?: boolean;
    expanded?: boolean;
    onExpandChange?: (expanded: boolean) => void;
  };

// Radio props for selection items
type SidebarRadioProps = Pick<RadioProps,
  | "selected"
  | "defaultSelected" 
  | "name"
  | "value"
>;

// Sidebar Item Props (unified API for Link and Radio anatomies)
export type SidebarItemProps = JSX.SharedProps &
  StyleProps<typeof SidebarStyle.item> & 
  Partial<LinkProps> &
  Partial<SidebarRadioProps> & {
    // Common props
    icon?: JSX.Element;
    children?: JSX.Element | JSX.Element[];
    disabled?: boolean;
    
    // Navigation-specific
    activeMatch?: "exact" | "prefix" | "custom";
    isActive?: (currentRoute: string) => boolean;
    
    // Manual control (current behavior)
    onClick?: () => void;
    
    // Event handlers (Tab/Radio pattern)
    onChange?: (value: string | number | boolean) => void;
  };

// Sidebar Toggle Button Props
export type SidebarToggleProps = JSX.SharedProps &
  StyleProps<typeof SidebarStyle.toggle> & {
    minimized?: boolean;
    onToggle?: () => void;
    position?: "top" | "bottom" | "floating";
    icon?: {
      expand?: JSX.Element;
      collapse?: JSX.Element;
    };
  };

// Sidebar Section Props (for grouping items without collapsibility)
export type SidebarSectionProps = JSX.SharedProps &
  StyleProps<typeof SidebarStyle.section> & {
    title?: string;
    divider?: boolean;
  };

// Sidebar Header Props
export type SidebarHeaderProps = JSX.SharedProps &
  StyleProps<typeof SidebarStyle.header> & {
    logo?: JSX.Element;
    title?: string;
    subtitle?: string;
    minimized?: boolean;
  };

// Sidebar Footer Props
export type SidebarFooterProps = JSX.SharedProps &
  StyleProps<typeof SidebarStyle.footer> & {
    minimized?: boolean;
  };

// Active Indicator (Pluck) Props
export type SidebarPluckProps = StyleProps<typeof SidebarStyle.pluck> & {
  active: boolean;
  minimized?: boolean;
  layoutId?: string;
};

/*################################(Configuration Types)################################*/

export interface SidebarConfig {
  minimizeOnMobile?: boolean;
  persistState?: boolean;
  closeOnRouteChange?: boolean;
  expandSingle?: boolean; // Only one group can be expanded at a time
  animationDuration?: number;
  tooltipDelay?: number;
}

/*################################(Event Types)################################*/

export interface SidebarEvents {
  onMinimize?: () => void;
  onMaximize?: () => void;
  onGroupExpand?: (groupId: string) => void;
  onGroupCollapse?: (groupId: string) => void;
  onItemSelect?: (route: string) => void;
}
